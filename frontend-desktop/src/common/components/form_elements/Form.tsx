import { FormProvider, useForm } from "react-hook-form";

export function Form({ children, onSubmit, defaultValues }) {
  const methods = useForm({ defaultValues });

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        {children}
      </form>
    </FormProvider>
  );
}