import { CreateHuntDto } from "../../api/models/hunts/AddHuntDto";
import { CreateIndexDto } from "../../api/models/index/AddIndexDto";
import { CreateStepDto } from "../../api/models/steps/AddStepDto";
import DynamicForm from "../../common/components/dynamic_form/DynamicForm";
import { useHomeData } from "./hunts.data";
import { useState } from "react";

export default function Home() {
  const {
    addHuntFields,
    addStepFields,
    addIndexFields,
    handleAddHunt,
    handleAddStep,
    handleAddIndex,
    setSelectedHuntId
  } = useHomeData();

  const [resetHuntForm, setResetHuntForm] = useState(0);
  const [resetIndexForm, setResetIndexForm] = useState(0);
  const [resetStepForm, setResetStepForm] = useState(0);

  return (
    <>
      <h1>Lootopia V0.0.1 - Hunt management</h1>

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

      <section>
        <h2>Ajouter un Index</h2>
        <DynamicForm
          fields={addIndexFields}
          onSubmit={async (data: CreateIndexDto) => {
            await handleAddIndex(data);
            setResetIndexForm((n) => n + 1); 
          }}
          submitLabel="Envoyer"
          resetSignal={resetIndexForm}
        />
      </section>

      <section>
        <h2>Ajouter une étape</h2>
        <DynamicForm
          fields={addStepFields}
          onSubmit={async (data: CreateStepDto) => {
            await handleAddStep(data);
            setResetStepForm((n) => n + 1); 
          }}
          submitLabel="Envoyer"
          resetSignal={resetStepForm}
          onFieldChange={(name: string, value: string | number) => {
            if (name === "hunt_id") setSelectedHuntId(value);
          }}
        />
      </section>
    </>
  );
}