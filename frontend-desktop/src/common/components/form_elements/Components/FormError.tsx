import { useFormContext } from "react-hook-form";

export function FormError({ name }) {
  const {
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  if (!error) return null;

  return (
    <p className="osc-form-error">
      {error.message?.toString()}
    </p>
  );
}