from django.shortcuts import render,get_object_or_404,redirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from .models import *

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
    

@login_required(login_url='admin_login')
def allcontest(request):
    if request.user.is_staff:
        contests = Contest.objects.all()
        return render(request, 'contest/allcontest.html', {'contests': contests})
    else:
        messages.error(request, 'You are not authorized to access this page.')
        return redirect('admin_login')