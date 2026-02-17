import './Header.style.css';
import { ReactComponent as ProfilIcon } from '../../assets/icon/profil.svg';
import { ReactComponent as MenuBurgerIcon } from '../../assets/icon/menuBurger.svg';
import { useAuthStore } from '../../store/authStore';

const userRights = useAuthStore((state) => state.user);

const isLoading = useAuthStore((state) => state.isLoading);

export default function Header() {
  if (isLoading) {
    return (<div>Loading...</div>);
  }
  return (
    <header className="header-bar">
        <MenuBurgerIcon className="header-menu-burger" />
        <h1 className="header-title">OscAR</h1>
        <p className="separator-header">|</p>
        <p className="user-rights">{userRights}</p>
        <ProfilIcon className="header-user-icon" />
    </header>
  );
}
