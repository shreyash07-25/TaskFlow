from flask import Blueprint, request, jsonify
from werkzeug.security import generate_password_hash, check_password_hash
from pymongo.errors import DuplicateKeyError
import jwt
from datetime import datetime, timedelta, timezone

from config import JWT_SECRET
from models.user import find_user_by_email, create_user
from utils.validators import validate_registration, validate_login
from extensions import limiter


auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
@limiter.limit("10 per hour")
def register():
    data = request.get_json(silent=True)

    error = validate_registration(data)
    if error:
        return jsonify({"message": error}), 400

    name = data["name"].strip()
    email = data["email"].strip().lower()
    password = data["password"]

    if find_user_by_email(email):
        return jsonify({"message": "User already exists"}), 409

    hashed_password = generate_password_hash(password)

    user = {
        "name": name,
        "email": email,
        "password": hashed_password,
    }

    try:
        create_user(user)
    except DuplicateKeyError:
        # Belt-and-suspenders: the unique index catches the race
        # condition where two requests pass the check above at once.
        return jsonify({"message": "User already exists"}), 409

    return jsonify({"message": "User registered successfully"}), 201


@auth_bp.route("/login", methods=["POST"])
@limiter.limit("10 per minute")
def login():
    data = request.get_json(silent=True)

    error = validate_login(data)
    if error:
        return jsonify({"message": error}), 400

    email = data["email"].strip().lower()
    password = data["password"]

    user = find_user_by_email(email)

    if not user or not check_password_hash(user["password"], password):
        return jsonify({"message": "Invalid email or password"}), 401

    token = jwt.encode(
        {
            "user_id": str(user["_id"]),
            "exp": datetime.now(timezone.utc) + timedelta(hours=24),
        },
        JWT_SECRET,
        algorithm="HS256",
    )

    return jsonify({
        "message": "Login successful",
        "token": token,
    }), 200
