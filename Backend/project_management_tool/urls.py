from django.urls import path
from .views import SignupView ,LoginView,ProjectCreateView,TaskCreateAPIView

urlpatterns = [
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/',LoginView.as_view(),name="Logon"),
    path('projects/',ProjectCreateView.as_view(),name="project"),
    path('projects/<int:project_id>/', ProjectCreateView.as_view(), name='project-detail'),
    path('Task/', TaskCreateAPIView.as_view(), name='Task'),
    path('Task/<int:pk>/', TaskCreateAPIView.as_view(), name='task-edit'),
]

