from django.urls import path,include
from rest_framework.routers import DefaultRouter
from .views import *

router = DefaultRouter()

router.register('auth', AuthenticationView, basename='auth')
router.register('contest', ContestViewSet, basename='contest')
router.register('participate', ContestParticipationView, basename='participate')
router.register('problem', ProblemViewSet, basename='problem')
router.register('submission', SubmissionViewSet, basename='submission')
router.register('practice', PracticeProblemViewSet, basename='practice-problems')


urlpatterns = [
   path('', include(router.urls)),
    
]