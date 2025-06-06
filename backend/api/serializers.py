from rest_framework import serializers
from django.contrib.auth import authenticate
from cms.models import *
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password
from django.utils import timezone
from django.db import transaction
from django.utils.text import slugify


# Authentication and Registration Serializers
# User Registration Serializer
class UserRegistrationSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    confirm_password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'username', 'email', 'password', 'confirm_password']
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True}
        }
    
    def validate_email(self, value):
        """
        Validate that the email belongs to UAP (@uap-bd.edu)
        """
        if not value.endswith('@uap-bd.edu'):
            raise serializers.ValidationError("Email must be a valid UAP email address (@uap-bd.edu)")
        
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
            
        return value
    
    def validate_username(self, value):
        """
        Validate that the username is unique
        """
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value
    
    def validate(self, data):
        """
        Check that the passwords match and validate password strength
        """
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Password fields didn't match."})
        
        # Validate password strength
        try:
            validate_password(data['password'])
        except ValidationError as e:
            raise serializers.ValidationError({"password": list(e.messages)})
            
        return data
    
    def create(self, validated_data):
        """
        Create and return a new user, with default profile
        """
        # Remove confirm_password from the data
        validated_data.pop('confirm_password', None)
        
        # Create the user
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        
        # Create associated profile
        UserProfile.objects.create(user=user)
        
        return user
    

# User Login Serializer
class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True, style={'input_type': 'password'})
    
    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        
        if username and password:
            # Check if the input is an email
            if '@' in username:
                try:
                    user_obj = User.objects.get(email=username)
                    username = user_obj.username
                except User.DoesNotExist:
                    raise serializers.ValidationError("User with this email does not exist.")
            
            # Authenticate user
            user = authenticate(username=username, password=password)
            
            if not user:
                raise serializers.ValidationError("Invalid credentials. Please try again.")
            
            if not user.is_active:
                raise serializers.ValidationError("This account has been deactivated.")
        else:
            raise serializers.ValidationError("Both username/email and password are required.")
        
        data['user'] = user
        return data


# User Profile Serializer
class UserProfileSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)  # Display the username instead of the user ID

    class Meta:
        model = UserProfile
        fields = [
            'user',
            'mobile',
            'profile_picture',
            'rating',
            'total_submissions',
            'total_solved',
            'created_at',
            'updated_at',
        ]
        read_only_fields = ['rating', 'total_submissions', 'total_solved', 'created_at', 'updated_at']
       

    def update(self, instance, validated_data):
        """
        Update the user profile with the provided data.
        """
        instance.mobile = validated_data.get('mobile', instance.mobile)
        instance.profile_picture = validated_data.get('profile_picture', instance.profile_picture)
        
        # Save the updated instance
        instance.save()
        
        return instance
    
    def to_representation(self, instance):
        instance.update_stats()  # auto-update before showing
        return super().to_representation(instance)
    

# Contest List Serializer
class ContestListSerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField()
    duration = serializers.SerializerMethodField()

    class Meta:
        model = Contest
        fields = ['id', 'title', 'slug', 'status', 'start_time', 'end_time', 'duration', 'is_rated']

    def get_status(self, obj):
        return obj.status

    def get_duration(self, obj):
        return obj.duration


# Contest Detail Serializer
class ContestDetailSerializer(serializers.ModelSerializer):
    status = serializers.SerializerMethodField()
    duration = serializers.SerializerMethodField()
    created_by = serializers.StringRelatedField()
    participants_count = serializers.SerializerMethodField()

    class Meta:
        model = Contest
        fields = [
            'id', 'title', 'slug', 'description', 'rules', 'start_time', 'end_time', 'status', 
            'duration', 'is_rated', 'is_public', 'max_participants', 'created_by', 'participants_count'
        ]

    def get_status(self, obj):
        return obj.status

    def get_duration(self, obj):
        return obj.duration

    def get_participants_count(self, obj):
        return obj.participants.count()


