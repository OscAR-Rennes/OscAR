import './Header.style.css';
import { ReactComponent as ProfilIcon } from '../../assets/icon/profil.svg';
import { ReactComponent as MenuBurgerIcon } from '../../assets/icon/menuBurger.svg';
import { useAuthStore } from '../../store/authStore';


export default function Header() {
  const userRights = useAuthStore((state) => state.user.rights);

  console.log(userRights);
  return (
    <header className="header-bar">
        <MenuBurgerIcon className="header-menu-burger" />
        <h1 className="header-title">OscAR</h1>
        <p className="separator-header">|</p>
        <p className="user-rights">{userRights[0]}</p>
        <ProfilIcon className="header-user-icon" />
    </header>
  );
}
