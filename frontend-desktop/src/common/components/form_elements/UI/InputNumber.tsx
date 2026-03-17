import React, { forwardRef } from "react";

type InputNumberProps =
  React.InputHTMLAttributes<HTMLInputElement>;

export const InputNumber = forwardRef<
  HTMLInputElement,
  InputNumberProps
>(({ className = "", ...props }, ref) => {
  return <input type="number" ref={ref} className={`osc-form-control ${className}`.trim()} {...props} />;
});

InputNumber.displayName = "InputNumber";