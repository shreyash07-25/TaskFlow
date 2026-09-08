import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
JWT_SECRET = os.getenv("JWT_SECRET", "mysecretkey")

client = MongoClient(MONGO_URI)

db = client["taskflow"]

users_collection = db["users"]
tasks_collection = db["tasks"]