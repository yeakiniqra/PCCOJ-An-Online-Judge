"""
URL configuration for CORE project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from cms.views import *
from rest_framework import permissions
from drf_yasg.views import get_schema_view
from drf_yasg import openapi
from django.urls import path,include
from django.conf.urls.static import static
from django.conf import settings
from django.contrib.staticfiles.urls import staticfiles_urlpatterns



schema_view = get_schema_view(
   openapi.Info(
      title="PCCOJ-API",
      default_version='v1',
      description="API Docs for PCCOJ",
      terms_of_service="https://www.google.com/policies/terms/",
      contact=openapi.Contact(email="yeakintheiqra@gmail.com"),
      license=openapi.License(name="BSD License"),
   ),
   public=True,
   permission_classes=(permissions.AllowAny,),
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/',include('api.urls')),

    # Swagger UI
    path('swagger/', schema_view.with_ui('swagger', cache_timeout=0), name='schema-swagger-ui'),
    path('redoc/', schema_view.with_ui('redoc', cache_timeout=0), name='schema-redoc'),

    # cms urls
    path('accounts/login/', admin_login, name='admin_login'),
    path('admin_logout/', admin_logout, name='admin_logout'),
    path('', dashboard_page, name='dashboard_page'),
    
    # contest urls
    path('allcontest/', allcontest, name='allcontest'),
    path('addcontest/', addcontest, name='addcontest'),
    path('contest/edit/<int:contest_id>/', editcontest, name='editcontest'),
    path('contest/delete/<int:contest_id>/', deletecontest, name='deletecontest'),

    # Practice Problem urls
    path('practice-problems/', practice_problems_list, name='practice_problems_list'),
    path('practice-problems/add/', addpracticeproblem, name='addpracticeproblem'),
    path('practice-problems/<int:problem_id>/update/', updatepracticeproblem, name='updatepracticeproblem'),
    path('practice-problems/<int:problem_id>/delete/', deletepracticeproblem, name='deletepracticeproblem'),


    # Contest Problem urls
    path('contest-problems/add/', addproblem, name='add_problem'),
    path('contest-problems/', contest_problems_list, name='contest_problems_list'),
    path('contest-problems/<int:problem_id>/delete/', delete_problem, name='delete_problem'),
    path('contest-problems/<int:problem_id>/update/', edit_problem, name='edit_problem'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += staticfiles_urlpatterns()
