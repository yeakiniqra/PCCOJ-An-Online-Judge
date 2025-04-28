from django.shortcuts import render,get_object_or_404,redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from .models import *
from django.utils.dateparse import parse_datetime
from django.utils.text import slugify
from django.utils import timezone
from django.db.models import Count, Avg
from django.contrib.auth.models import User
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string



# Create your views here.
# Admin login page
def admin_login(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)
        if user is not None and user.is_staff: 
            login(request, user)
            messages.success(request, 'Logged in successfully.')
            return redirect('dashboard_page')
        else:
            messages.error(request, 'Invalid credentials or not an admin.')
    return render(request, 'auth/login.html')

# Admin logout page
def admin_logout(request):
    logout(request)
    messages.info(request, 'Logged out successfully.')
    return redirect('admin_login')


# Admin dashboard page
@login_required(login_url='admin_login')
def dashboard_page(request):
    if request.user.is_staff:
        # Fetch statistics from models
        context = {
            # User statistics
            'total_users': User.objects.count(),
            'active_users': User.objects.filter(is_active=True).count(),
            'new_users_today': User.objects.filter(date_joined__date=timezone.now().date()).count(),
            
            # Problem statistics
            'total_practice_problems': PracticeProblem.objects.count(),
            'featured_problems': PracticeProblem.objects.filter(is_featured=True).count(),
            
            # Submission statistics
            'total_submissions': Submission.objects.count(),
            'recent_submissions': Submission.objects.order_by('-submitted_at')[:10],
            'accepted_submissions': Submission.objects.filter(status='Accepted').count(),
            
            # Contest statistics
            'ongoing_contests': Contest.objects.filter(
                start_time__lte=timezone.now(),
                end_time__gte=timezone.now()
            ).count(),
            'upcoming_contests': Contest.objects.filter(start_time__gt=timezone.now()).count(),
            'total_contests': Contest.objects.count(),
            
            # Activity statistics
            'recent_activities': Submission.objects.select_related('user', 'problem')
                .order_by('-submitted_at')[:5],
                
            # Charts data
            'submission_by_status': [
                Submission.objects.filter(status='Accepted').count(),
                Submission.objects.filter(status='Wrong Answer').count(),
                Submission.objects.filter(status='Time Limit Exceeded').count(),
                Submission.objects.filter(status='Runtime Error').count(),
                Submission.objects.filter(status='Compilation Error').count(),
            ],
            
            # Problem difficulty distribution
            'problems_by_difficulty': [
                PracticeProblem.objects.filter(difficulty='Easy').count(),
                PracticeProblem.objects.filter(difficulty='Medium').count(),
                PracticeProblem.objects.filter(difficulty='Hard').count(),
                PracticeProblem.objects.filter(difficulty='Very Hard').count(),
            ],
        }
        return render(request, 'dashboard/dashboard.html', context)
    else:
        messages.error(request, 'You are not authorized to access this page.')
        return redirect('admin_login')
    

# Contest Management page
@login_required(login_url='admin_login')
def allcontest(request):
    if request.user.is_staff:
        contests = Contest.objects.all()
        return render(request, 'contest/allcontest.html', {'contests': contests})
    else:
        messages.error(request, 'You are not authorized to access this page.')
        return redirect('admin_login')
    
def editcontest(request, contest_id):
    contest = get_object_or_404(Contest, id=contest_id)
    
    if request.method == 'POST':
        contest.title = request.POST.get('title')
        contest.description = request.POST.get('description')
        contest.rules = request.POST.get('rules') or None
        contest.start_time = parse_datetime(request.POST.get('start_time'))
        contest.end_time = parse_datetime(request.POST.get('end_time'))
        contest.is_public = request.POST.get('is_public') == 'on'
        contest.is_rated = request.POST.get('is_rated') == 'on'
        contest.max_participants = request.POST.get('max_participants') or None
        contest.slug = slugify(contest.title)  # Update slug based on the new title

        # Validate contest time
        if contest.start_time >= contest.end_time:
            messages.error(request, 'End time must be after start time.')
            return redirect('editcontest', contest_id=contest.id)

        contest.save()
        messages.success(request, 'Contest updated successfully.')
        return redirect('allcontest')

    return render(request, 'contest/editcontest.html', {'contest': contest})