# Contest Participation Serializer
class ContestParticipationSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField(read_only=True)  # Display username
    contest = serializers.PrimaryKeyRelatedField(queryset=Contest.objects.all())

    class Meta:
        model = ContestParticipation
        fields = ['id', 'user', 'contest', 'registered_at', 'last_activity']
        read_only_fields = ['registered_at', 'last_activity']

    def validate(self, data):
        """Ensure user can participate in the contest."""
        user = self.context['request'].user
        contest = data['contest']
        
        # Check if contest allows more participants
        if contest.max_participants and contest.participants.count() >= contest.max_participants:
            raise serializers.ValidationError("This contest has reached its maximum participant limit.")

        # Check if contest is still open for registration
        if contest.status != 'upcoming':
            raise serializers.ValidationError("You can only join upcoming contests.")

        return data

    def create(self, validated_data):
        """Register user for a contest."""
        user = self.context['request'].user
        contest = validated_data['contest']
        
        participation, created = ContestParticipation.objects.get_or_create(user=user, contest=contest)
        if not created:
            raise serializers.ValidationError("You are already registered for this contest.")
        
        return participation


# Problem Serializer
class ProblemTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProblemTag
        fields = ['id', 'name']


class TestcaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Testcase
        fields = ['id', 'input', 'output', 'is_sample', 'points']


class ProblemListSerializer(serializers.ModelSerializer):
    tags = ProblemTagSerializer(many=True, read_only=True)
    submission_count = serializers.IntegerField(read_only=True)
    acceptance_rate = serializers.FloatField(read_only=True)
    
    class Meta:
        model = Problem
        fields = [
            'id', 'title', 'slug', 'difficulty', 'points', 
            'tags', 'submission_count', 'acceptance_rate'
        ]


class ProblemDetailSerializer(serializers.ModelSerializer):
    tags = ProblemTagSerializer(many=True, read_only=True)
    sample_testcases = serializers.SerializerMethodField()
    submission_count = serializers.IntegerField(read_only=True)
    acceptance_rate = serializers.FloatField(read_only=True)
    
    class Meta:
        model = Problem
        fields = [
            'id', 'title', 'slug', 'statement', 'input_format', 'output_format',
            'constraints', 'sample_input', 'sample_output', 'explanation',
            'time_limit', 'memory_limit', 'difficulty', 'tags', 'points',
            'sample_testcases', 'submission_count', 'acceptance_rate'
        ]
    
    def get_sample_testcases(self, obj):
        """Return only sample testcases for the problem"""
        sample_testcases = obj.testcases.filter(is_sample=True)
        return TestcaseSerializer(sample_testcases, many=True).data


    def validate(self, data):
        """Ensure the problem has at least one sample testcase."""
        if not data.get('testcases') or not any(tc.is_sample for tc in data['testcases']):
            raise serializers.ValidationError("At least one sample testcase is required.")
        
        return data
    
    
# Submission Serializer
class SubmissionTestcaseSerializer(serializers.ModelSerializer):
    testcase_id = serializers.IntegerField(source='testcase.id', read_only=True)
    is_sample = serializers.BooleanField(source='testcase.is_sample', read_only=True)
    
    class Meta:
        model = SubmissionTestcase
        fields = [
            'id', 'testcase_id', 'is_sample', 'status', 
            'execution_time', 'memory_used', 'output'
        ]


