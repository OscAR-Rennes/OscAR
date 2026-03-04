import React from "react";
import "./Button.style.css";

export default function Button({className = "", ...props }) {
  return (
    <button
      className={`osc-btn ${className}`}
      {...props}
    >
    </button>
  );
}