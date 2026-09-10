import { useId } from "react";

function Select({ label, error, options, className = "", ...rest }) {
  const generatedId = useId();
  const id = rest.id || generatedId;

  return (
    <div className={`field ${error ? "field--error" : ""} ${className}`}>
      {label && (
        <label htmlFor={id} className="field__label">
          {label}
        </label>
      )}
      <select id={id} className="field__control field__control--select" {...rest}>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="field__message field__message--error">{error}</p>}
    </div>
  );
}

export default Select;
