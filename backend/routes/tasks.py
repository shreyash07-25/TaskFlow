from flask import Blueprint, request, jsonify
from bson import ObjectId
import jwt

from config import JWT_SECRET
from models.task import (
    get_tasks_by_user,
    create_task,
    update_task,
    delete_task
)


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
            algorithms=["HS256"]
        )
        return decoded["user_id"]

    except jwt.InvalidTokenError:
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
def add_task():
    user_id = get_user_id_from_token()

    if not user_id:
        return jsonify({"message": "Unauthorized"}), 401

    data = request.get_json()

    title = data.get("title")
    description = data.get("description", "")
    priority = data.get("priority", "medium")

    if not title:
        return jsonify({"message": "Title is required"}), 400

    task = {
        "title": title,
        "description": description,
        "priority": priority,
        "status": "pending",
        "user_id": user_id
    }

    result = create_task(task)

    return jsonify({
        "message": "Task created successfully",
        "task_id": str(result.inserted_id)
    }), 201
@tasks_bp.route("/<task_id>", methods=["PUT"])
def edit_task(task_id):
    user_id = get_user_id_from_token()

    if not user_id:
        return jsonify({"message": "Unauthorized"}), 401

    data = request.get_json()

    update_data = {}

    if "title" in data:
        update_data["title"] = data["title"]

    if "description" in data:
        update_data["description"] = data["description"]

    if "priority" in data:
        update_data["priority"] = data["priority"]

    if "status" in data:
        update_data["status"] = data["status"]

    try:
        result = update_task(
            ObjectId(task_id),
            user_id,
            update_data
        )

        if result.matched_count == 0:
            return jsonify({"message": "Task not found"}), 404

        return jsonify({
            "message": "Task updated successfully"
        }), 200

    except Exception:
        return jsonify({"message": "Invalid task ID"}), 400


@tasks_bp.route("/<task_id>", methods=["DELETE"])
def remove_task(task_id):
    user_id = get_user_id_from_token()

    if not user_id:
        return jsonify({"message": "Unauthorized"}), 401

    try:
        result = delete_task(
            ObjectId(task_id),
            user_id
        )

        if result.deleted_count == 0:
            return jsonify({"message": "Task not found"}), 404

        return jsonify({
            "message": "Task deleted successfully"
        }), 200

    except Exception:
        return jsonify({"message": "Invalid task ID"}), 400