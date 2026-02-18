import './Header.style.css';
import { ReactComponent as ProfilIcon } from '../../assets/icon/profil.svg';
import { ReactComponent as MenuBurgerIcon } from '../../assets/icon/menuBurger.svg';
import { RoleEnum } from '../../enum/RolesEnum';
import { useAuthStore } from '../../store/authStore';


export default function Header() {
  const userRights = useAuthStore((state) => state.user.rights);
  const userName = useAuthStore((state) => state.user.username);

  const userRightsLabel = RoleEnum[userRights[0]] || userRights[0];


  return (
    <header className="header-bar">
      <MenuBurgerIcon className="header-menu-burger" />
      <h1 className="header-title">OscAR</h1>
      <p className="separator-header">|</p>
      <p className="user-rights">{userRightsLabel}</p>
      <p className="user-name">{userName}</p>
      <ProfilIcon className="header-user-icon" />
    </header>
  );
}
