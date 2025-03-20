from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, UserSerializer

# Register API
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

# Login API
class LoginView(generics.GenericAPIView):
    permission_classes = [AllowAny]
    serializer_class=UserSerializer
    
    def post(self, request):
        user = authenticate(username=request.data.get('username'), password=request.data.get('password'))
        if user:
            tokens = RefreshToken.for_user(user)
            return Response({
                'user': UserSerializer(user).data,
                'access': str(tokens.access_token),
                'refresh': str(tokens),
            })
        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

# Logout API
class LogoutView(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class=UserSerializer
    def post(self, request):
        try:
            RefreshToken(request.data.get("refresh")).blacklist()
            return Response({'message': 'Logged out successfully'}, status=status.HTTP_200_OK)
        except Exception:
            return Response({'error': 'Invalid token'}, status=status.HTTP_400_BAD_REQUEST)

# User Detail API
class UserDetailView(generics.RetrieveAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
