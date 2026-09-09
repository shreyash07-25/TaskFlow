import os
import sys

from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, ConfigurationError
from dotenv import load_dotenv

load_dotenv()

ENV = os.getenv("FLASK_ENV", "production")
IS_PRODUCTION = ENV == "production"

MONGO_URI = os.getenv("MONGO_URI")
JWT_SECRET = os.getenv("JWT_SECRET")

# Comma-separated list of allowed frontend origins, e.g.
# "https://taskflow.vercel.app,http://localhost:5173"
ALLOWED_ORIGINS = [
    origin.strip()
    for origin in os.getenv("ALLOWED_ORIGINS", "").split(",")
    if origin.strip()
]

# Fail fast instead of silently running with an insecure default secret
# or connecting to a local Mongo instance nobody intended to use.
if IS_PRODUCTION:
    if not MONGO_URI:
        sys.exit("FATAL: MONGO_URI environment variable is not set.")
    if not JWT_SECRET:
        sys.exit("FATAL: JWT_SECRET environment variable is not set.")
    if not ALLOWED_ORIGINS:
        sys.exit(
            "FATAL: ALLOWED_ORIGINS environment variable is not set. "
            "Set it to your frontend URL(s), comma-separated."
        )
else:
    # Safe local-dev fallbacks only ever used outside production.
    MONGO_URI = MONGO_URI or "mongodb://localhost:27017/"
    JWT_SECRET = JWT_SECRET or "dev-only-secret-do-not-use-in-production"
    ALLOWED_ORIGINS = ALLOWED_ORIGINS or ["http://localhost:5173"]

try:
    client = MongoClient(
        MONGO_URI,
        serverSelectionTimeoutMS=8000,
        connectTimeoutMS=8000,
    )
    # Force a round trip now so a bad URI fails fast at startup,
    # not on the user's first request.
    client.admin.command("ping")
except (ConnectionFailure, ConfigurationError) as exc:
    sys.exit(f"FATAL: Could not connect to MongoDB: {exc}")

db = client["taskflow"]

users_collection = db["users"]
tasks_collection = db["tasks"]

# Enforce email uniqueness at the database level so two concurrent
# registrations for the same email can never both succeed.
users_collection.create_index("email", unique=True)
