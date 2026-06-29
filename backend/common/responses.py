from rest_framework.response import Response


def success_response(data=None, message="", status=200, **extra):
    payload = {"success": True}
    if message:
        payload["message"] = message
    if data is not None:
        payload.update(data if isinstance(data, dict) else {"data": data})
    payload.update(extra)
    return Response(payload, status=status)


def error_response(message="", errors=None, status=400):
    payload = {"success": False, "message": message}
    if errors:
        payload["errors"] = errors
    return Response(payload, status=status)
