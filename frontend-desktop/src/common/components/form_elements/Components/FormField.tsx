import { Controller, useFormContext } from "react-hook-form";

export function FormField({ name, render, rules }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={render}
    />
  );
}