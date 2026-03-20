import React, { useState, useEffect } from "react";
import "./DynamicForm.style.css";

export default function DynamicForm({
  fields,
  onSubmit,
  submitLabel = "Valider",
  onFieldChange = undefined,
  resetSignal = 0,
  externalValues = undefined,
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

  useEffect(() => {
    if (!externalValues) return;

    setValues((prev) => {
      let hasChanged = false;
      const nextValues = { ...prev };

      Object.entries(externalValues).forEach(([key, value]) => {
        if (value !== undefined && nextValues[key] !== value) {
          nextValues[key] = value;
          hasChanged = true;
        }
      });

      return hasChanged ? nextValues : prev;
    });
  }, [externalValues]);

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
      if (field.variant === "toggle") {
        return (
          <label className="toggle-switch" aria-label={field.label}>
            <input
              type="checkbox"
              name={field.name}
              checked={!!values[field.name]}
              onChange={(e) => handleChange(field.name, field.type, e.target.checked)}
            />
            <span className="toggle-slider" aria-hidden="true" />
          </label>
        );
      }

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
      {(() => {
        const renderedElements = [];
        const visibleFields = fields.filter(f => !f.showIf || f.showIf(values));
        let i = 0;

        while (i < visibleFields.length) {
          const field = visibleFields[i];

          // S'il y a un groupe, regrouper tous les champs du même groupe
          if (field.group) {
            const groupId = field.group;
            const groupedFields = [];

            while (i < visibleFields.length && visibleFields[i].group === groupId) {
              groupedFields.push(visibleFields[i]);
              i++;
            }

            const isRequired =
              typeof field.required === "function" ? field.required(values) : field.required;

            renderedElements.push(
              <div key={`group-${groupId}`} className="dynamic-form-group">
                {groupedFields.map((gf) => {
                  const isReq =
                    typeof gf.required === "function" ? gf.required(values) : gf.required;

                  return (
                    <div key={gf.name} className="dynamic-form-field">
                      <label>
                        {gf.label}
                        {isReq && <span className="required-asterisk"> *</span>}
                      </label>
                      {renderField(gf)}
                    </div>
                  );
                })}
              </div>
            );
          } else {
            const isRequired =
              typeof field.required === "function" ? field.required(values) : field.required;

            renderedElements.push(
              <div key={field.name} className="dynamic-form-field">
                <label>
                  {field.label}
                  {isRequired && <span className="required-asterisk"> *</span>}
                </label>
                {renderField(field)}
              </div>
            );
            i++;
          }
        }

        return renderedElements;
      })()}
      <p>
        <span className="required-asterisk">*</span> champs obligatoires
      </p>
      <button type="submit">{submitLabel}</button>
    </form>
  );
}