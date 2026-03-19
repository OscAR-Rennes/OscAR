import { CreateHuntDto } from "../../../api/models/hunts/AddHuntDto";
import DynamicForm from "../../../common/components/dynamic_form/DynamicForm";
import { useHomeData } from "./hunts.data";
import { useState } from "react";

export default function HuntsCreation() {
  const {
    addHuntFields,
    handleAddHunt,
  } = useHomeData();

  const [resetHuntForm, setResetHuntForm] = useState(0);

  return (
    <>

      <section>
        <h2>Ajouter une chasse</h2>
        <DynamicForm
          fields={addHuntFields}
          onSubmit={async (data: CreateHuntDto) => {
            await handleAddHunt(data);
            setResetHuntForm((n) => n + 1); 
          }}
          submitLabel="Envoyer"
          resetSignal={resetHuntForm}
        />
      </section>
    </>
  );
}

