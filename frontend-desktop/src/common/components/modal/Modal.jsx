import React from "react";
import "./Modal.style.css";

export default function Modal({ children }) {
  return <div className="modal-bg">{children}</div>;
}