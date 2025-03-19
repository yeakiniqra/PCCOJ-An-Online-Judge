from rest_framework import status, viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.authtoken.models import Token
from django.contrib.auth import logout
from django.shortcuts import get_object_or_404
from cms.models import *
from .serializers import *
from django.contrib.auth import authenticate, logout
from django.contrib.auth.models import User
from rest_framework.authtoken.models import Token
from rest_framework.permissions import IsAuthenticated, AllowAny

# Create your views here.
class AuthenticationView(viewsets.GenericViewSet):
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        if self.action == 'user_register':
            return UserRegistrationSerializer
        elif self.action == 'user_login':
            return UserLoginSerializer
        elif self.action == 'user_logout':  
            return None
        return super().get_serializer_class()
        

    @action(methods=['POST'], detail=False)
    def user_register(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = User.objects.create_user(
            username=serializer.validated_data['username'],
            email=serializer.validated_data['email'],
            password=serializer.validated_data['password'],
            first_name=serializer.validated_data.get('first_name', ''),
            last_name=serializer.validated_data.get('last_name', '')
        )

        return Response(
            {'message': 'User registered successfully'},
            status=status.HTTP_201_CREATED
        )

    @action(methods=['POST'], detail=False)
    def user_login(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        username = serializer.validated_data['username'].lower()  # Case-insensitive login
        password = serializer.validated_data['password']
        user = authenticate(username=username, password=password)

        if not user:
            return Response(
                {'error': 'Invalid credentials'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        token, _ = Token.objects.get_or_create(user=user)

        return Response(
            {'token': token.key, 'user_id': user.pk},
            status=status.HTTP_200_OK
        )

    @action(methods=['POST'], detail=False, permission_classes=[IsAuthenticated])
    def user_logout(self, request):
        request.user.auth_token.delete()
        logout(request)

        return Response(
            {'message': 'User logged out successfully'},
            status=status.HTTP_200_OK
        )
