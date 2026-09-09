# TaskFlow Backend - Security Hardening

## What changed and why

1. **NoSQL injection fixed** - Previously `find_one({"email": email})` used
   the raw JSON value straight from the request. Sending
   `{"email": {"$ne": null}}` would have MongoDB treat it as a query
   operator instead of a literal string, potentially matching any user.
   `utils/validators.py` now rejects any non-string input before it ever
   reaches a database query.

2. **Rate limiting added** (`flask-limiter`) - login: 10/minute per IP,
   register: 10/hour per IP, task creation: 60/hour per IP. Stops brute-force
   and spam without needing a separate service (uses in-memory storage,
   fine for a single instance).

3. **CORS locked down** - `CORS(app)` (any origin) is now
   `CORS(app, origins=ALLOWED_ORIGINS)`, read from an env var you control.
   Set it to your actual Vercel URL(s).

4. **Debug mode disabled in production** - `app.run(debug=True)` is now
   conditional on `FLASK_ENV`. The Werkzeug debugger is an RCE risk if it's
   ever reachable publicly.

5. **Fail-fast config** - if `MONGO_URI`, `JWT_SECRET`, or `ALLOWED_ORIGINS`
   are missing in production, the app refuses to start instead of silently
   falling back to an insecure default (`"mysecretkey"`) or a local Mongo
   instance nobody intended to use.

6. **Input validation everywhere** - email format, password length
   (8-128 chars), name/title/description length limits, and an enum check
   on `priority`/`status` so bad or oversized data can't get into the DB.

7. **Unique index on email** - previously two simultaneous registrations
   for the same email could both slip past the app-level check and both
   succeed. Now enforced at the database level; the second one gets a
   clean 409 instead of silently creating a duplicate account.

8. **Consistent JSON error responses** - unknown routes, malformed JSON,
   and unexpected server errors all now return `{"message": "..."}` with
   the right status code, instead of Flask's default HTML error page or a
   raw Python traceback (which used to leak internal details).

9. **Case-insensitive, trimmed email** - `Test@Example.com` and
   `test@example.com ` are now treated as the same account.

## New environment variables required on Render

| Variable | Example | Notes |
|---|---|---|
| `MONGO_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/` | same as before |
| `JWT_SECRET` | (long random string) | generate: `python -c "import secrets; print(secrets.token_hex(32))"` |
| `ALLOWED_ORIGINS` | `https://your-app.vercel.app,http://localhost:5173` | comma-separated, no trailing slash |
| `FLASK_ENV` | `production` | leave unset locally for dev fallbacks |

## New dependency

`flask-limiter` was added to `requirements.txt`. Render will install it
automatically on next deploy via `pip install -r requirements.txt`.

## Applying this

Copy every file in this folder into your `backend/` folder, overwriting the
existing ones (this includes two brand new files: `extensions.py` and the
`utils/` folder). Set the four env vars above in Render, then redeploy.

## What I tested locally (with a mocked database, not your real Atlas)

- NoSQL injection payload on login -> blocked (400), not bypassed
- Weak password (<8 chars) -> rejected
- Invalid email format -> rejected
- Malformed JSON body -> clean 400, no server crash
- Case-insensitive email matching on login
- Rate limiting kicks in after repeated login attempts (429)
- Invalid priority/status values on tasks -> rejected
- Oversized task title -> rejected
- Dict/object injected as a task title -> rejected, not stored
- Unknown route -> clean JSON 404
- Full normal flow still works: register, login, create/get/update/delete task
