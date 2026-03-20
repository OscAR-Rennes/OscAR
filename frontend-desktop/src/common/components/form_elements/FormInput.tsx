import { FormField } from "./Components/FormField";
import { FormItem } from "./Components/FormItem";
import { FormLabel } from "./Components/FormLabel";
import { FormError } from "./Components/FormError";
import { InputNumber } from "./UI/InputNumber";
import { Input } from "./UI/Input";

export function FormInput({
  name,
  label,
  required = false,
  type = "text",
    readOnly = false,
    disabled = false,
}) {

    const rules = required
        ? { required: "Ce champ est obligatoire" }
        : {};

    return (
        <FormField
        name={name}
        rules={rules}
        render={({ field }) => (
            <FormItem>
            <FormLabel>{label}</FormLabel>

            <div className="osc-form-control-row">
                            <span
                                className={`osc-form-required ${required ? "" : "is-hidden"}`}
                                aria-hidden="true"
                            >
                                *
                            </span>

              {type === "number" ? (
                                <InputNumber {...field} readOnly={readOnly} disabled={disabled} />
              ) : (
                                <Input {...field} readOnly={readOnly} disabled={disabled} />
              )}
            </div>

            <FormError name={name} />
            </FormItem>
        )}
        />
    );
}