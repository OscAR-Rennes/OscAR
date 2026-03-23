import { FormField } from "./Components/FormField";
import { FormItem } from "./Components/FormItem";
import { FormLabel } from "./Components/FormLabel";
import { FormError } from "./Components/FormError";
import { Select } from "./UI/Select";

type Option = {
  value: string;
  label: string;
};

type Props = {
  name: string;
  label: string;
  options: Option[];
  required?: boolean;
  disabled?: boolean;
};

export function FormSelect({ name, label, options, required = true, disabled = false }: Props) {
    const rules = required ? { required: "Ce champ est obligatoire" } : {};
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

            <Select
                value={field.value}
                onChange={field.onChange}
                options={options}
              disabled={disabled}
            />
          </div>

            <FormError name={name} />
            </FormItem>
        )}
        />
    );
}