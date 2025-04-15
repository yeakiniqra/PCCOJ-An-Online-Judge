from django.contrib import admin
from .models import *

# Register your models here.
admin.site.register(UserProfile)
admin.site.register(Contest)
admin.site.register(Problem)
# admin.site.register(Submission)
admin.site.register(Announcement)
admin.site.register(SubmissionTestcase)
admin.site.register(Testcase)
admin.site.register(Leaderboard)
admin.site.register(ProblemTag)
admin.site.register(ContestParticipation)
admin.site.register(PracticeProblem)
admin.site.register(PracticeSubmission)
admin.site.register(PracticeSubmissionTestcase)
admin.site.register(PracticeTestcase)

class SubmissionAdmin(admin.ModelAdmin):
    list_display = ('user', 'problem', 'contest', 'language_display', 'status', 'testcases_passed', 'testcases_total')

    def language_display(self, obj):
        return obj.get_language_display() 

    language_display.admin_order_field = 'language'  
    language_display.short_description = 'Language'  

admin.site.register(Submission, SubmissionAdmin)

admin.site.index_title = "PCCOJ Admin"
admin.site.site_header = "PCCOJ Admin Panel"
admin.site.site_title = "PCCOJ Admin Panel"