def deletecontest(request, contest_id):
    contest = get_object_or_404(Contest, id=contest_id)
    
    # Delete the contest
    contest.delete()
    messages.success(request, 'Contest deleted successfully.')
    return redirect('allcontest')
    
def addcontest(request):
    if request.user.is_staff:
        if request.method == 'POST':
            title = request.POST.get('title')
            description = request.POST.get('description')
            rules = request.POST.get('rules') or None
            start_time = parse_datetime(request.POST.get('start_time'))
            end_time = parse_datetime(request.POST.get('end_time'))
            is_public = request.POST.get('is_public') == 'on'
            is_rated = request.POST.get('is_rated') == 'on'
            max_participants = request.POST.get('max_participants') or None

            # Basic validation (optional)
            if start_time >= end_time:
                messages.error(request, 'End time must be after start time.')
                return redirect('addcontest')

            # Create a new contest instance
            Contest.objects.create(
                title=title,
                slug=slugify(title),
                description=description,
                rules=rules,
                start_time=start_time,
                end_time=end_time,
                created_by=request.user,
                is_public=is_public,
                is_rated=is_rated,
                max_participants=max_participants if max_participants else None,
            )

            messages.success(request, 'Contest added successfully.')
            return redirect('allcontest')  # make sure this URL exists

        return render(request, 'contest/addcontest.html')
    else:
        messages.error(request, 'You are not authorized to access this page.')
        return redirect('admin_login')
    


# Practice Problem Management page
@login_required(login_url='admin_login')
def practice_problems_list(request):
    if request.user.is_staff:
        problems = PracticeProblem.objects.all()
        context = {
            'problems': problems
        }
        return render(request, 'practice/practice_problems_list.html', context)
    else:
        messages.error(request, 'You do not have permission to access this page.')
        return redirect('home')
    

@login_required(login_url='admin_login')
def addpracticeproblem(request):
    if request.user.is_staff:
        if request.method == 'POST':
            title = request.POST.get('title')
            # Generate slug from title
            slug = slugify(title)
            statement = request.POST.get('statement')
            input_format = request.POST.get('input_format')
            output_format = request.POST.get('output_format')
            constraints = request.POST.get('constraints')
            sample_input = request.POST.get('sample_input')
            sample_output = request.POST.get('sample_output')
            explanation = request.POST.get('explanation')
            time_limit = request.POST.get('time_limit', 1.0)
            memory_limit = request.POST.get('memory_limit', 256)
            difficulty = request.POST.get('difficulty')
            points = request.POST.get('points', 100)
            editorial = request.POST.get('editorial')
            is_featured = request.POST.get('is_featured') == 'on'
            is_visible = request.POST.get('is_visible') == 'on'
            
            # Create the problem
            problem = PracticeProblem.objects.create(
                title=title,
                slug=slug,
                statement=statement,
                input_format=input_format,
                output_format=output_format,
                constraints=constraints,
                sample_input=sample_input,
                sample_output=sample_output,
                explanation=explanation,
                time_limit=time_limit,
                memory_limit=memory_limit,
                difficulty=difficulty,
                points=points,
                editorial=editorial,
                is_featured=is_featured,
                is_visible=is_visible
            )
            
            # Handle tags from multi-select
            selected_tags = request.POST.getlist('tags')
            for tag_id in selected_tags:
                tag = ProblemTag.objects.get(id=tag_id)
                problem.tags.add(tag)
            
            # Handle testcases
            sample_testcase_input = request.POST.get('sample_testcase_input')
            sample_testcase_output = request.POST.get('sample_testcase_output')
            
            if sample_testcase_input and sample_testcase_output:
                PracticeTestcase.objects.create(
                    problem=problem,
                    input=sample_testcase_input,
                    output=sample_testcase_output,
                    is_sample=True
                )
            
            # Handle non-sample testcases
            testcase_count = int(request.POST.get('testcase_count', 0))
            for i in range(testcase_count):
                testcase_input = request.POST.get(f'testcase_input_{i}')
                testcase_output = request.POST.get(f'testcase_output_{i}')
                testcase_points = request.POST.get(f'testcase_points_{i}', 0)
                
                if testcase_input and testcase_output:
                    PracticeTestcase.objects.create(
                        problem=problem,
                        input=testcase_input,
                        output=testcase_output,
                        is_sample=False,
                        points=testcase_points
                    )
            
            messages.success(request, 'Practice problem created successfully!')
            return redirect('practice_problems_list')  
        else:
            # Display the empty form
            difficulty_choices = PracticeProblem.DIFFICULTY_CHOICES
            # Get all available tags
            all_tags = ProblemTag.objects.all()
            context = {
                'difficulty_choices': difficulty_choices,
                'all_tags': all_tags,
                'mode': 'add'
            }
            return render(request, 'practice/practice_problem_form.html', context)
    else:
        messages.error(request, 'You do not have permission to access this page.')
        return redirect('dashboard_page')


