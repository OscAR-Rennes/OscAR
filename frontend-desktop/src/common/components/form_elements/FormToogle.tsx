import { FormField } from "./Components/FormField";
import { FormItem } from "./Components/FormItem";
import { FormLabel } from "./Components/FormLabel";
import { FormError } from "./Components/FormError";
import { ReactComponent as LockLargerIcon } from "../../assets/icon/lock-larger.svg";

type FormToogleProps = {
  name: string;
  label: string;
  required?: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
  disabled?: boolean;
  readOnly?: boolean;
};

export function FormToogle({
  name,
  label,
  required = false,
  activeLabel = "Actif",
  inactiveLabel = "Inactif",
  disabled = false,
  readOnly = false,
}: FormToogleProps) {
  const rules = required ? { required: "Ce champ est obligatoire" } : {};

  return (
    <FormField
      name={name}
      rules={rules}
      render={({ field }) => {
        const isActive = Boolean(field.value);
        const isLocked = disabled || readOnly;

        return (
          <FormItem>
            <FormLabel>
              {readOnly ? (
                <span className="osc-readonly-label">
                  <LockLargerIcon
                    className="osc-readonly-lock-icon"
                    aria-hidden="true"
                    focusable="false"
                  />
                  <span>{label}</span>
                </span>
              ) : (
                label
              )}
            </FormLabel>

            <div className="osc-form-control-row">
              <span
                className={`osc-form-required ${required ? "" : "is-hidden"}`}
                aria-hidden="true"
              >
                *
              </span>

              <div className="osc-form-toggle-wrap">
                <button
                  type="button"
                  className={`osc-form-toggle ${readOnly ? "osc-form-toggle--readonly" : "osc-form-toggle--editable"} ${isActive ? "osc-form-toggle--active" : ""}`.trim()}
                  role="switch"
                  aria-checked={isActive}
                  aria-label={isActive ? activeLabel : inactiveLabel}
                  title={isActive ? activeLabel : inactiveLabel}
                  onClick={() => {
                    if (isLocked) return;
                    field.onChange(!isActive);
                  }}
                  disabled={isLocked}
                >
                  <span className="osc-form-toggle-thumb" />
                </button>
                <span>{isActive ? activeLabel : inactiveLabel}</span>
              </div>
            </div>

            <FormError name={name} />
          </FormItem>
        );
      }}
    />
  );
}
