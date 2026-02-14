import { useState } from "react";
import DynamicForm from "../../common/components/dynamic_form/DynamicForm.jsx";
import { useAuthStore } from "../../common/store/authStore";
import { useAuthentificationData } from "./authentification.data";
import Modal from "../../common/components/modal/Modal.jsx";
import "./authentification.style.css";

export default function Authentification() {
  const {
    addLoginFields,
    addSigninFields,
    //handleLogout,
    handleSubmitLogin,
    handleSubmitSignin
  } = useAuthentificationData();

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [resetLoginForm, setResetLoginForm] = useState(0);
  const [resetSigninForm, setResetSigninForm] = useState(0);
  const [showSignin, setShowSignin] = useState(true);


  return (
    <Modal>
      {showSignin ? (
        <>
          <div className="auth-header">
            <h1 className="auth-title">LOOTOPIA</h1>
            <p className="auth-subtitle">La chasse vous attend !</p>
          </div>
          <DynamicForm
            fields={addSigninFields}
            onSubmit={async (data: any) => {
              await handleSubmitSignin(data);
              setResetSigninForm((n) => n + 1);
              setShowSignin(false);
            }}
            submitLabel="S'inscrire"
            resetSignal={resetSigninForm}
          />
          <div className="auth-footer">
            <span>
              Vous avez déjà un compte ?{" "}
              <a
                href="#"
                className="auth-link secondary"
                onClick={(e) => {
                  e.preventDefault();
                  setShowSignin(false);
                }}
              >
                Connectez-vous !
              </a>
            </span>
          </div>
        </>
      ) : (
        <>
          <div className="auth-header">
            <h1 className="auth-title">LOOTOPIA</h1>
            <p className="auth-subtitle">La chasse vous attend !</p>
          </div>
          <DynamicForm
            fields={addLoginFields}
            onSubmit={async (data: any) => {
              await handleSubmitLogin(data);
              setResetLoginForm((n) => n + 1);
            }}
            submitLabel="Se connecter"
            resetSignal={resetLoginForm}
          />
          <div className="auth-footer">
            <span>
              Pas encore de compte ?{" "}
              <a
                href="#"
                className="auth-link secondary"
                onClick={(e) => {
                  e.preventDefault();
                  setShowSignin(true);
                }}
              >
                Inscrivez-vous !
              </a>
            </span>
          </div>
        </>
      )}

      {/* <section aria-label="Auth actions">
        <button
          type="button"
          onClick={handleLogout}
          disabled={!isAuthenticated}
        >
          Se déconnecter
        </button>
      </section> */}
    </Modal>
  );
}