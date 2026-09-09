import os

from flask import Flask, jsonify
from flask_cors import CORS
from werkzeug.exceptions import HTTPException

from config import ALLOWED_ORIGINS
from extensions import limiter
from routes.auth import auth_bp
from routes.tasks import tasks_bp

app = Flask(__name__)

# Only the configured frontend origin(s) may call this API,
# instead of the previous CORS(app) which allowed any website.
CORS(app, origins=ALLOWED_ORIGINS, supports_credentials=True)

limiter.init_app(app)

app.register_blueprint(auth_bp, url_prefix="/api/auth")
app.register_blueprint(tasks_bp, url_prefix="/api/tasks")


@app.route("/")
def home():
    return {"message": "TaskFlow API is running"}


@app.errorhandler(HTTPException)
def handle_http_exception(error):
    """Turns Flask's default HTML error pages (404, 405, 429, etc.)
    into consistent JSON, since this API only ever talks to a
    frontend, never a browser navigating directly."""
    response = jsonify({"message": error.description})
    response.status_code = error.code
    return response


@app.errorhandler(Exception)
def handle_unexpected_exception(error):
    """Last-resort handler so an unexpected bug returns a clean 500
    with no stack trace or internal details leaked to the client."""
    app.logger.exception("Unhandled exception")
    return jsonify({"message": "Internal server error"}), 500


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    debug_mode = os.environ.get("FLASK_ENV") != "production"

    app.run(debug=debug_mode, host="0.0.0.0", port=port)
