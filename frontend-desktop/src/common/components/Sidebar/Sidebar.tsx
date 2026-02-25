import React from "react";
import '../Sidebar/Sidebar.style.css';
import { RoleEnum } from "../../enum/RolesEnum";
import { useAuthStore } from "../../store/authStore";
import { useNavigate } from "react-router-dom";

const menuItemsBase = [
  { icon: <img src={require("../../assets/icon/dashboard.svg").default} alt="Dashboard"/>, label: "Tableau de bord" },
  { icon: <img src={require("../../assets/icon/accounts.svg").default} alt="Accounts"/>, label: "Comptes" },
  { section: "Gestionnaire de chasse" },
  { icon: <img src={require("../../assets/icon/hunts.svg").default} alt="Hunts"/>, label: "Chasses" },
  { icon: <img src={require("../../assets/icon/locationPointer.svg").default} alt="Pointers"/>, label: "Etapes" },
  //{ icon: <img src={require("../../assets/icon/difficulty.svg").default} alt="Difficulty"/>, label: "Difficulté" },
];

const settingsIcon = <img src={require("../../assets/icon/settings.svg").default} alt="settings" />;

const Sidebar = () => {
  const userRights = useAuthStore((state) => state.user.rights);
  const navigate = useNavigate();

  const menuItems = [...menuItemsBase];
  if (
    userRights.includes('ADMIN') ||
    userRights.includes('CULTURAL_CENTER_MANAGER')
  ) {
    menuItems.push({
      icon: <img src={require("../../assets/icon/culturalCenter.svg").default} alt="Cultural Center" />,
      label: "Centre culturel",
    });
  }

  return (
    <div className="sidebar-container">
      <nav className="sidebar open">
        <ul>
          {menuItems.map((item, idx) =>
            item.section ? (
              <li key={idx} className="sidebar-section">
                {item.section}
              </li>
            ) : (
              <li
                key={idx}
                className="sidebar-item"
                onClick={() => {
                  if (item.label === "Comptes") {
                    navigate("/home/accounts");
                  }
                }}
              >
                <span className="sidebar-icon">{item.icon}</span>
                <span className="sidebar-label">{item.label}</span>
              </li>
            )
          )}
        </ul>
        <div className="sidebar-settings-container">
          <li className="sidebar-settings-item">
            <span className="sidebar-icon">{settingsIcon}</span>
            <span className="sidebar-label">Paramètres</span>
          </li>
        </div>
      </nav>
      <div className="sidebar-navigation">
        <button onClick={() => navigate('/')}>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;