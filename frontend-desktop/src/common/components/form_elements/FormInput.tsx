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

            {type === "number" ? (
                <InputNumber {...field} readOnly={readOnly} disabled={disabled} />
            ) : (
                <Input {...field} readOnly={readOnly} disabled={disabled} />
            )}

            <FormError name={name} />
            </FormItem>
        )}
        />
    );
}