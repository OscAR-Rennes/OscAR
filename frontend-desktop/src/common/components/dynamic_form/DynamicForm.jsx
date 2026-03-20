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
  }, [resetSignal, fields]);

  const handleChange = (name, type, value) => {
    const parsed = type === "number" ? (value === "" ? "" : Number(value)) : value;

    setValues((prev) => {
      const newValues = { ...prev, [name]: parsed };
      return newValues;
    });

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
          required={typeof field.required === "function" ? field.required(values) : field.required}
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

    if (field.type === "checkbox") {
      return (
        <input
          type="checkbox"
          name={field.name}
          checked={!!values[field.name]}
          onChange={(e) => handleChange(field.name, field.type, e.target.checked)}
        />
      );
    }

    return (
      <input
        type={field.type}
        name={field.name}
        placeholder={field.placeholder}
        required={typeof field.required === "function" ? field.required(values) : field.required}
        value={values[field.name]}
        onChange={(e) => handleChange(field.name, field.type, e.target.value)}
      />
    );
  };

  return (
    <form className="dynamic-form-container" onSubmit={handleSubmit}>
      {fields.map((field) => {
        if (field.showIf && !field.showIf(values)) return null;

        const isRequired =
          typeof field.required === "function" ? field.required(values) : field.required;

        return (
          <div key={field.name} className="dynamic-form-field">
            <label>
              {field.label}
              {isRequired && <span className="required-asterisk"> *</span>}
            </label>
            {renderField(field)}
          </div>
        );
      })}
      <p>
        <span className="required-asterisk">*</span> champs obligatoires
      </p>
      <button type="submit">{submitLabel}</button>
    </form>
  );
}