@login_required(login_url='admin_login')
def updatepracticeproblem(request, problem_id):
    if request.user.is_staff:
        problem = get_object_or_404(PracticeProblem, id=problem_id)
        
        if request.method == 'POST':
            # Update the problem fields
            problem.title = request.POST.get('title')
            problem.slug = slugify(request.POST.get('title'))
            problem.statement = request.POST.get('statement')
            problem.input_format = request.POST.get('input_format')
            problem.output_format = request.POST.get('output_format')
            problem.constraints = request.POST.get('constraints')
            problem.sample_input = request.POST.get('sample_input')
            problem.sample_output = request.POST.get('sample_output')
            problem.explanation = request.POST.get('explanation')
            problem.time_limit = request.POST.get('time_limit', 1.0)
            problem.memory_limit = request.POST.get('memory_limit', 256)
            problem.difficulty = request.POST.get('difficulty')
            problem.points = request.POST.get('points', 100)
            problem.editorial = request.POST.get('editorial')
            problem.is_featured = request.POST.get('is_featured') == 'on'
            problem.is_visible = request.POST.get('is_visible') == 'on'
            
            problem.save()
            
            # Update tags
            problem.tags.clear()
            selected_tags = request.POST.getlist('tags')
            for tag_id in selected_tags:
                tag = ProblemTag.objects.get(id=tag_id)
                problem.tags.add(tag)
            
            
            problem.testcases.all().delete()
            
            # Add sample testcase
            sample_testcase_input = request.POST.get('sample_testcase_input')
            sample_testcase_output = request.POST.get('sample_testcase_output')
            
            if sample_testcase_input and sample_testcase_output:
                PracticeTestcase.objects.create(
                    problem=problem,
                    input=sample_testcase_input,
                    output=sample_testcase_output,
                    is_sample=True
                )
            
            # Add non-sample testcases
            testcase_count = int(request.POST.get('testcase_count', 0))
            for i in range(testcase_count):
                testcase_input = request.POST.get(f'testcase_input_{i}')
                testcase_output = request.POST.get(f'testcase_output_{i}')
                testcase_points = request.POST.get(f'testcase_points_{i}', 0)
                
                if testcase_input and testcase_output:
                    PracticeTestcase.objects.create(
                        problem=problem,
                        input=testcase_input,
                        output=testcase_output,
                        is_sample=False,
                        points=testcase_points
                    )
            
            messages.success(request, 'Practice problem updated successfully!')
            return redirect('practice_problems_list')  
        else:
            
            difficulty_choices = PracticeProblem.DIFFICULTY_CHOICES
            
            
            all_tags = ProblemTag.objects.all()
            
            
            sample_testcase = problem.testcases.filter(is_sample=True).first()
            other_testcases = problem.testcases.filter(is_sample=False)
            
            context = {
                'problem': problem,
                'difficulty_choices': difficulty_choices,
                'all_tags': all_tags,
                'sample_testcase': sample_testcase,
                'other_testcases': other_testcases,
                'mode': 'edit'
            }
            return render(request, 'practice/practice_problem_form.html', context)
    else:
        messages.error(request, 'You do not have permission to access this page.')
        return redirect('dashboard_page')

