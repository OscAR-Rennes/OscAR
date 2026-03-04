import React, { forwardRef } from "react";

type InputNumberProps =
  React.InputHTMLAttributes<HTMLInputElement>;

export const InputNumber = forwardRef<
  HTMLInputElement,
  InputNumberProps
>((props, ref) => {
  return <input type="number" ref={ref} {...props} />;
});

InputNumber.displayName = "InputNumber";