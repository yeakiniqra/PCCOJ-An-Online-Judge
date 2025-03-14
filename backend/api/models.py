from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

# User Profile 
class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile', db_index=True)
    mobile = models.CharField(max_length=15, null=True, blank=True)
    profile_picture = models.ImageField(upload_to='profile_pictures/', null=True, blank=True)
    rating = models.IntegerField(default=1500)
    total_submissions = models.IntegerField(default=0)
    total_solved = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['rating']),
            models.Index(fields=['total_solved']),
        ]

    def __str__(self):
        return self.user.username
    
    def update_stats(self):
        """Update user statistics based on submissions"""
        self.total_submissions = self.user.submissions.count()
        self.total_solved = self.user.submissions.filter(status='Accepted').values('problem').distinct().count()
        self.save()

# Contest Model 
class Contest(models.Model):
    CONTEST_STATUS_CHOICES = [
        ('upcoming', 'Upcoming'),
        ('ongoing', 'Ongoing'),
        ('ended', 'Ended'),
    ]
    
    title = models.CharField(max_length=255, db_index=True)
    slug = models.SlugField(max_length=255, unique=True)
    description = models.TextField()
    rules = models.TextField(blank=True, null=True)
    start_time = models.DateTimeField(db_index=True)
    end_time = models.DateTimeField(db_index=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_contests')
    participants = models.ManyToManyField(User, related_name='contests', through='ContestParticipation')
    is_public = models.BooleanField(default=True)
    is_rated = models.BooleanField(default=True)
    max_participants = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['start_time', 'end_time']),
            models.Index(fields=['is_public']),
        ]

    def __str__(self):
        return self.title
    
    @property
    def status(self):
        now = timezone.now()
        if now < self.start_time:
            return 'upcoming'
        elif now >= self.start_time and now <= self.end_time:
            return 'ongoing'
        else:
            return 'ended'
    
    @property
    def duration(self):
        """Returns contest duration in minutes"""
        return (self.end_time - self.start_time).total_seconds() / 60

