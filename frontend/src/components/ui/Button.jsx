import Spinner from "./Spinner";

/**
 * Reusable button.
 * variant: "primary" | "secondary" | "danger" | "ghost"
 * size: "md" | "sm"
 */
function Button({
  children,
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  type = "button",
  icon = null,
  className = "",
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      className={`btn btn--${variant} btn--${size} ${
        loading ? "btn--loading" : ""
      } ${className}`}
      {...rest}
    >
      {loading && <Spinner size={size === "sm" ? 14 : 16} />}
      {!loading && icon}
      <span>{children}</span>
    </button>
  );
}

export default Button;
