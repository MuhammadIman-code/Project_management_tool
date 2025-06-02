from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status ,permissions
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.db import DatabaseError
from rest_framework_simplejwt.tokens import AccessToken
from django.contrib.auth import authenticate
from .serializers import ProjectSerializer ,TaskSerializer
from .models import Project,Task


class SignupView(APIView):
    def post(self, request):
        try:
            username = request.data.get('username')
            password = request.data.get('password')
            is_staff = request.data.get('is_staff', False)

            if not username or not password:
                return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)

            if User.objects.filter(username=username).exists():
                return Response({'error': 'Username already taken'}, status=status.HTTP_400_BAD_REQUEST)

            user = User.objects.create(
                username=username,
                password=make_password(password),
                is_staff=bool(is_staff)
            )

            return Response({'message': 'User created successfully', 'is_staff': user.is_staff}, status=status.HTTP_201_CREATED)

        except DatabaseError as db_err:
            return Response({'error': 'Database error occurred'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        except Exception as e:
            return Response({'error': 'An unexpected error occurred', 'details': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


#------------------------------------------------ Login Functionality ------------------------------------------------------



class LoginView(APIView):
    def post(self, request):
        try:
            username = request.data.get('username')
            password = request.data.get('password')

            if not username or not password:
                return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)

            user = authenticate(request, username=username, password=password)

            if user is not None:
                accessToken = AccessToken.for_user(user)
                return Response({
                    'Token': str(accessToken),
                }, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

        except Exception as e:
            return Response(
                {'error': 'An unexpected error occurred', 'details': str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        
#---------------------------------------------------end---------------------------------------------------


#--------------------------------------------------project detail-----------------------------------------

class ProjectCreateView(APIView):
    # permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        serializer = ProjectSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user)  
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
   
    
    def get(self, request):
        # Get all own projects (verified or not)
     own_projects = Project.objects.filter(owner=request.user)

    # Get other users' projects that are verified
     other_verified_projects = Project.objects.filter(
        verified=True
     ).exclude(owner=request.user)

    # Combine the two querysets
     all_visible_projects = own_projects | other_verified_projects

    # Optional: remove duplicates and order by created date (optional)
     all_visible_projects = all_visible_projects.distinct().order_by('-created_at')

     serializer = ProjectSerializer(all_visible_projects, many=True)
     return Response(serializer.data, status=status.HTTP_200_OK)
 
 
 
    def get(self, request, project_id=None):
        if project_id:
         try:
            project = Project.objects.get(id=project_id)
            if project.owner == request.user or project.verified:
                serializer = ProjectSerializer(project)
                return Response(serializer.data, status=status.HTTP_200_OK)
            else:
                return Response({'detail': 'Not authorized to view this project.'},
                                status=status.HTTP_403_FORBIDDEN)
         except Project.DoesNotExist:
            return Response({'detail': 'Project not found.'},
                            status=status.HTTP_404_NOT_FOUND)
        else:
            own_projects = Project.objects.filter(owner=request.user)
            other_verified_projects = Project.objects.filter(verified=True).exclude(owner=request.user)
            all_visible_projects = (own_projects | other_verified_projects).distinct().order_by('-created_at')
            serializer = ProjectSerializer(all_visible_projects, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

#---------------------------------------------------task create view-------------------------------------

class TaskCreateAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, format=None):
        try:
            serializer = TaskSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()  # or add created_by=request.user
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )
    
    def put(self, request, pk, format=None):
        try:
            task = Task.objects.get(pk=pk)
            
            # Check if the current user is the creator
            if task.created_by != request.user:
                return Response(
                    {"error": "You can only edit your own tasks"},
                    status=status.HTTP_403_FORBIDDEN
                )
                
            serializer = TaskSerializer(task, data=request.data, partial=True, context={'request': request})
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data, status=status.HTTP_200_OK)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        except Task.DoesNotExist:
            return Response(
                {"error": "Task not found"},
                status=status.HTTP_404_NOT_FOUND
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )