import { FormProvider, useForm } from "react-hook-form";
import "./Form.style.css";

export function Form({ children, onSubmit, defaultValues }) {
  const methods = useForm({ defaultValues });

  return (
    <FormProvider {...methods}>
      <form className="osc-form" onSubmit={methods.handleSubmit(onSubmit)}>
        {children}
      </form>
    </FormProvider>
  );
}