import { API_BASE_URL } from "../config/api";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { EyeIcon, EyeOffIcon } from "../components/ui/Icon";

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const validate = () => {
    const nextErrors = {};
    if (!email.trim()) {
      nextErrors.email = "Enter your email.";
    } else if (!isValidEmail(email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!password) {
      nextErrors.password = "Enter your password.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setFormError("");

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("token", data.token);
        navigate("/dashboard");
      } else {
        setFormError(data.message || "Could not log in. Check your details.");
      }
    } catch (err) {
      console.error("Login request failed:", err);
      setFormError("Could not reach the server. Please try again in a moment.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-panel">
        <span className="auth-panel__mark" aria-hidden="true" />
        <h1 className="auth-panel__title">TaskFlow</h1>
        <p className="auth-panel__tagline">
          Plan your day, track what matters, and keep every task moving.
        </p>
      </div>

      <div className="auth-card-wrap">
        <div className="auth-card">
          <h2>Welcome back</h2>
          <p className="auth-card__subtitle">Log in to see your tasks.</p>

          <form onSubmit={handleLogin} noValidate>
            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
              autoComplete="email"
            />

            <div className="field field--password">
              <Input
                label="Password"
                type={showPassword ? "text" : "password"}
                placeholder="Your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="field__reveal"
                onClick={() => setShowPassword((v) => !v)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOffIcon width={18} height={18} />
                ) : (
                  <EyeIcon width={18} height={18} />
                )}
              </button>
            </div>

            {formError && (
              <p className="field__message field__message--error">{formError}</p>
            )}

            <Button type="submit" loading={isSubmitting} className="auth-card__submit">
              Log in
            </Button>
          </form>

          <p className="auth-card__footer">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
