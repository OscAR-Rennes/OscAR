import { useState } from "react";
import DynamicForm from "../../common/components/dynamic_form/DynamicForm.jsx";
import { useAuthentificationData } from "./authentification.data";
import Modal from "../../common/components/modal/Modal.jsx";
import scanImage from "../../common/assets/images/scan.jpg";
import "./authentification.style.css";

export default function Authentification() {
  const {
    addLoginFields,
    addSigninFields,
    twoFactorFields,
    handleSubmitLogin,
    handleSubmitSignin,
    handleSubmitTwoFactorCode,
    handleResendTwoFactorCode,
    resetAuthFlow,
    isTwoFactorStep,
    pendingApproval,
    twoFactorEmail,
  } = useAuthentificationData();

  const [resetLoginForm, setResetLoginForm] = useState(0);
  const [resetSigninForm, setResetSigninForm] = useState(0);
  const [resetTwoFactorForm, setResetTwoFactorForm] = useState(0);
  const [showSignin, setShowSignin] = useState(true);


  return (
    <Modal>
      <section className="auth-card" aria-label="Authentification">
        <aside className="auth-visual">
          <img src={scanImage} alt="Paysage de voyage" className="auth-visual-image" />
        </aside>

        <div className="auth-panel">
          {pendingApproval ? (
            <>
              <div className="auth-header">
                <h1 className="auth-title">LOOTOPIA</h1>
              </div>
              <div className="auth-pending-panel">
                <h2>Compte en attente de validation</h2>
                <p>
                  Votre code a bien été vérifié, mais votre compte n'est pas encore validé par un administrateur.
                </p>
                <button
                  type="button"
                  className="auth-link-btn"
                  onClick={() => {
                    resetAuthFlow();
                    setShowSignin(false);
                  }}
                >
                  Revenir à la connexion
                </button>
              </div>
            </>
          ) : isTwoFactorStep ? (
            <>
              <div className="auth-header">
                <h1 className="auth-title">LOOTOPIA</h1>
                <p className="auth-subtitle">Entrez le code reçu par email{twoFactorEmail ? ` (${twoFactorEmail})` : ""}</p>
              </div>
              <DynamicForm
                fields={twoFactorFields}
                onSubmit={async (data: any) => {
                  await handleSubmitTwoFactorCode(data);
                  setResetTwoFactorForm((n) => n + 1);
                }}
                submitLabel="Vérifier le code"
                resetSignal={resetTwoFactorForm}
              />
              <div className="auth-footer auth-twofactor-footer">
                <button type="button" className="auth-link-btn" onClick={handleResendTwoFactorCode}>
                  Renvoyer le code
                </button>
                <button
                  type="button"
                  className="auth-link-btn secondary"
                  onClick={() => {
                    resetAuthFlow();
                    setShowSignin(false);
                  }}
                >
                  Retour à la connexion
                </button>
              </div>
            </>
          ) : showSignin ? (
            <>
              <div className="auth-header">
                <h1 className="auth-title">LOOTOPIA</h1>
              </div>
              <DynamicForm
                fields={addSigninFields}
                onSubmit={async (data: any) => {
                  await handleSubmitSignin(data);
                  setResetSigninForm((n) => n + 1);
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
                      resetAuthFlow();
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
                      resetAuthFlow();
                      setShowSignin(true);
                    }}
                  >
                    Inscrivez-vous !
                  </a>
                </span>
              </div>
            </>
          )}
        </div>
      </section>

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