class SubmissionCreateSerializer(serializers.ModelSerializer):
    language = serializers.ChoiceField(choices=Submission.LANGUAGE_CHOICES) 
    class Meta:
        model = Submission
        fields = ['problem', 'code', 'language']
    
    def validate(self, data):
        """Ensure problem belongs to an active contest and user can submit"""
        user = self.context['request'].user
        problem = data['problem']
        contest = problem.contest

        # Ensure the language ID is valid
        if data['language'] not in dict(Submission.LANGUAGE_CHOICES).keys():
            raise serializers.ValidationError("Invalid language choice.")
        
        # Check if contest is active
        if contest.status != 'ongoing':
            raise serializers.ValidationError("You can only submit solutions during active contests.")
        
        current_time = timezone.now()
        # Ensure that start_time and end_time are datetime objects
        if isinstance(contest.start_time, str) or isinstance(contest.end_time, str):
            raise serializers.ValidationError("Contest start and end times must be valid datetime objects.")
            
        # Check if user is participating in the contest using ContestParticipation model
        if not ContestParticipation.objects.filter(user=user, contest=contest).exists():
            raise serializers.ValidationError("You must be registered for this contest to submit solutions.")
            
        # Check if problem is visible
        if not problem.is_visible:
            raise serializers.ValidationError("This problem is not available.")
            
        # Add contest to validated data for easy access in create method
        data['contest'] = contest
        data['user'] = user
        
        return data
        
    def create(self, validated_data):
        """Create a submission with initial pending status"""
        submission = Submission.objects.create(
            user=validated_data['user'],
            problem=validated_data['problem'],
            contest=validated_data['contest'],
            code=validated_data['code'],
            language=validated_data['language'],
            status='Pending',
            testcases_total=validated_data['problem'].testcases.count()
        )
        
        return submission


class SubmissionListSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    problem_title = serializers.CharField(source='problem.title', read_only=True)
    
    class Meta:
        model = Submission
        fields = [
            'id', 'username', 'problem_title', 'language', 
            'status', 'execution_time', 'memory_used', 
            'score', 'submitted_at'
        ]


class SubmissionDetailSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    problem_title = serializers.CharField(source='problem.title', read_only=True)
    problem_id = serializers.IntegerField(source='problem.id', read_only=True)
    testcase_results = serializers.SerializerMethodField()
    
    class Meta:
        model = Submission
        fields = [
            'id', 'username', 'problem_title', 'problem_id', 'language', 
            'code', 'status', 'execution_time', 'memory_used', 
            'score', 'submitted_at', 'compiler_output', 
            'testcases_passed', 'testcases_total', 'testcase_results'
        ]
    
    def get_testcase_results(self, obj):
        """Return testcase results, filtering based on user permissions"""
        if obj is None:  # Check if obj is None
            return [] 
        user = self.context.get('request').user
        
        # Get all testcase results for the submission
        testcase_results = obj.testcases.all()
        
        # If user is the submission owner or staff, return all testcases
        if user == obj.user or user.is_staff:
            return SubmissionTestcaseSerializer(testcase_results, many=True).data
        
        # Otherwise, return only sample testcases
        sample_testcase_ids = obj.problem.testcases.filter(is_sample=True).values_list('id', flat=True)
        sample_testcase_results = testcase_results.filter(testcase_id__in=sample_testcase_ids)
        return SubmissionTestcaseSerializer(sample_testcase_results, many=True).data


class SubmissionResultUpdateSerializer(serializers.ModelSerializer):
    """
    Serializer for updating submission results after judge evaluation.
    This is meant to be used internally by the judge service.
    """
    testcase_results = SubmissionTestcaseSerializer(many=True, required=False)
    
    class Meta:
        model = Submission
        fields = [
            'status', 'execution_time', 'memory_used', 'score',
            'compiler_output', 'testcases_passed', 'testcases_total',
            'testcase_results'
        ]
    
    @transaction.atomic
    def update(self, instance, validated_data):
        testcase_results = validated_data.pop('testcase_results', None)
        
        # Update the submission instance
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        
        # Calculate the score based on testcases passed
        instance.score = instance.calculate_score()
        instance.save()
        
        # Update testcase results if provided
        if testcase_results:
            for testcase_data in testcase_results:
                testcase_id = testcase_data.pop('testcase').get('id')
                testcase = Testcase.objects.get(id=testcase_id)
                
                # Update or create the submission testcase
                SubmissionTestcase.objects.update_or_create(
                    submission=instance,
                    testcase=testcase,
                    defaults=testcase_data
                )
        
        return instance   
    


# Practice Problem Serializers
class PracticeProblemListSerializer(serializers.ModelSerializer):
    tags = ProblemTagSerializer(many=True, read_only=True)
    submission_count = serializers.IntegerField(read_only=True)
    acceptance_rate = serializers.FloatField(read_only=True)

    class Meta:
        model = PracticeProblem
        fields = [
            'id', 'title', 'slug', 'difficulty', 'points', 'tags',
            'submission_count', 'acceptance_rate', 'solve_count', 'attempt_count'
        ]


