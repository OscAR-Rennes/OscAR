import React from "react";
import "./Button.style.css";

export default function Button({ className = "", children, ...props }) {
  return (
    <button
      className={`osc-btn ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}