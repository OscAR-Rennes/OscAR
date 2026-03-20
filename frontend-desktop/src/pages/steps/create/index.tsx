import { CreateIndexDto } from "../../../api/models/index/AddIndexDto";
import { CreateStepDto } from "../../../api/models/steps/AddStepDto";
import {
  HuntSelectionSync,
  STEPS_CREATE_TABS,
  StepsMapField,
  useStepsData,
} from "./steps.data";
import { useMemo, useState } from "react";
import HeaderForm from "../../../common/components/header_form/HeaderForm";
import { useAuthStore } from "../../../common/store/authStore";
import Ribbon from "../../../common/components/ribbon/ribbon";
import { Form } from "../../../common/components/form_elements/Form";
import { FormInput } from "../../../common/components/form_elements/FormInput";
import { FormSelect } from "../../../common/components/form_elements/FormSelect";
import "./index.style.css";

export default function StepsCreation() {
  const {
    hunts,
    indexesForHunt,
    handleAddStep,
    handleAddIndex,
    setSelectedHuntId
  } = useStepsData();

  const [resetIndexForm, setResetIndexForm] = useState(0);
  const [resetStepForm, setResetStepForm] = useState(0);
  const [activeTabId, setActiveTabId] = useState("general");
  const connectedUserName = useAuthStore((state) => state.user?.username);

  const huntOptions = useMemo(
    () => hunts.map((hunt: any) => ({ label: hunt.title, value: hunt.id })),
    [hunts]
  );

  const indexOptions = useMemo(
    () =>
      indexesForHunt
        .filter((index: any) => index.name)
        .map((index: any) => ({ label: index.name, value: index.id })),
    [indexesForHunt]
  );

  const activeFormId = activeTabId === "index" ? "create-index-form" : "create-step-form";

  return (
    <div className="steps-create-page">
      <Ribbon formId={activeFormId} />

      <HeaderForm
        title="Nouvelle étape"
        entityName="Étape"
        tabs={STEPS_CREATE_TABS}
        activeTabId={activeTabId}
        onTabChange={setActiveTabId}
        creatorName={connectedUserName}
        creatorLabel="Créé par"
        creatorPlacement="right"
      />

      <section className="steps-create-content">
        {activeTabId === "general" && (
          <div className="steps-create-general-layout">
            <Form
              key={`step-form-${resetStepForm}`}
              id="create-step-form"
              onSubmit={async (data: any) => {
                const payload: CreateStepDto = {
                  title: data.title,
                  description: data.description,
                  hunt_id: data.hunt_id,
                  points: Number(data.points),
                  latitude: data.latitude === "" ? 0 : Number(data.latitude),
                  longitude: data.longitude === "" ? 0 : Number(data.longitude),
                  index_id: data.index_id || undefined,
                };

                await handleAddStep(payload);
                setResetStepForm((n) => n + 1);
                setSelectedHuntId(null);
              }}
              defaultValues={{
                title: "",
                description: "",
                points: "",
                latitude: "",
                longitude: "",
                hunt_id: "",
                index_id: "",
              }}
              className="steps-step-form"
            >
              <HuntSelectionSync onHuntChange={setSelectedHuntId} />

              <div className="steps-step-form-left">
                <p className="steps-create-section-title">Informations de l'étape</p>
                <FormInput name="title" label="Titre" required={true} />
                <FormInput name="description" label="Description" required={true} />
                <FormInput name="points" label="Points" type="number" required={true} />
                <FormInput name="latitude" label="Latitude" type="number" required={false} />
                <FormInput name="longitude" label="Longitude" type="number" required={false} />

                <FormSelect name="hunt_id" label="Chasse" options={huntOptions} required={true} />
                <FormSelect name="index_id" label="Index" options={indexOptions} required={false} />
              </div>

              <StepsMapField />
            </Form>
          </div>
        )}

        {activeTabId === "documents" && (
          <div className="steps-create-placeholder">
            Aucun document à configurer pour le moment.
          </div>
        )}

        {activeTabId === "index" && (
          <div className="steps-create-index-layout">
            <Form
              key={`index-form-${resetIndexForm}`}
              id="create-index-form"
              onSubmit={async (data: CreateIndexDto) => {
                await handleAddIndex(data);
                setResetIndexForm((n) => n + 1);
              }}
              defaultValues={{
                name: "",
                hunt_id: "",
              }}
              className="steps-index-form"
            >
              <FormInput name="name" label="Nom de l'index" required={true} />
              <FormSelect name="hunt_id" label="Chasse" options={huntOptions} required={true} />
            </Form>
          </div>
        )}
      </section>
    </div>
  );
}
