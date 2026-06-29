from rest_framework import status
from rest_framework.exceptions import APIException, ValidationError
from rest_framework.views import exception_handler

from common.responses import error_response


def custom_exception_handler(exc, context):
    response = exception_handler(exc, context)

    if response is None:
        return error_response(
            message="An unexpected error occurred.",
            status=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )

    if isinstance(exc, ValidationError):
        errors = response.data
        if isinstance(errors, list):
            errors = {"non_field_errors": errors}
        message = _first_error_message(errors)
        return error_response(message=message, errors=errors, status=response.status_code)

    if isinstance(exc, APIException):
        detail = exc.detail
        if isinstance(detail, dict):
            message = _first_error_message(detail)
            return error_response(message=message, errors=detail, status=response.status_code)
        message = str(detail)
        return error_response(message=message, status=response.status_code)

    return error_response(
        message="Request failed.",
        errors=response.data,
        status=response.status_code,
    )


def _first_error_message(errors):
    if not errors:
        return "Request failed."
    if isinstance(errors, dict):
        for value in errors.values():
            if isinstance(value, list) and value:
                return str(value[0])
            if isinstance(value, str):
                return value
    if isinstance(errors, list) and errors:
        return str(errors[0])
    return "Request failed."
