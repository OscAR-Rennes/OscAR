import React, { useState, useEffect } from "react";
import "./DynamicForm.style.css";

export default function DynamicForm({ fields, onSubmit, submitLabel = "Valider", onFieldChange = undefined, resetSignal = 0, footer = null }) {
  const [values, setValues] = useState(() =>
    fields.reduce((acc, field) => {
      acc[field.name] = field.defaultValue ?? "";
      return acc;
    }, {})
  );

  useEffect(() => {
    setValues(
      fields.reduce((acc, field) => {
        acc[field.name] = field.defaultValue ?? "";
        return acc;
      }, {})
    );
  }, [resetSignal]);

  const handleChange = (name, type, value) => {
    const parsed = type === "number" ? (value === "" ? "" : Number(value)) : value;

    setValues((prev) => ({ ...prev, [name]: parsed }));

    if (onFieldChange) {
      onFieldChange(name, parsed);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(values);
  };

  const renderField = (field) => {
    if (field.type === "select") {
      return (
        <select
          name={field.name}
          required={field.required}
          value={values[field.name]}
          onChange={(e) => handleChange(field.name, field.type, e.target.value)}
        >
          <option value="">-- Choisir --</option>
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type={field.type}
        name={field.name}
        placeholder={field.placeholder}
        required={field.required}
        value={values[field.name]}
        onChange={(e) => handleChange(field.name, field.type, e.target.value)}
      />
    );
  };

  return (
    <div className="dynamic-form-bg">
      <form className="dynamic-form-container" onSubmit={handleSubmit}>
        <div className="dynamic-form-header">
          <h1 className="dynamic-form-title">LOOTOPIA</h1>
          <p className="dynamic-form-subtitle">La chasse vous attend !</p>
        </div>
        {fields.map((field) => (
          <div key={field.name} className="dynamic-form-field">
            <label>
              {field.label}
              {field.required && " *"}
            </label>
            {renderField(field)}
          </div>
        ))}
        <p className="dynamic-form-legend"><span className="required-star">*</span> champs obligatoires</p>
        
        <button type="submit">{submitLabel}</button>
        {footer && <div className="dynamic-form-footer">{footer}</div>}
      </form>
    </div>
  );
}