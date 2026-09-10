import { API_BASE_URL } from "../config/api";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { EyeIcon, EyeOffIcon } from "../components/ui/Icon";

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  const navigate = useNavigate();

  const validate = () => {
    const nextErrors = {};
    if (!name.trim()) {
      nextErrors.name = "Enter your name.";
    }
    if (!email.trim()) {
      nextErrors.email = "Enter your email.";
    } else if (!isValidEmail(email)) {
      nextErrors.email = "Enter a valid email address.";
    }
    if (!password) {
      nextErrors.password = "Create a password.";
    } else if (password.length < 6) {
      nextErrors.password = "Use at least 6 characters.";
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setFormError("");
    setSuccessMessage("");

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage("Registration successful. Redirecting to login…");
        setTimeout(() => navigate("/login"), 900);
      } else {
        setFormError(data.message || "Could not create your account.");
      }
    } catch (err) {
      console.error("Register request failed:", err);
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
          <h2>Create your account</h2>
          <p className="auth-card__subtitle">
            It only takes a minute to get started.
          </p>

          <form onSubmit={handleRegister} noValidate>
            <Input
              label="Name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={errors.name}
              autoComplete="name"
            />

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
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={errors.password}
                autoComplete="new-password"
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
            {successMessage && (
              <p className="field__message field__message--success">
                {successMessage}
              </p>
            )}

            <Button type="submit" loading={isSubmitting} className="auth-card__submit">
              Create account
            </Button>
          </form>

          <p className="auth-card__footer">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
