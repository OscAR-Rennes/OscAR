import { useState } from "react";
import DynamicForm from "../../common/components/dynamic_form/DynamicForm.jsx";
import { useAuthStore } from "../../common/store/authStore";
import { useAuthentificationData } from "./authentification.data";

export default function Authentification() {
  
  const {
    addLoginFields,
    addSigninFields,
    handleLogout,
    handleSubmitLogin,
    handleSubmitSignin
  } = useAuthentificationData();

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const [resetLoginForm, setResetLoginForm] = useState(0);
  const [resetSigninForm, setResetSigninForm] = useState(0);

  return (
    <>
      <DynamicForm
        fields={addSigninFields}
        onSubmit={async (data: any) => {
          await handleSubmitSignin(data);
          setResetSigninForm((n) => n + 1); 
        }}
        submitLabel="Envoyer"
        resetSignal={resetSigninForm}
      />

      <DynamicForm
        fields={addLoginFields}
        onSubmit={async (data: any) => {
          await handleSubmitLogin(data);
          setResetLoginForm((n) => n + 1); 
        }}
        submitLabel="Envoyer"
        resetSignal={resetLoginForm}
      />
      
      <section aria-label="Auth actions">
        <button
          type="button"
          onClick={() => {
            console.log("AUTH STORE:", { user, isAuthenticated });
          }}
        >
          Debug auth store
        </button>

        <button
          type="button"
          onClick={handleLogout}
          disabled={!isAuthenticated}
        >
          Se déconnecter
        </button>
      </section>

    </>

  );
}