import re

from django.core.exceptions import ValidationError

ETHIOPIAN_PHONE_PATTERN = re.compile(r"^(?:\+251|0)9\d{8}$")


def validate_ethiopian_phone(value: str) -> None:
    if not ETHIOPIAN_PHONE_PATTERN.match(value):
        raise ValidationError(
            "Enter a valid Ethiopian phone number (e.g. 0911000000 or +251911000000)."
        )


def normalize_ethiopian_phone(value: str) -> str:
    if value.startswith("+251"):
        return "0" + value[4:]
    return value
