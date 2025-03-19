from rest_framework import serializers
from django.contrib.auth import authenticate
from cms.models import *
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password
from django.utils import timezone


# Authentication and Registration Serializers
# User Registration Serializer
class UserRegistrationSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    confirm_password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'username', 'email', 'password', 'confirm_password']
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True}
        }
    
    def validate_email(self, value):
        """
        Validate that the email belongs to UAP (@uap-bd.edu)
        """
        if not value.endswith('@uap-bd.edu'):
            raise serializers.ValidationError("Email must be a valid UAP email address (@uap-bd.edu)")
        
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
            
        return value
    
    def validate_username(self, value):
        """
        Validate that the username is unique
        """
        if User.objects.filter(username=value).exists():
            raise serializers.ValidationError("A user with this username already exists.")
        return value
    
    def validate(self, data):
        """
        Check that the passwords match and validate password strength
        """
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError({"confirm_password": "Password fields didn't match."})
        
        # Validate password strength
        try:
            validate_password(data['password'])
        except ValidationError as e:
            raise serializers.ValidationError({"password": list(e.messages)})
            
        return data
    
    def create(self, validated_data):
        """
        Create and return a new user, with default profile
        """
        # Remove confirm_password from the data
        validated_data.pop('confirm_password', None)
        
        # Create the user
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        
        # Create associated profile
        UserProfile.objects.create(user=user)
        
        return user
    

# User Login Serializer
class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField(required=True)
    password = serializers.CharField(required=True, write_only=True, style={'input_type': 'password'})
    
    def validate(self, data):
        username = data.get('username')
        password = data.get('password')
        
        if username and password:
            # Check if the input is an email
            if '@' in username:
                try:
                    user_obj = User.objects.get(email=username)
                    username = user_obj.username
                except User.DoesNotExist:
                    raise serializers.ValidationError("User with this email does not exist.")
            
            # Authenticate user
            user = authenticate(username=username, password=password)
            
            if not user:
                raise serializers.ValidationError("Invalid credentials. Please try again.")
            
            if not user.is_active:
                raise serializers.ValidationError("This account has been deactivated.")
        else:
            raise serializers.ValidationError("Both username/email and password are required.")
        
        data['user'] = user
        return data


# User Profile Serializer
# class UserProfileSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = UserProfile
#         fields = ['user', 'bio', 'profile_picture', 'country', 'institution', 'rating', 'solved_problems', 'rank']
#         read_only_fields = ['user', 'rating', 'solved_problems', 'rank']