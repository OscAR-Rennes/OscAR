import { FormProvider, useForm } from "react-hook-form";
import "./Form.style.css";

export function Form({ children, onSubmit, onInvalid = undefined, defaultValues, id = undefined, className = "" }) {
  const methods = useForm({ defaultValues });

  return (
    <FormProvider {...methods}>
      <form
        id={id}
        className={`osc-form ${className}`.trim()}
        onSubmit={methods.handleSubmit(onSubmit, onInvalid)}
      >
        {children}
      </form>
    </FormProvider>
  );
}