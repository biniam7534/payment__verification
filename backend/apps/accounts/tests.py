from django.contrib.auth import get_user_model
from django.test import TestCase
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient

User = get_user_model()


class AccountsAPITestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.register_url = "/api/accounts/register/"
        self.login_url = "/api/accounts/login/"
        self.logout_url = "/api/accounts/logout/"
        self.profile_url = "/api/accounts/profile/"
        self.user_data = {
            "full_name": "Natnael Example",
            "phone_number": "0911000000",
            "email": "natnael@example.com",
            "password": "securepass123",
        }

    def test_register_creates_user_with_hashed_password(self):
        response = self.client.post(self.register_url, self.user_data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(response.data["success"])
        self.assertIn("token", response.data)

        user = User.objects.get(phone_number="0911000000")
        self.assertTrue(user.check_password("securepass123"))
        self.assertNotEqual(user.password, "securepass123")

    def test_register_rejects_invalid_phone(self):
        payload = {**self.user_data, "phone_number": "12345"}
        response = self.client.post(self.register_url, payload, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data["success"])

    def test_login_returns_token(self):
        User.objects.create_user(
            phone_number="0911000000",
            full_name="Natnael Example",
            password="securepass123",
        )
        response = self.client.post(
            self.login_url,
            {"phone_number": "0911000000", "password": "securepass123"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["success"])
        self.assertIn("token", response.data)

    def test_login_wrong_password_returns_400(self):
        User.objects.create_user(
            phone_number="0911000000",
            full_name="Natnael Example",
            password="securepass123",
        )
        response = self.client.post(
            self.login_url,
            {"phone_number": "0911000000", "password": "wrongpassword"},
            format="json",
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertFalse(response.data["success"])

    def test_profile_requires_auth(self):
        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_profile_get_and_update(self):
        user = User.objects.create_user(
            phone_number="0911000000",
            full_name="Natnael Example",
            password="securepass123",
        )
        token = Token.objects.create(user=user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {token.key}")

        get_response = self.client.get(self.profile_url)
        self.assertEqual(get_response.status_code, status.HTTP_200_OK)
        self.assertTrue(get_response.data["success"])
        self.assertEqual(get_response.data["user"]["phone_number"], "0911000000")
        self.assertEqual(get_response.data["scan_usage"]["used"], 0)
        self.assertEqual(get_response.data["scan_usage"]["limit"], 20)

        update_response = self.client.put(
            self.profile_url,
            {
                "business_name": "Blue Shop",
                "business_type": "Retail",
                "receiver_name": "Natnael Example",
                "receiver_account": "1000017692643",
                "default_provider": "cbe",
            },
            format="json",
        )
        self.assertEqual(update_response.status_code, status.HTTP_200_OK)
        self.assertEqual(update_response.data["business_profile"]["business_name"], "Blue Shop")

    def test_logout_deletes_token(self):
        user = User.objects.create_user(
            phone_number="0911000000",
            full_name="Natnael Example",
            password="securepass123",
        )
        token = Token.objects.create(user=user)
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {token.key}")

        response = self.client.post(self.logout_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(Token.objects.filter(user=user).exists())

    def test_users_only_access_own_profile(self):
        user_a = User.objects.create_user(
            phone_number="0911000000",
            full_name="User A",
            password="securepass123",
        )
        user_b = User.objects.create_user(
            phone_number="0911223344",
            full_name="User B",
            password="securepass123",
        )
        token_a = Token.objects.create(user=user_a)
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {token_a.key}")

        response = self.client.get(self.profile_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["user"]["id"], user_a.id)
        self.assertNotEqual(response.data["user"]["id"], user_b.id)
