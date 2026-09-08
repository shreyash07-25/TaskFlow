from flask import Flask
from flask_cors import CORS

from routes.auth import auth_bp
from routes.tasks import tasks_bp

app = Flask(__name__)

CORS(app)

app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(tasks_bp, url_prefix="/api/tasks")


@app.route("/")
def home():
    return {"message": "TaskFlow API is running"}


if __name__ == "__main__":
    import os

    port = int(os.environ.get("PORT", 5000))

    app.run(debug=True, host="0.0.0.0", port=port)