@login_required(login_url='admin_login')
def deletepracticeproblem(request, problem_id):
    if request.user.is_staff:
        problem = get_object_or_404(PracticeProblem, id=problem_id)
        
        if request.method == 'POST':
            
            problem.delete()
            messages.success(request, 'Practice problem deleted successfully!')
            return redirect('practice_problems_list')
        else:
          
            context = {
                'problem': problem
            }
            return render(request, 'practice/practice_problem_confirm_delete.html', context)
    else:
        messages.error(request, 'You do not have permission to access this page.')
        return redirect('dashboard_page')   
    

@login_required(login_url='admin_login')
def contest_problems_list(request):
    if request.user.is_staff:
        problems = Problem.objects.filter(is_visible=True)  
        context = {
            'problems': problems
        }
        return render(request, 'contest_problem/contest_problems_list.html', context)
    else:
        messages.error(request, 'You do not have permission to access this page.')
        return redirect('home')
    


@login_required(login_url='admin_login')
def addproblem(request):
    if request.user.is_staff:
        if request.method == 'POST':
            title = request.POST.get('title')
            slug = slugify(title)
            statement = request.POST.get('statement')
            input_format = request.POST.get('input_format')
            output_format = request.POST.get('output_format')
            constraints = request.POST.get('constraints')
            sample_input = request.POST.get('sample_input')
            sample_output = request.POST.get('sample_output')
            explanation = request.POST.get('explanation')
            time_limit = float(request.POST.get('time_limit', 1.0))
            memory_limit = int(request.POST.get('memory_limit', 256))
            difficulty = request.POST.get('difficulty')
            points = int(request.POST.get('points', 100))
            is_visible = request.POST.get('is_visible') == 'on'

            contest_id = request.POST.get('contest_id')
            contest = get_object_or_404(Contest, id=contest_id)

            problem = Problem.objects.create(
                title=title,
                slug=slug,
                statement=statement,
                input_format=input_format,
                output_format=output_format,
                constraints=constraints,
                sample_input=sample_input,
                sample_output=sample_output,
                explanation=explanation,
                time_limit=time_limit,
                memory_limit=memory_limit,
                difficulty=difficulty,
                points=points,
                is_visible=is_visible,
                contest=contest
            )

            # Tags
            selected_tags = request.POST.getlist('tags')
            for tag_id in selected_tags:
                tag = ProblemTag.objects.get(id=tag_id)
                problem.tags.add(tag)

            # Sample testcase
            sample_testcase_input = request.POST.get('sample_testcase_input')
            sample_testcase_output = request.POST.get('sample_testcase_output')
            if sample_testcase_input and sample_testcase_output:
                Testcase.objects.create(
                    problem=problem,
                    input=sample_testcase_input,
                    output=sample_testcase_output,
                    is_sample=True
                )

            # Other testcases
            testcase_count = int(request.POST.get('testcase_count', 0))
            for i in range(testcase_count):
                testcase_input = request.POST.get(f'testcase_input_{i}')
                testcase_output = request.POST.get(f'testcase_output_{i}')
                testcase_points = request.POST.get(f'testcase_points_{i}', 0)
                if testcase_input and testcase_output:
                    Testcase.objects.create(
                        problem=problem,
                        input=testcase_input,
                        output=testcase_output,
                        is_sample=False,
                        points=testcase_points
                    )

            messages.success(request, 'Problem added successfully!')
            return redirect('contest_problems_list')

        else:
            contests = Contest.objects.all()
            all_tags = ProblemTag.objects.all()
            difficulty_choices = Problem.DIFFICULTY_CHOICES
            context = {
                'mode': 'add',
                'contests': contests,
                'all_tags': all_tags,
                'difficulty_choices': difficulty_choices,
            }
            return render(request, 'contest_problem/add_problem_form.html', context)
    else:
        messages.error(request, 'You do not have permission to access this page.')
        return redirect('home')



