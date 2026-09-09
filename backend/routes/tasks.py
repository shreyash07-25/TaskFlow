from flask import Blueprint, request, jsonify
from bson import ObjectId
from bson.errors import InvalidId
import jwt

from config import JWT_SECRET
from models.task import (
    get_tasks_by_user,
    create_task,
    update_task,
    delete_task,
)
from utils.validators import validate_task_input
from extensions import limiter


tasks_bp = Blueprint("tasks", __name__)


def get_user_id_from_token():
    token = request.headers.get("Authorization")

    if not token:
        return None

    try:
        token = token.replace("Bearer ", "")
        decoded = jwt.decode(
            token,
            JWT_SECRET,
            algorithms=["HS256"],
        )
        return decoded["user_id"]

    except jwt.InvalidTokenError:
        return None


def parse_object_id(task_id):
    """Returns an ObjectId or None. Guards against InvalidId AND against
    a valid-looking ObjectId built from attacker-controlled input types
    (ObjectId() will happily accept some non-hex-string inputs)."""
    if not isinstance(task_id, str):
        return None
    try:
        return ObjectId(task_id)
    except (InvalidId, TypeError):
        return None


@tasks_bp.route("/", methods=["GET"])
def get_tasks():
    user_id = get_user_id_from_token()

    if not user_id:
        return jsonify({"message": "Unauthorized"}), 401

    tasks = get_tasks_by_user(user_id)

    for task in tasks:
        task["_id"] = str(task["_id"])

    return jsonify(tasks), 200


@tasks_bp.route("/", methods=["POST"])
@limiter.limit("60 per hour")
def add_task():
    user_id = get_user_id_from_token()

    if not user_id:
        return jsonify({"message": "Unauthorized"}), 401

    data = request.get_json(silent=True)

    error, cleaned = validate_task_input(data, require_title=True)
    if error:
        return jsonify({"message": error}), 400

    task = {
        "title": cleaned["title"],
        "description": cleaned.get("description", ""),
        "priority": cleaned.get("priority", "medium"),
        "status": "pending",
        "user_id": user_id,
    }

    result = create_task(task)

    return jsonify({
        "message": "Task created successfully",
        "task_id": str(result.inserted_id),
    }), 201


@tasks_bp.route("/<task_id>", methods=["PUT"])
def edit_task(task_id):
    user_id = get_user_id_from_token()

    if not user_id:
        return jsonify({"message": "Unauthorized"}), 401

    object_id = parse_object_id(task_id)
    if not object_id:
        return jsonify({"message": "Invalid task ID"}), 400

    data = request.get_json(silent=True)

    error, cleaned = validate_task_input(data, require_title=False)
    if error:
        return jsonify({"message": error}), 400

    if not cleaned:
        return jsonify({"message": "No valid fields to update"}), 400

    result = update_task(object_id, user_id, cleaned)

    if result.matched_count == 0:
        return jsonify({"message": "Task not found"}), 404

    return jsonify({"message": "Task updated successfully"}), 200


@tasks_bp.route("/<task_id>", methods=["DELETE"])
def remove_task(task_id):
    user_id = get_user_id_from_token()

    if not user_id:
        return jsonify({"message": "Unauthorized"}), 401

    object_id = parse_object_id(task_id)
    if not object_id:
        return jsonify({"message": "Invalid task ID"}), 400

    result = delete_task(object_id, user_id)

    if result.deleted_count == 0:
        return jsonify({"message": "Task not found"}), 404

    return jsonify({"message": "Task deleted successfully"}), 200
