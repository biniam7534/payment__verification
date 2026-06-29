from django.contrib import admin

from apps.accounts.models import BusinessProfile, User


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ("full_name", "phone_number", "email", "is_active", "created_at")
    search_fields = ("full_name", "phone_number", "email")
    ordering = ("-created_at",)


@admin.register(BusinessProfile)
class BusinessProfileAdmin(admin.ModelAdmin):
    list_display = ("business_name", "user", "default_provider", "updated_at")
    search_fields = ("business_name", "user__phone_number", "receiver_account")
