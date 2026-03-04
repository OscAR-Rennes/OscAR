import { forwardRef } from "react";

export const Input = forwardRef<
  HTMLInputElement,
  React.ComponentProps<"input">
>((props, ref) => {
  return <input ref={ref} {...props} />;
});

Input.displayName = "Input";