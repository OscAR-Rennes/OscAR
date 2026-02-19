import { Outlet } from "react-router-dom";
import Header from "../header/Header";
import Sidebar from "../Sidebar/Sidebar";
import "./Layout.style.css";

export default function Layout() {
  return (
    <div className="layout-root">
      <Header />
      <div className="layout-content">
        <Sidebar />
        <main className="layout-main">
          <Outlet />
        </main>
      </div>
      {/* <Footer /> */}
    </div>
  );
}