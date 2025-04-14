from rest_framework import viewsets, permissions, status, mixins
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import logout
from django.shortcuts import get_object_or_404
from cms.models import *
from .serializers import *
from django.contrib.auth import authenticate, logout
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.db import transaction
from django.conf import settings
import requests
import json
import base64
import time
from django.db.models import Count, Sum, Max, Q, FloatField, ExpressionWrapper
from django.db.models.functions import Coalesce
from collections import defaultdict


# Create your views here.
class AuthenticationView(viewsets.GenericViewSet):
    permission_classes = [AllowAny]
    serializer_class = None  

    def get_serializer_class(self):
        if self.action == 'user_register':
            return UserRegistrationSerializer
        elif self.action == 'user_login':
            return UserLoginSerializer
        elif self.action == 'user_profile':
            return UserProfileSerializer
        elif self.action == 'user_logout':
            return None  
        raise AssertionError(f"No serializer class found for action '{self.action}'")
    
    def get_serializer(self, *args, **kwargs):
        serializer_class = self.get_serializer_class()
        if serializer_class is None:
            return None  
        return serializer_class(*args, **kwargs)

    @action(methods=['POST'], detail=False)
    def user_register(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = User.objects.create_user(
            username=serializer.validated_data['username'],
            email=serializer.validated_data['email'],
            password=serializer.validated_data['password'],
            first_name=serializer.validated_data.get('first_name', ''),
            last_name=serializer.validated_data.get('last_name', '')
        )

        # Create a UserProfile for the new user
        UserProfile.objects.create(user=user)

        return Response({'message': 'User registered successfully'}, status=status.HTTP_201_CREATED)

    @action(methods=['POST'], detail=False)
    def user_login(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        username = serializer.validated_data['username'].lower()
        password = serializer.validated_data['password']
        user = authenticate(username=username, password=password)

        if not user:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        token, _ = Token.objects.get_or_create(user=user)

        return Response({'token': token.key, 'user_id': user.pk}, status=status.HTTP_200_OK)

    @action(methods=['POST'], detail=False, permission_classes=[IsAuthenticated])
    def user_logout(self, request):
        request.user.auth_token.delete()
        logout(request)
        return Response({'message': 'User logged out successfully'}, status=status.HTTP_200_OK)

    @action(methods=['GET', 'PUT'], detail=False, permission_classes=[IsAuthenticated])
    def user_profile(self, request):
        """Retrieve or update user profile."""
        user_profile, created = UserProfile.objects.get_or_create(user=request.user)

        if request.method == 'GET':
            serializer = UserProfileSerializer(user_profile)
            return Response(serializer.data, status=status.HTTP_200_OK)

        elif request.method == 'PUT':
            serializer = UserProfileSerializer(user_profile, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Contest View
class ContestViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Viewset for listing and retrieving contests.
    """
    queryset = Contest.objects.filter(is_public=True).order_by('-start_time')
    permission_classes = [AllowAny]  # Anyone can see contests

    def get_serializer_class(self):
        if self.action == "retrieve":
            return ContestDetailSerializer
        return ContestListSerializer

    def get_queryset(self):
        """
        Show only public contests and order them by start time.
        """
        return Contest.objects.filter(is_public=True).order_by('-start_time')


class ContestParticipationView(viewsets.GenericViewSet):
    """
    Handles user participation in contests.
    """
    queryset = ContestParticipation.objects.all()  
    serializer_class = ContestParticipationSerializer
    permission_classes = [IsAuthenticated]  

    @action(detail=True, methods=["POST"])
    def participate(self, request, pk=None):
        """
        Allows an authenticated user to register for a contest.
        """
        contest = get_object_or_404(Contest, pk=pk)

        # Check if the contest is still ongoing/upcoming
        if contest.status == "ended":
            return Response({"error": "This contest has already ended."}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the user is already participating
        if ContestParticipation.objects.filter(user=request.user, contest=contest).exists():
            return Response({"message": "You are already registered for this contest."}, status=status.HTTP_200_OK)

        # Create participation instance
        participation = ContestParticipation.objects.create(user=request.user, contest=contest)
        serializer = ContestParticipationSerializer(participation)

        return Response(serializer.data, status=status.HTTP_201_CREATED)
    

# Problem API's
class ProblemViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    """
    Viewset for listing and retrieving problems.
    """
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = Problem.objects.filter(is_visible=True)
        contest_id = self.request.query_params.get('contest')
        difficulty = self.request.query_params.get('difficulty')
        tag = self.request.query_params.get('tag')

        if contest_id:
            queryset = queryset.filter(contest_id=contest_id)
        if difficulty:
            queryset = queryset.filter(difficulty=difficulty)
        if tag:
            queryset = queryset.filter(tags__name=tag)

        return queryset.order_by('id')

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return ProblemDetailSerializer
        return ProblemListSerializer

    @action(detail=True, methods=['POST'])
    def submit(self, request, pk=None):
        """
        Submit a solution to a problem.
        """
        problem = self.get_object()
        serializer = SubmissionCreateSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            submission = serializer.save()
            # print(f"Submission created: {submission}")
            self._process_submission(submission)
            return Response(SubmissionDetailSerializer(submission, context={'request': request}).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def _process_submission(self, submission):
        problem = submission.problem
        testcases = problem.testcases.all()
        total_points, max_exec_time, max_mem_used = 0, 0, 0
        overall_status = 'Accepted'
        testcases_passed = 0

        with transaction.atomic():
            for testcase in testcases:
                judge0_data = {
                    'source_code': submission.code,
                    'language_id': submission.language,
                    'stdin': testcase.input.replace("\\n", "\n"),
                    'expected_output': testcase.output.strip(),
                    'cpu_time_limit': problem.time_limit,
                    'memory_limit': problem.memory_limit * 1024,
                }
                result = self._submit_to_judge0(judge0_data)
                print("Judge0 Submission Data:", json.dumps(judge0_data, indent=2))
                testcase_result = SubmissionTestcase.objects.create(
                    submission=submission, testcase=testcase,
                    status=result.get('status', {}).get('description', 'Runtime Error'),
                    execution_time=float(result.get('time', 0)) if result.get('time') else 0.0,
                    memory_used=result.get('memory') / 1024 if result.get('memory') else None,
                    output=result.get('stdout', '').strip() if result.get('stdout') else None
                )
                if testcase_result.status == 'Accepted':
                    total_points += testcase.points
                    testcases_passed += 1
                else:
                    overall_status = testcase_result.status
                max_exec_time = max(max_exec_time, testcase_result.execution_time or 0)
                max_mem_used = max(max_mem_used, testcase_result.memory_used or 0)

            submission.status = overall_status
            submission.score = total_points
            submission.execution_time = max_exec_time
            submission.memory_used = max_mem_used
            submission.testcases_passed = testcases_passed
            submission.save()

            # update user profile
            user_profile = submission.user.userprofile
            user_profile.update_stats()

    def _submit_to_judge0(self, data):
        judge0_url = settings.JUDGE0_API_URL
        headers = {'Content-Type': 'application/json', 'X-RapidAPI-Key': settings.JUDGE0_API_KEY}
        try:
            create_response = requests.post(f"{judge0_url}/submissions", headers=headers, data=json.dumps(data))
            create_response.raise_for_status()
            token = create_response.json().get('token')
            for _ in range(10):
                result_response = requests.get(f"{judge0_url}/submissions/{token}", headers=headers)
                result_response.raise_for_status()
                result = result_response.json()
                print("Judge0 Result Response:", result)
                if result.get('status', {}).get('id') not in [1, 2]:
                    return result
                print("Judge0 Submission Response:", result)
                time.sleep(1)
            return {'status': {'description': 'System Error'}}
        except requests.exceptions.RequestException:
            return {'status': {'description': 'API Error'}}


# Submission API's
class SubmissionViewSet(mixins.ListModelMixin, mixins.RetrieveModelMixin, viewsets.GenericViewSet):
    """
    Viewset for listing and retrieving user submissions.
    """
    queryset = Submission.objects.all()
    serializer_class = SubmissionListSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Check if this is a schema generation request
        if getattr(self, 'swagger_fake_view', False):
            return Submission.objects.none()  

        user = self.request.user

        # Ensure the user is authenticated
        if not user.is_authenticated:
            return Submission.objects.none()

        # Filter submissions for the authenticated user
        queryset = self.queryset.filter(user=user)
        if problem_id := self.request.query_params.get('problem'):
            queryset = queryset.filter(problem_id=problem_id)
        if contest_id := self.request.query_params.get('contest'):
            queryset = queryset.filter(problem__contest_id=contest_id)
        if status_filter := self.request.query_params.get('status'):
            queryset = queryset.filter(status=status_filter)
        return queryset.order_by('-submitted_at')

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return SubmissionDetailSerializer
        return SubmissionListSerializer

    @action(detail=True, methods=['GET'])
    def testcases(self, request, pk=None):
        submission = self.get_object()
        if request.user != submission.user and not request.user.is_staff:
            return Response({"error": "You don't have permission to view these testcase results."}, status=status.HTTP_403_FORBIDDEN)
        testcase_results = submission.testcases.all()
        return Response(SubmissionTestcaseSerializer(testcase_results, many=True).data)

    @action(detail=False, methods=['GET'])
    def leaderboard(self, request):
        problem_id = request.query_params.get('problem')
        contest_id = request.query_params.get('contest')

        if not problem_id and not contest_id:
            return Response({"error": "Either problem or contest parameter is required."}, status=status.HTTP_400_BAD_REQUEST)

        # Filter base queryset
        submissions = Submission.objects.select_related("user", "problem").all()
        if problem_id:
            submissions = submissions.filter(problem_id=problem_id)
        else:
            submissions = submissions.filter(problem__contest_id=contest_id)

        leaderboard_data = defaultdict(lambda: {
            "username": "",
            "total_score": 0,
            "total_submissions": 0,
            "accepted_submissions": 0,
            "wrong_submissions": 0,
            "problems_solved": 0,
            "total_time": 0.0,
            "attempts_per_problem": {},
        })

        for sub in submissions.order_by('submitted_at'):
            user = sub.user.username
            problem = sub.problem_id
            key = user

            data = leaderboard_data[key]
            data["username"] = user
            data["total_score"] += sub.score
            data["total_submissions"] += 1

            if sub.status == "Accepted":
                data["accepted_submissions"] += 1

                # First accepted submission for a problem
                if problem not in data["attempts_per_problem"]:
                    data["problems_solved"] += 1
                    data["total_time"] += sub.execution_time or 0
            else:
                data["wrong_submissions"] += 1

            # Track attempts per problem until accepted
            if problem not in data["attempts_per_problem"]:
                data["attempts_per_problem"][problem] = {
                    "attempts": 1,
                    "solved": sub.status == "Accepted"
                }
            else:
                if not data["attempts_per_problem"][problem]["solved"]:
                    data["attempts_per_problem"][problem]["attempts"] += 1
                    if sub.status == "Accepted":
                        data["attempts_per_problem"][problem]["solved"] = True

        # Format leaderboard
        leaderboard = []
        for data in leaderboard_data.values():
            total_attempts = sum(p["attempts"] for p in data["attempts_per_problem"].values())
            data["average_attempts_per_problem"] = (
                total_attempts / data["problems_solved"] if data["problems_solved"] else 0
            )
            leaderboard.append(data)

        # Sort leaderboard
        leaderboard.sort(key=lambda x: (-x["total_score"], -x["accepted_submissions"], x["total_time"]))

        return Response(leaderboard)

    
class PracticeProblemViewSet(mixins.ListModelMixin,
                             mixins.RetrieveModelMixin,
                             viewsets.GenericViewSet):
    """
    Viewset for Practice Problems:
    - List (public)
    - Detail by slug (authenticated only)
    """
    queryset = PracticeProblem.objects.filter(is_visible=True)
    lookup_field = 'slug'

    def get_permissions(self):
        if self.action == 'list':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return PracticeProblemDetailSerializer
        return PracticeProblemListSerializer

    @action(detail=True, methods=['get'])
    def submissions(self, request, slug=None):
        """Return current user's submissions for this practice problem"""
        problem = self.get_object()
        submissions = PracticeSubmission.objects.filter(
            user=request.user,
            problem=problem
        ).order_by('-submitted_at')

        page = self.paginate_queryset(submissions)
        if page is not None:
            serializer = PracticeSubmissionListSerializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = PracticeSubmissionListSerializer(submissions, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def tags(self, request):
        """Return all tags used in visible practice problems"""
        tags = ProblemTag.objects.filter(practice_problems__is_visible=True).distinct()
        serializer = ProblemTagSerializer(tags, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Return user's practice problem statistics"""
        total_problems = self.queryset.count()
        solved = 0
        attempted = 0

        if request.user.is_authenticated:
            solved = PracticeProblem.objects.filter(
                submissions__user=request.user,
                submissions__status='Accepted',
                is_visible=True
            ).distinct().count()

            attempted = PracticeProblem.objects.filter(
                submissions__user=request.user,
                is_visible=True
            ).distinct().count()

        return Response({
            'total': total_problems,
            'solved': solved,
            'attempted': attempted
        })  

   