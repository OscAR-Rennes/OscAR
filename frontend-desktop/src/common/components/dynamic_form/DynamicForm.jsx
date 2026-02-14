import React, { useState, useEffect } from "react";
import "./DynamicForm.style.css";

export default function DynamicForm({
  fields,
  onSubmit,
  submitLabel = "Valider",
  onFieldChange = undefined,
  resetSignal = 0,
}) {
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
    <form className="dynamic-form-container" onSubmit={handleSubmit}>
      {fields.map((field) => (
        <div key={field.name} className="dynamic-form-field">
          <label>
            {field.label}
            {field.required && " *"}
          </label>
          {renderField(field)}
        </div>
      ))}
      <p>* champs obligatoires</p>
      <button type="submit">{submitLabel}</button>
    </form>
  );
}