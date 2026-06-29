from django.conf import settings
from django.contrib.auth import authenticate
from rest_framework import serializers

from apps.accounts.models import BusinessProfile, User
from common.validators import normalize_ethiopian_phone, validate_ethiopian_phone


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ("id", "full_name", "phone_number", "email")
        read_only_fields = fields


class BusinessProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusinessProfile
        fields = (
            "business_name",
            "business_type",
            "receiver_name",
            "receiver_account",
            "default_provider",
        )


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)

    class Meta:
        model = User
        fields = ("full_name", "phone_number", "email", "password")

    def validate_phone_number(self, value):
        validate_ethiopian_phone(value)
        return normalize_ethiopian_phone(value)

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        BusinessProfile.objects.create(user=user)
        return user


class LoginSerializer(serializers.Serializer):
    phone_number = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate_phone_number(self, value):
        validate_ethiopian_phone(value)
        return normalize_ethiopian_phone(value)

    def validate(self, attrs):
        phone_number = attrs.get("phone_number")
        password = attrs.get("password")
        user = authenticate(
            request=self.context.get("request"),
            username=phone_number,
            password=password,
        )
        if not user:
            raise serializers.ValidationError("Invalid phone number or password.")
        if not user.is_active:
            raise serializers.ValidationError("This account is inactive.")
        attrs["user"] = user
        return attrs


class ProfileUpdateSerializer(serializers.Serializer):
    full_name = serializers.CharField(required=False, max_length=255)
    email = serializers.EmailField(required=False, allow_blank=True)
    business_name = serializers.CharField(required=False, allow_blank=True, max_length=255)
    business_type = serializers.CharField(required=False, allow_blank=True, max_length=100)
    receiver_name = serializers.CharField(required=False, allow_blank=True, max_length=255)
    receiver_account = serializers.CharField(required=False, allow_blank=True, max_length=100)
    default_provider = serializers.CharField(required=False, allow_blank=True, max_length=50)

    def update(self, instance, validated_data):
        user_fields = {}
        if "full_name" in validated_data:
            user_fields["full_name"] = validated_data["full_name"]
        if "email" in validated_data:
            user_fields["email"] = validated_data["email"]
        if user_fields:
            for field, value in user_fields.items():
                setattr(instance, field, value)
            instance.save(update_fields=list(user_fields.keys()) + ["updated_at"])

        profile, _ = BusinessProfile.objects.get_or_create(user=instance)
        profile_fields = (
            "business_name",
            "business_type",
            "receiver_name",
            "receiver_account",
            "default_provider",
        )
        profile_updated = False
        for field in profile_fields:
            if field in validated_data:
                setattr(profile, field, validated_data[field])
                profile_updated = True
        if profile_updated:
            profile.save()

        return instance


class ProfileSerializer(serializers.Serializer):
    def to_representation(self, instance):
        profile, _ = BusinessProfile.objects.get_or_create(user=instance)
        return {
            "user": UserSerializer(instance).data,
            "business_profile": BusinessProfileSerializer(profile).data,
            "scan_usage": {
                "used": 0,
                "limit": settings.SCAN_USAGE_FREE_LIMIT,
            },
        }
