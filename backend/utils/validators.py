import re

EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")

MAX_NAME_LEN = 100
MAX_EMAIL_LEN = 254
MAX_PASSWORD_LEN = 128
MIN_PASSWORD_LEN = 8
MAX_TITLE_LEN = 200
MAX_DESCRIPTION_LEN = 2000

ALLOWED_PRIORITIES = {"low", "medium", "high"}
ALLOWED_STATUSES = {"pending", "completed"}


def is_nonempty_string(value, max_len=None):
    """Rejects non-strings outright. This is the key defense against
    NoSQL injection: a dict like {"$ne": null} sent as a JSON field
    would otherwise be passed straight into a MongoDB query filter."""
    if not isinstance(value, str):
        return False
    stripped = value.strip()
    if not stripped:
        return False
    if max_len and len(stripped) > max_len:
        return False
    return True


def validate_registration(data):
    if not isinstance(data, dict):
        return "Invalid request body"

    name = data.get("name")
    email = data.get("email")
    password = data.get("password")

    if not is_nonempty_string(name, MAX_NAME_LEN):
        return "Name is required and must be under 100 characters"

    if not is_nonempty_string(email, MAX_EMAIL_LEN) or not EMAIL_RE.match(email.strip()):
        return "A valid email is required"

    if not is_nonempty_string(password):
        return "Password is required"

    if len(password) < MIN_PASSWORD_LEN:
        return f"Password must be at least {MIN_PASSWORD_LEN} characters"

    if len(password) > MAX_PASSWORD_LEN:
        return f"Password must be under {MAX_PASSWORD_LEN} characters"

    return None


def validate_login(data):
    if not isinstance(data, dict):
        return "Invalid request body"

    email = data.get("email")
    password = data.get("password")

    if not is_nonempty_string(email, MAX_EMAIL_LEN):
        return "Email is required"

    if not is_nonempty_string(password, MAX_PASSWORD_LEN):
        return "Password is required"

    return None


def validate_task_input(data, require_title=False):
    """Returns (error_message, cleaned_fields). Only fields present in
    `data` are validated/returned, so this works for both create (all
    required) and partial update (only provided fields checked)."""
    if not isinstance(data, dict):
        return "Invalid request body", None

    cleaned = {}

    if "title" in data or require_title:
        title = data.get("title")
        if not is_nonempty_string(title, MAX_TITLE_LEN):
            return f"Title is required and must be under {MAX_TITLE_LEN} characters", None
        cleaned["title"] = title.strip()

    if "description" in data:
        description = data.get("description", "")
        if not isinstance(description, str):
            return "Description must be text", None
        if len(description) > MAX_DESCRIPTION_LEN:
            return f"Description must be under {MAX_DESCRIPTION_LEN} characters", None
        cleaned["description"] = description.strip()

    if "priority" in data:
        priority = data.get("priority")
        if priority not in ALLOWED_PRIORITIES:
            return f"Priority must be one of {sorted(ALLOWED_PRIORITIES)}", None
        cleaned["priority"] = priority

    if "status" in data:
        status = data.get("status")
        if status not in ALLOWED_STATUSES:
            return f"Status must be one of {sorted(ALLOWED_STATUSES)}", None
        cleaned["status"] = status

    return None, cleaned
