import { Outlet } from "react-router-dom";


export default function LayoutEmpty() {
  return (
    <>
      <main>
        <Outlet />
      </main>
      {/* <Footer /> */}
    </>
  );
}