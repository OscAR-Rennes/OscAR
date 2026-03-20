import { forwardRef } from "react";

export const Input = forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>(({ className = "", ...props }, ref) => {
  return <input ref={ref} className={`osc-form-control ${className}`.trim()} {...props} />;
});

Input.displayName = "Input";