import { useFormContext } from "react-hook-form";

export function FormError({ name }) {
  const {
    formState: { errors },
  } = useFormContext();

  const error = errors[name];

  if (!error) return null;

  return (
    <p>
      {error.message?.toString()}
    </p>
  );
}