@login_required(login_url='admin_login')
def edit_problem(request, problem_id):
    if request.user.is_staff:
        problem = get_object_or_404(Problem.objects.select_related('contest'), id=problem_id)
        contests = Contest.objects.all()

        if request.method == 'POST':
            contest_id = request.POST.get('contest_id')
            if contest_id:
                problem.contest = get_object_or_404(Contest, id=contest_id)
            problem.title = request.POST.get('title')
            problem.slug = slugify(problem.title)
            problem.statement = request.POST.get('statement')
            problem.input_format = request.POST.get('input_format')
            problem.output_format = request.POST.get('output_format')
            problem.constraints = request.POST.get('constraints')
            problem.sample_input = request.POST.get('sample_input')
            problem.sample_output = request.POST.get('sample_output')
            problem.explanation = request.POST.get('explanation')
            problem.time_limit = float(request.POST.get('time_limit', 1.0))
            problem.memory_limit = int(request.POST.get('memory_limit', 256))
            problem.difficulty = request.POST.get('difficulty')
            problem.points = int(request.POST.get('points', 100))
            problem.is_visible = request.POST.get('is_visible') == 'on'

            problem.save()

            # Tags
            selected_tags = request.POST.getlist('tags')
            problem.tags.clear()
            for tag_id in selected_tags:
                tag = ProblemTag.objects.get(id=tag_id)
                problem.tags.add(tag)

            # Delete existing testcases
            problem.testcases.all().delete()

            # Sample testcase
            sample_testcase_input = request.POST.get('sample_testcase_input')
            sample_testcase_output = request.POST.get('sample_testcase_output')
            if sample_testcase_input and sample_testcase_output:
                Testcase.objects.create(
                    problem=problem,
                    input=sample_testcase_input,
                    output=sample_testcase_output,
                    is_sample=True
                )

            # Other testcases
            testcase_count = int(request.POST.get('testcase_count', 0))
            for i in range(testcase_count):
                testcase_input = request.POST.get(f'testcase_input_{i}')
                testcase_output = request.POST.get(f'testcase_output_{i}')
                testcase_points = request.POST.get(f'testcase_points_{i}', 0)
                if testcase_input and testcase_output:
                    Testcase.objects.create(
                        problem=problem,
                        input=testcase_input,
                        output=testcase_output,
                        is_sample=False,
                        points=testcase_points
                    )

            messages.success(request, 'Problem updated successfully!')
            return redirect('contest_problems_list')


        else:
            difficulty_choices = Problem.DIFFICULTY_CHOICES
            all_tags = ProblemTag.objects.all()
            sample_testcase = problem.testcases.filter(is_sample=True).first()
            other_testcases = problem.testcases.filter(is_sample=False)
            context = {
                'problem': problem,
                'difficulty_choices': difficulty_choices,
                'all_tags': all_tags,
                'sample_testcase': sample_testcase,
                'contests': contests,
                'other_testcases': other_testcases,
                'mode': 'edit'
            }
            return render(request, 'contest_problem/add_problem_form.html', context)
    else:
        messages.error(request, 'You do not have permission to access this page.')
        return redirect('home')
   
    


@login_required(login_url='admin_login')
def delete_problem(request, problem_id):
    if request.user.is_staff:
        problem = get_object_or_404(Problem, id=problem_id)
        problem.delete()
        messages.success(request, 'Problem deleted successfully!')
        return redirect('contest_problems_list')  
    else:
        messages.error(request, 'You do not have permission to access this page.')
        return redirect('home')
    

# Contest Analytics page
@login_required(login_url='admin_login')
def contest_analytics(request):
    if not request.user.is_staff:
        messages.error(request, "You do not have permission to access this page.")
        return redirect('home')

    contests = Contest.objects.all()
    total_contests = contests.count()
    total_public = contests.filter(is_public=True).count()
    total_private = contests.filter(is_public=False).count()

    upcoming = 0
    ongoing = 0
    ended = 0
    for contest in contests:
        status = contest.status
        if status == 'upcoming':
            upcoming += 1
        elif status == 'ongoing':
            ongoing += 1
        else:
            ended += 1

    total_participants = ContestParticipation.objects.count()
    average_participants = ContestParticipation.objects.values('contest').annotate(count=Count('user')).aggregate(avg=Avg('count'))['avg'] or 0

    
    top_contests = Contest.objects.annotate(participant_count=Count('contestparticipation')).order_by('-participant_count')[:5]

    context = {
        'total_contests': total_contests,
        'total_public': total_public,
        'total_private': total_private,
        'upcoming': upcoming,
        'ongoing': ongoing,
        'ended': ended,
        'total_participants': total_participants,
        'average_participants': round(average_participants, 2),
        'top_contests': top_contests,
    }

    return render(request, 'contest_problem/contest_analytics.html', context)    

