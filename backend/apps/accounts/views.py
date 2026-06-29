from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.views import APIView

from apps.accounts.serializers import (
    LoginSerializer,
    ProfileSerializer,
    ProfileUpdateSerializer,
    RegisterSerializer,
    UserSerializer,
)
from common.responses import error_response, success_response


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if not serializer.is_valid():
            return error_response(
                message=_first_error(serializer.errors),
                errors=serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return success_response(
            message="Registration successful.",
            token=token.key,
            user=UserSerializer(user).data,
            status=status.HTTP_201_CREATED,
        )


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data, context={"request": request})
        if not serializer.is_valid():
            return error_response(
                message=_first_error(serializer.errors),
                errors=serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )
        user = serializer.validated_data["user"]
        token, _ = Token.objects.get_or_create(user=user)
        return success_response(
            message="Login successful.",
            token=token.key,
            user=UserSerializer(user).data,
        )


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        Token.objects.filter(user=request.user).delete()
        return success_response(message="Logout successful.")


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = ProfileSerializer().to_representation(request.user)
        return success_response(**data)

    def put(self, request):
        serializer = ProfileUpdateSerializer(data=request.data, partial=True)
        if not serializer.is_valid():
            return error_response(
                message=_first_error(serializer.errors),
                errors=serializer.errors,
                status=status.HTTP_400_BAD_REQUEST,
            )
        serializer.update(request.user, serializer.validated_data)
        data = ProfileSerializer().to_representation(request.user)
        return success_response(message="Profile updated successfully.", **data)


def _first_error(errors):
    if isinstance(errors, dict):
        for value in errors.values():
            if isinstance(value, list) and value:
                return str(value[0])
            if isinstance(value, str):
                return value
    if isinstance(errors, list) and errors:
        return str(errors[0])
    return "Request failed."