class PracticeProblemDetailSerializer(serializers.ModelSerializer):
    tags = ProblemTagSerializer(many=True, read_only=True)
    submission_count = serializers.SerializerMethodField()
    solve_count = serializers.SerializerMethodField()
    attempt_count = serializers.SerializerMethodField()
    acceptance_rate = serializers.SerializerMethodField()
    formatted_acceptance_rate = serializers.SerializerMethodField()
    view_count = serializers.SerializerMethodField()

    class Meta:
        model = PracticeProblem
        fields = '__all__'
        read_only_fields = [
            'slug', 'submission_count', 'acceptance_rate', 'solve_count',
            'attempt_count', 'formatted_acceptance_rate', 'view_count'
        ]

    def get_submission_count(self, obj):
        return obj.submissions.count()

    def get_solve_count(self, obj):
        return obj.submissions.filter(status='Accepted').values('user').distinct().count()

    def get_attempt_count(self, obj):
        return obj.submissions.values('user').distinct().count()

    def get_acceptance_rate(self, obj):
        total = obj.submissions.count()
        accepted = obj.submissions.filter(status='Accepted').count()
        return round((accepted / total) * 100, 2) if total > 0 else 0.0

    def get_formatted_acceptance_rate(self, obj):
        return f"{self.get_acceptance_rate(obj):.2f}%"

    def get_view_count(self, obj):
        return obj.view_count if hasattr(obj, 'view_count') else 0


# Practice Submission Serializers
class PracticeSubmissionTestcaseSerializer(serializers.ModelSerializer):
    input = serializers.CharField(source='testcase.input', read_only=True)
    expected_output = serializers.CharField(source='testcase.output', read_only=True)
    points = serializers.IntegerField(source='testcase.points', read_only=True)
    is_sample = serializers.BooleanField(source='testcase.is_sample', read_only=True)

    class Meta:
        model = PracticeSubmissionTestcase
        fields = [
            'id',
            'status',
            'execution_time',
            'memory_used',
            'output',
            'input',
            'expected_output',
            'points',
            'is_sample',
        ]

    def validate(self, data):
        """Ensure that the testcase is associated with the submission"""
        submission = self.context['submission']
        testcase = data.get('testcase')
        
        if not PracticeSubmissionTestcase.objects.filter(submission=submission, testcase=testcase).exists():
            raise serializers.ValidationError("This testcase does not belong to the submission.")
        
        return data    


