import { useId } from "react";

function Input({ label, error, hint, className = "", ...rest }) {
  const generatedId = useId();
  const id = rest.id || generatedId;

  return (
    <div className={`field ${error ? "field--error" : ""} ${className}`}>
      {label && (
        <label htmlFor={id} className="field__label">
          {label}
        </label>
      )}
      <input
        id={id}
        className="field__control"
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        {...rest}
      />
      {error ? (
        <p className="field__message field__message--error" id={`${id}-error`}>
          {error}
        </p>
      ) : hint ? (
        <p className="field__message">{hint}</p>
      ) : null}
    </div>
  );
}

export default Input;
