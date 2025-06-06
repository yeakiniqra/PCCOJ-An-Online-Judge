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

    def __str__(self):
        return f'{self.user.username} - {self.contest.title}'    

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
        (109, 'Python 3.11.2'),
        (100, 'Python 3.12.5'), 
        (71, 'Python 3.8.1'),
        (76, 'C++ (Clang 7.0.1)'),
        (103, 'C (GCC 14.1.0)'),
        (62, 'Java (OpenJDK 13.0.1)'),
        (93, 'JavaScript (Node.js 18.15.0)'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='submissions')
    problem = models.ForeignKey(Problem, on_delete=models.CASCADE, related_name='submissions')
    contest = models.ForeignKey(Contest, on_delete=models.CASCADE, related_name='submissions')
    code = models.TextField()
    language = models.IntegerField(choices=[(id, name) for name, id in LANGUAGE_CHOICES])  # Change to IntegerField
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
    ANNOUNCEMENT_TYPE_CHOICES = [
        ('normal', 'Normal'),
        ('training', 'Training'),
        ('resource', 'Resource'),
        ('contest', 'Contest'),
    ]
    
    title = models.CharField(max_length=255)
    content = models.TextField()
    announcement_type = models.CharField(
        max_length=20, 
        choices=ANNOUNCEMENT_TYPE_CHOICES, 
        default='normal',
        db_index=True
    )
    contest = models.ForeignKey(
        Contest, 
        on_delete=models.CASCADE, 
        related_name='announcements', 
        null=True, 
        blank=True
    )
    is_featured = models.BooleanField(default=False, help_text="Featured announcements appear at the top")
    is_global = models.BooleanField(default=True, help_text="Visible to all users")
    external_link = models.URLField(null=True, blank=True, help_text="Optional link to external resource")
    image = models.ImageField(upload_to='announcement_images/', null=True, blank=True)
    
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='announcements')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    # Optional expiration date for temporary announcements
    expires_at = models.DateTimeField(null=True, blank=True)
    
    class Meta:
        indexes = [
            models.Index(fields=['announcement_type']),
            models.Index(fields=['contest', 'created_at']),
            models.Index(fields=['is_global']),
            models.Index(fields=['is_featured']),
            models.Index(fields=['created_at']),
        ]
        ordering = ['-is_featured', '-created_at']
        
    def __str__(self):
        return f"{self.title} ({self.get_announcement_type_display()})"
    
    @property
    def is_expired(self):
        """Check if announcement has expired"""
        if self.expires_at:
            return timezone.now() > self.expires_at
        return False
    
    @property
    def is_contest_announcement(self):
        """Helper to check if this is a contest announcement"""
        return self.contest is not None or self.announcement_type == 'contest'
    
    @property
    def is_training_announcement(self):
        """Helper to check if this is a training announcement"""
        return self.announcement_type == 'training'
    
    @property
    def is_resource_announcement(self):
        """Helper to check if this is a resource announcement"""
        return self.announcement_type == 'resource'
    

class PracticeProblem(models.Model):
    DIFFICULTY_CHOICES = [
        ('Easy', 'Easy'), 
        ('Medium', 'Medium'), 
        ('Hard', 'Hard'),
        ('Very Hard', 'Very Hard')
    ]
    
    title = models.CharField(max_length=255, db_index=True)
    slug = models.SlugField(max_length=255, unique=True)
    statement = models.TextField()
    input_format = models.TextField()
    output_format = models.TextField()
    constraints = models.TextField()
    sample_input = models.TextField()
    sample_output = models.TextField()
    explanation = models.TextField(blank=True, null=True)
    time_limit = models.FloatField(default=1.0)
    memory_limit = models.IntegerField(default=256)
    difficulty = models.CharField(max_length=50, choices=DIFFICULTY_CHOICES, db_index=True)
    tags = models.ManyToManyField('ProblemTag', related_name='practice_problems')
    points = models.IntegerField(default=100)
    editorial = models.TextField(blank=True, null=True, help_text="Solution explanation and approach")
    is_featured = models.BooleanField(default=False, help_text="Featured problems appear on the homepage")
    view_count = models.PositiveIntegerField(default=0, help_text="Number of times this problem has been viewed")
    solve_count = models.PositiveIntegerField(default=0, help_text="Number of unique users who solved this problem")
    attempt_count = models.PositiveIntegerField(default=0, help_text="Number of unique users who attempted this problem")
    is_visible = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    class Meta:
        indexes = [
            models.Index(fields=['difficulty', 'points']),
            models.Index(fields=['is_visible']),
            models.Index(fields=['is_featured']),
            models.Index(fields=['view_count']),
            models.Index(fields=['solve_count']),
            models.Index(fields=['attempt_count']),
        ]
        ordering = ['-created_at']

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
    
    def update_stats(self):
        """Update problem statistics (solve_count, attempt_count)"""
        # Number of distinct users who submitted to this problem
        self.attempt_count = self.submissions.values('user').distinct().count()
        
        # Number of distinct users who solved this problem
        self.solve_count = self.submissions.filter(status='Accepted').values('user').distinct().count()
        
        self.save(update_fields=['attempt_count', 'solve_count'])
    
    def increment_view_count(self):
        """Increment the view count for this problem"""
        self.view_count += 1
        self.save(update_fields=['view_count'])


class PracticeSubmission(models.Model):
    """Similar to your regular Submission model but for practice problems"""
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
        (109, 'Python 3.11.2'),
        (100, 'Python 3.12.5'), 
        (71, 'Python 3.8.1'),
        (76, 'C++ (Clang 7.0.1)'),
        (103, 'C (GCC 14.1.0)'),
        (62, 'Java (OpenJDK 13.0.1)'),
        (93, 'JavaScript (Node.js 18.15.0)'),
    ]
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='practice_submissions')
    problem = models.ForeignKey(PracticeProblem, on_delete=models.CASCADE, related_name='submissions')
    code = models.TextField()
    language = models.IntegerField(choices=[(id, name) for id, name in LANGUAGE_CHOICES])
    submitted_at = models.DateTimeField(auto_now_add=True, db_index=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='Pending', db_index=True)
    execution_time = models.FloatField(null=True, blank=True)  # in seconds
    memory_used = models.FloatField(null=True, blank=True)  # in MB
    penalty = models.IntegerField(default=0)  # Time penalty in seconds
    
    class Meta:
        ordering = ['-submitted_at']
        indexes = [
            models.Index(fields=['user', 'problem']),
            models.Index(fields=['status', 'submitted_at']),
        ]
    
    def __str__(self):
        return f"{self.user.username} - {self.problem.title}"
    

# Testcase Model
class PracticeTestcase(models.Model):
    problem = models.ForeignKey(PracticeProblem, on_delete=models.CASCADE, related_name='testcases')
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
class PracticeSubmissionTestcase(models.Model):
    STATUS_CHOICES = [
        ('Accepted', 'Accepted'), 
        ('Wrong Answer', 'Wrong Answer'), 
        ('Runtime Error', 'Runtime Error'), 
        ('Time Limit Exceeded', 'Time Limit Exceeded'),
        ('Memory Limit Exceeded', 'Memory Limit Exceeded')
    ]
    
    submission = models.ForeignKey(PracticeSubmission, on_delete=models.CASCADE, related_name='testcases')
    testcase = models.ForeignKey(PracticeTestcase, on_delete=models.CASCADE, related_name='submissions')
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