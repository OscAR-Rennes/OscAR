import { ReactComponent as LockIcon } from "../../assets/icon/lock-larger.svg";
import { FormError } from "./Components/FormError";
import { FormField } from "./Components/FormField";
import { FormItem } from "./Components/FormItem";
import { FormLabel } from "./Components/FormLabel";

type FormFileProps = {
  name: string;
  label: string;
  accept: string;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  readOnlyValue?: string | null;
};

export function FormFile({
  name,
  label,
  accept,
  required = false,
  disabled = false,
  readOnly = false,
  readOnlyValue = null,
}: FormFileProps) {
  if (readOnly) {
    return (
      <FormItem>
        <label className="osc-form-label osc-readonly-label">
          <LockIcon className="osc-readonly-lock-icon" aria-hidden="true" focusable="false" />
          <span>{label}</span>
        </label>

        <div className="osc-form-control-row">
          <span className="osc-form-required is-hidden" aria-hidden="true">
            *
          </span>

          <div className="osc-form-control osc-form-file-readonly">
            {readOnlyValue || "Aucun fichier chargé"}
          </div>
        </div>
      </FormItem>
    );
  }

  const rules = required
    ? {
        validate: (value: File | null) => {
          if (value) return true;
          return "Ce champ est obligatoire";
        },
      }
    : {};

  return (
    <FormField
      name={name}
      rules={rules}
      render={({ field }) => {
        const selectedFileName = field.value?.name ?? "";

        return (
          <FormItem>
            <FormLabel>{label}</FormLabel>

            <div className="osc-form-control-row">
              <span
                className={`osc-form-required ${required ? "" : "is-hidden"}`}
                aria-hidden="true"
              >
                *
              </span>

              <div className="osc-form-file-wrap">
                <input
                  type="file"
                  accept={accept}
                  disabled={disabled}
                  className="osc-form-control osc-form-file-input"
                  onBlur={field.onBlur}
                  onChange={(event) => {
                    const file = event.target.files?.[0] ?? null;
                    field.onChange(file);
                  }}
                />
              </div>
            </div>

            <FormError name={name} />
          </FormItem>
        );
      }}
    />
  );
}