import React, { useState } from "react";
import "./MenuBurger.style.css";

const menuItems = [
  { icon: <img src={require("../../assets/icon/dashboard.svg").default} alt="Pointer"/>, label: "Dashboard" },
  { icon: <img src={require("../../assets/icon/accounts.svg").default} alt="Pointer"/>, label: "Accounts" },
  { section: "Entities" },
  { icon: <img src={require("../../assets/icon/hunts.svg").default} alt="Pointer"/>, label: "Hunts" },
  { icon: <img src={require("../../assets/icon/locationPointer.svg").default} alt="Pointer"/>,label: "Pointers"},
  { icon: <img src={require("../../assets/icon/difficulty.svg").default} alt="Pointer"/>, label: "Difficulty" },
  { icon: <img src={require("../../assets/icon/culturalCenter.svg").default} alt="Pointer"/>, label: "Cultural Center" },
];

const settingsIcon = <img src={require("../../assets/icon/settings.svg").default} alt="Settings" />;

export default function MenuBurger({ icon }: { icon?: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="menu-burger-container">
      <button className={`burger-btn${open ? " open" : ""}`}
        onClick={() => setOpen((o) => !o)}
        aria-label="Open menu"
      >
      {icon ? (icon) : ("")}
      </button>
      <nav className={`side-menu${open ? " open" : ""}`}>
        <ul>
          {menuItems.map((item, idx) =>
            item.section ? (
              <li key={idx} className="menu-section">
                {item.section}
              </li>
            ) : (
              <li key={idx} className="menu-item">
                <span className="menu-icon">{item.icon}</span>
                <span className="menu-label">{item.label}</span>
              </li>
            )
          )}
        </ul>
        <div className="menu-settings-container">
          <li className="menu-settings-item">
            <span className="menu-icon">{settingsIcon}</span>
            <span className="menu-label">Settings</span>
          </li>
        </div>
      </nav>
      {open && <div className="menu-overlay" onClick={() => setOpen(false)} />}
    </div>
  );
}