# Contest Participation tracking
class ContestParticipation(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    contest = models.ForeignKey(Contest, on_delete=models.CASCADE)
    registered_at = models.DateTimeField(auto_now_add=True)
    last_activity = models.DateTimeField(auto_now=True)
    
    class Meta:
        unique_together = ('user', 'contest')
        indexes = [
            models.Index(fields=['user', 'contest']),
        ]

# Problem Model 
class Problem(models.Model):
    DIFFICULTY_CHOICES = [
        ('Easy', 'Easy'), 
        ('Medium', 'Medium'), 
        ('Hard', 'Hard'),
        ('Very Hard', 'Very Hard')
    ]
    
    contest = models.ForeignKey(Contest, on_delete=models.CASCADE, related_name='problems')
    title = models.CharField(max_length=255, db_index=True)
    slug = models.SlugField(max_length=255)
    statement = models.TextField()
    input_format = models.TextField()
    output_format = models.TextField()
    constraints = models.TextField()
    sample_input = models.TextField()
    sample_output = models.TextField()
    explanation = models.TextField(blank=True, null=True)
    time_limit = models.FloatField(default=1.0)  # in seconds
    memory_limit = models.IntegerField(default=256)  # in MB
    difficulty = models.CharField(max_length=50, choices=DIFFICULTY_CHOICES, db_index=True)
    tags = models.ManyToManyField('ProblemTag', related_name='problems')
    points = models.IntegerField(default=100)
    is_visible = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('contest', 'slug')
        indexes = [
            models.Index(fields=['difficulty', 'points']),
            models.Index(fields=['is_visible']),
        ]

    def __str__(self):
        return self.title
    
    @property
    def submission_count(self):
        return self.submissions.count()
    
    @property
    def acceptance_rate(self):
        total = self.submissions.count()
        if total == 0:
            return 0
        accepted = self.submissions.filter(status='Accepted').count()
        return (accepted / total) * 100

# Problem Tags
class ProblemTag(models.Model):
    name = models.CharField(max_length=50, unique=True)
    
    def __str__(self):
        return self.name

# Submission Model 
class Submission(models.Model):
    STATUS_CHOICES = [
        ('Pending', 'Pending'), 
        ('Accepted', 'Accepted'), 
        ('Wrong Answer', 'Wrong Answer'), 
        ('Runtime Error', 'Runtime Error'), 
        ('Time Limit Exceeded', 'Time Limit Exceeded'),
        ('Compilation Error', 'Compilation Error'),
        ('Memory Limit Exceeded', 'Memory Limit Exceeded')
    ]
    
    LANGUAGE_CHOICES = [
        ('Python', 'Python'), 
        ('C++', 'C++'), 
        ('Java', 'Java'),
        ('JavaScript', 'JavaScript'),
        ('Go', 'Go'),
        ('Rust', 'Rust')
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='submissions')
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE, related_name='submissions')
    contest = models.ForeignKey(Contest, on_delete=models.CASCADE, related_name='submissions')
    code = models.TextField()
    language = models.CharField(max_length=50, choices=LANGUAGE_CHOICES)
    submitted_at = models.DateTimeField(auto_now_add=True, db_index=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Pending', db_index=True)
    execution_time = models.FloatField(null=True, blank=True)  # in seconds
    memory_used = models.FloatField(null=True, blank=True)  # in MB
    score = models.IntegerField(default=0)
    compiler_output = models.TextField(blank=True, null=True)
    testcases_passed = models.IntegerField(default=0)
    testcases_total = models.IntegerField(default=0)

    class Meta:
        indexes = [
            models.Index(fields=['user', 'problem']),
            models.Index(fields=['contest', 'user']),
            models.Index(fields=['status', 'submitted_at']),
        ]

    def __str__(self):
        return f'{self.user.username} - {self.problem.title}'
    
    def calculate_score(self):
        """Calculate submission score based on testcases"""
        if self.status == 'Accepted':
            return self.problem.points
        elif self.testcases_total > 0:
            return int((self.testcases_passed / self.testcases_total) * self.problem.points * 0.3)
        return 0

# Leaderboard Model 
class Leaderboard(models.Model):
    contest = models.ForeignKey(Contest, on_delete=models.CASCADE, related_name='leaderboard')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='leaderboard')
    score = models.IntegerField(default=0, db_index=True)
    problems_solved = models.IntegerField(default=0)
    last_submission_time = models.DateTimeField(auto_now=True)
    penalty = models.IntegerField(default=0)  # Time penalty in minutes
    rank = models.IntegerField(null=True, blank=True)

    class Meta:
        unique_together = ('contest', 'user')
        indexes = [
            models.Index(fields=['contest', 'score', 'last_submission_time']),
            models.Index(fields=['rank']),
        ]
        ordering = ['-score', 'penalty', 'last_submission_time']

    def __str__(self):
        return f'{self.user.username} - {self.contest.title}'
    
    def update_stats(self):
        """Update leaderboard statistics"""
        # Get all accepted submissions
        accepted_submissions = self.user.submissions.filter(
            contest=self.contest,
            status='Accepted'
        ).values('problem').distinct().count()
        
        # Get total score
        problem_scores = {}
        submissions = self.user.submissions.filter(contest=self.contest)
        
        for sub in submissions:
            if sub.problem_id not in problem_scores or sub.score > problem_scores[sub.problem_id]:
                problem_scores[sub.problem_id] = sub.score
        
        self.score = sum(problem_scores.values())
        self.problems_solved = accepted_submissions
        self.save()

# Testcase Model
class Testcase(models.Model):
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE, related_name='testcases')
    input = models.TextField()
    output = models.TextField()
    is_sample = models.BooleanField(default=False)
    points = models.IntegerField(default=0)  # Points for this testcase
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['problem', 'is_sample']),
        ]

    def __str__(self):
        return f'Testcase for {self.problem.title}'

# Submission Testcase Model
class SubmissionTestcase(models.Model):
    STATUS_CHOICES = [
        ('Accepted', 'Accepted'), 
        ('Wrong Answer', 'Wrong Answer'), 
        ('Runtime Error', 'Runtime Error'), 
        ('Time Limit Exceeded', 'Time Limit Exceeded'),
        ('Memory Limit Exceeded', 'Memory Limit Exceeded')
    ]
    
    submission = models.ForeignKey(Submission, on_delete=models.CASCADE, related_name='testcases')
    testcase = models.ForeignKey(Testcase, on_delete=models.CASCADE, related_name='submissions')
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Accepted')
    execution_time = models.FloatField(null=True, blank=True)  # in seconds
    memory_used = models.FloatField(null=True, blank=True)  # in MB
    output = models.TextField(blank=True, null=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['submission', 'status']),
        ]

    def __str__(self):
        return f'{self.submission.user.username} - {self.testcase.problem.title}'

# System Announcements
class Announcement(models.Model):
    title = models.CharField(max_length=255)
    content = models.TextField()
    contest = models.ForeignKey(Contest, on_delete=models.CASCADE, related_name='announcements', null=True, blank=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='announcements')
    created_at = models.DateTimeField(auto_now_add=True)
    is_global = models.BooleanField(default=False)
    
    class Meta:
        indexes = [
            models.Index(fields=['contest', 'created_at']),
            models.Index(fields=['is_global']),
        ]
        
    def __str__(self):
        return self.title