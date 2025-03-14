from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(UserProfile)
admin.site.register(Contest)
admin.site.register(Problem)
admin.site.register(Submission)
admin.site.register(Announcement)
admin.site.register(SubmissionTestcase)
admin.site.register(Testcase)
admin.site.register(Leaderboard)
admin.site.register(ProblemTag)
admin.site.register(ContestParticipation)