class PracticeSubmissionSerializer(serializers.ModelSerializer):
    testcases = PracticeSubmissionTestcaseSerializer(many=True, read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    language_display = serializers.CharField(source='get_language_display', read_only=True)
    problem_title = serializers.CharField(source='problem.title', read_only=True)
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = PracticeSubmission
        fields = [
            'id',
            'user',
            'username',
            'problem',
            'problem_title',
            'code',
            'language',
            'language_display',
            'submitted_at',
            'status',
            'status_display',
            'execution_time',
            'memory_used',
            'penalty',
            'testcases',
        ]
        read_only_fields = ['submitted_at', 'execution_time', 'memory_used', 'penalty', 'status', 'testcases']  

    def validate(self, data):
        """Ensure that the problem is associated with the user"""
        user = self.context['request'].user
        problem = data.get('problem')
        
        if not PracticeProblem.objects.filter(id=problem.id, users__id=user.id).exists():
            raise serializers.ValidationError("You are not allowed to submit solutions for this problem.")
        
        return data



class PracticeSubmissionCreateSerializer(serializers.ModelSerializer):
    language = serializers.ChoiceField(choices=PracticeSubmission.LANGUAGE_CHOICES)

    class Meta:
        model = PracticeSubmission
        fields = ['problem', 'code', 'language']

    def validate(self, data):
        user = self.context['request'].user
        problem = data['problem']

        # Validate language
        if data['language'] not in dict(PracticeSubmission.LANGUAGE_CHOICES).keys():
            raise serializers.ValidationError("Invalid language selected.")

        # Validate if the problem is visible / active (optional flag)
        if not problem.is_visible:
            raise serializers.ValidationError("This problem is currently not available for practice.")

        # Inject user into validated data
        data['user'] = user
        return data

    def create(self, validated_data):
        # Create a PracticeSubmission with status 'Pending'
        submission = PracticeSubmission.objects.create(
            user=validated_data['user'],
            problem=validated_data['problem'],
            code=validated_data['code'],
            language=validated_data['language'],
            status='Pending',
        )
        return submission



# Announcement Serializers
class AnnouncementListSerializer(serializers.ModelSerializer):
    """Serializer for listing announcements with minimal details"""
    created_by = serializers.StringRelatedField(read_only=True)
    announcement_type_display = serializers.CharField(source='get_announcement_type_display', read_only=True)
    is_expired = serializers.BooleanField(read_only=True)
    time_since = serializers.SerializerMethodField()
    
    class Meta:
        model = Announcement
        fields = [
            'id', 'title', 'announcement_type', 'announcement_type_display',
            'is_featured', 'is_global', 'created_by', 'created_at',
            'is_expired', 'time_since'
        ]
    
    def get_time_since(self, obj):
        """Return a human-readable time since creation"""
        now = timezone.now()
        diff = now - obj.created_at
        
        if diff.days > 30:
            return f"{diff.days // 30} months ago"
        elif diff.days > 0:
            return f"{diff.days} days ago"
        elif diff.seconds > 3600:
            return f"{diff.seconds // 3600} hours ago"
        elif diff.seconds > 60:
            return f"{diff.seconds // 60} minutes ago"
        else:
            return "just now"


class AnnouncementDetailSerializer(serializers.ModelSerializer):
    """Serializer for detailed view of an announcement"""
    created_by = serializers.StringRelatedField(read_only=True)
    contest_title = serializers.CharField(source='contest.title', read_only=True)
    announcement_type_display = serializers.CharField(source='get_announcement_type_display', read_only=True)
    is_expired = serializers.BooleanField(read_only=True)
    
    class Meta:
        model = Announcement
        fields = [
            'id', 'title', 'content', 'announcement_type', 'announcement_type_display',
            'contest', 'contest_title', 'is_featured', 'is_global', 'external_link', 
            'image', 'created_by', 'created_at', 'updated_at', 'expires_at', 'is_expired'
        ]


# Type-specific Announcement Serializers
class TrainingAnnouncementSerializer(serializers.ModelSerializer):
    """Serializer specifically for training announcements"""
    created_by = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = Announcement
        fields = [
            'id', 'title', 'content', 'is_featured', 
            'external_link', 'image', 'created_by', 'created_at'
        ]
    
    def validate(self, data):
        """Force announcement_type to 'training'"""
        data['announcement_type'] = 'training'
        return data


class ResourceAnnouncementSerializer(serializers.ModelSerializer):
    """Serializer specifically for resource announcements"""
    created_by = serializers.StringRelatedField(read_only=True)
    
    class Meta:
        model = Announcement
        fields = [
            'id', 'title', 'content', 'is_featured', 
            'external_link', 'image', 'created_by', 'created_at'
        ]
    
    def validate(self, data):
        """Ensure external_link is provided and set announcement_type"""
        if not data.get('external_link'):
            raise serializers.ValidationError("External link is required for resource announcements")
        
        data['announcement_type'] = 'resource'
        return data


class ContestAnnouncementSerializer(serializers.ModelSerializer):
    """Serializer specifically for contest announcements"""
    created_by = serializers.StringRelatedField(read_only=True)
    contest_title = serializers.CharField(source='contest.title', read_only=True)
    
    class Meta:
        model = Announcement
        fields = [
            'id', 'title', 'content', 'contest', 'contest_title',
            'is_featured', 'created_by', 'created_at'
        ]
    
    def validate(self, data):
        """Ensure contest is provided and set announcement_type"""
        if not data.get('contest'):
            raise serializers.ValidationError("Contest must be specified for contest announcements")
        
        data['announcement_type'] = 'contest'
        return data        