@login_required(login_url='admin_login')
def all_submission(request):
    submissions = Submission.objects.select_related('user', 'problem', 'contest').order_by('-submitted_at')
    return render(request, 'dashboard/all_submissions.html', {'submissions': submissions})

@login_required(login_url='admin_login')
def ban_user(request, user_id):
    user_to_ban = get_object_or_404(User, id=user_id)
    user_to_ban.is_active = False
    user_to_ban.save()
    messages.success(request, f'User {user_to_ban.username} has been banned.')
    return redirect('all_submission')


@login_required(login_url='admin_login')
def view_all_users(request):
    users = User.objects.select_related('profile').all()  
    return render(request, 'dashboard/all_users.html', {'users': users})


# Announcement Management
@login_required(login_url='admin_login')
def announcement_list(request):
    announcements = Announcement.objects.all()
    return render(request, 'announcement/announcement_list.html', {'announcements': announcements})


@login_required(login_url='admin_login')
def announcement_create(request):
    if request.method == 'POST':
        title = request.POST.get('title')
        content = request.POST.get('content')
        announcement_type = request.POST.get('announcement_type', 'normal')
        is_featured = request.POST.get('is_featured') == 'on'
        is_global = request.POST.get('is_global') == 'on'
        external_link = request.POST.get('external_link')
        expires_at = request.POST.get('expires_at')
        image = request.FILES.get('image')

        announcement = Announcement.objects.create(
            title=title,
            content=content,
            announcement_type=announcement_type,
            is_featured=is_featured,
            is_global=is_global,
            external_link=external_link,
            created_by=request.user,
        )

        if image:
            announcement.image = image

        if expires_at:
            announcement.expires_at = expires_at

        announcement.save()

        return redirect('announcement_list')
    
    return render(request, 'announcement/announcement_form.html', {'action': 'Create'})


@login_required(login_url='admin_login')
def announcement_update(request, pk):
    announcement = get_object_or_404(Announcement, pk=pk)

    if request.method == 'POST':
        announcement.title = request.POST.get('title')
        announcement.content = request.POST.get('content')
        announcement.announcement_type = request.POST.get('announcement_type', 'normal')
        announcement.is_featured = request.POST.get('is_featured') == 'on'
        announcement.is_global = request.POST.get('is_global') == 'on'
        announcement.external_link = request.POST.get('external_link')
        expires_at = request.POST.get('expires_at')
        image = request.FILES.get('image')

        if image:
            announcement.image = image
        
        if expires_at:
            announcement.expires_at = expires_at
        else:
            announcement.expires_at = None

        announcement.save()
        return redirect('announcement_list')

    return render(request, 'announcement/announcement_form.html', {'action': 'Update', 'announcement': announcement})


@login_required(login_url='admin_login')
def announcement_delete(request, pk):
    announcement = get_object_or_404(Announcement, pk=pk)
    announcement.delete()
    return redirect('announcement_list')


@login_required(login_url='admin_login')
def send_email_notification(request):
    users = User.objects.filter(is_active=True)
    
    if request.method == 'POST':
        subject = request.POST.get('subject')
        message = request.POST.get('message')

        if not subject or not message:
            messages.error(request, "Subject and message are required.")
            return redirect('send_email_notification')

        recipient_list = [user.email for user in users if user.email]

        if not recipient_list:
            messages.error(request, "No active users with email addresses found.")
            return redirect('send_email_notification')

        # You can also load an HTML email template if you want
        html_message = render_to_string('dashboard/email_template.html', {'message': message})

        send_mail(
            subject=subject,
            message=message,  # Fallback for email clients that do not support HTML
            from_email=settings.EMAIL_HOST_USER,
            recipient_list=recipient_list,
            fail_silently=False,
            html_message=html_message
        )

        messages.success(request, "Email sent successfully to all active users!")
        return redirect('send_email_notification')

    return render(request, 'dashboard/send_email.html')