import React from "react";
import "./TextInput.style.css";

export default function TextInput({
  name,
  label,
  value,
  onChange,
  placeholder = "",
  required = false,
  type = "text",
  ...props
}) {
  return (
    <div className="text-input-container">
      {label && (
        <label htmlFor={name} className="text-input-label">
          {label}
          {required && <span className="text-input-required">*</span>}
        </label>
      )}
      <input
        className="text-input"
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        {...props}
      />
    </div>
  );
}