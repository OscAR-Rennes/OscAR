import './Sidebar.style.css';
import { useAuthStore } from "../../store/authStore";
import { useLocation, useNavigate } from "react-router-dom";

const menuItemsBase = [
  { icon: <img src={require("../../assets/icon/dashboard.svg").default} alt="Dashboard"/>, label: "Tableau de bord", path: "/home/dashboard" },
  { section: "Entités" },
  { icon: <img src={require("../../assets/icon/target.svg").default} alt="Hunts"/>, label: "Chasses", path: "/home/hunts" },
  { icon: <img src={require("../../assets/icon/step.svg").default} alt="Steps"/>, label: "Etapes", path: "/home/steps" },
  //{ icon: <img src={require("../../assets/icon/difficulty.svg").default} alt="Difficulty"/>, label: "Difficulté" },
];

const settingsIcon = <img src={require("../../assets/icon/settings.svg").default} alt="settings" />;

const Sidebar = () => {
  const userRights = useAuthStore((state) => state.user.rights);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [...menuItemsBase];
  if (
    userRights.includes('ADMIN') ||
    userRights.includes('CULTURAL_CENTER_MANAGER')
  ) {
    menuItems.push({
      icon: <img src={require("../../assets/icon/group.svg").default} alt="Users" />,
      label: "Utilisateurs",
      path: "/home/users"
    });
  }

  if (
    userRights.includes('ADMIN') 
  ) {
    menuItems.push({
      icon: <img src={require("../../assets/icon/pin.svg").default} alt="Cultural Center" />,
      label: "Centre culturel",
      path: "/home/cultural-center"
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
                className={`sidebar-item${location.pathname === item.path ? " active" : ""}`}
                onClick={() => {
                  navigate(item.path);
                }}
              >
                <span className={`sidebar-icon${item.path === "/home/steps" ? " sidebar-icon-steps" : ""}`}>{item.icon}</span>
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