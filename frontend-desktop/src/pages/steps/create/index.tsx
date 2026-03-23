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
import { FormFile } from "../../../common/components/form_elements/FormFile";
import NotificationRibbon from "../../../common/components/notification_ribbon/NotificationRibbon";
import "./index.style.css";

const STEP_TAB_BY_FIELD: Record<string, string> = {
  title: "Général",
  description: "Général",
  points: "Général",
  latitude: "Général",
  longitude: "Général",
  hunt_id: "Général",
  index_id: "Général",
  model_file: "Documents",
  image_file: "Documents",
};

const INDEX_TAB_BY_FIELD: Record<string, string> = {
  name: "Index",
  hunt_id: "Index",
};

function buildMissingTabsMessage(errors: any, tabByField: Record<string, string>) {
  const missingTabs = new Set<string>();

  Object.keys(errors ?? {}).forEach((fieldName) => {
    const tabLabel = tabByField[fieldName];
    if (tabLabel) {
      missingTabs.add(tabLabel);
    }
  });

  if (missingTabs.size === 0) {
    return "Veuillez renseignez les champs obligatoires.";
  }

  return `Veuillez renseignez les champs obligatoires dans les onglets : ${Array.from(missingTabs).join(", ")}`;
}

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
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);
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
    <div className={`steps-create-page ${notificationMessage ? "has-notification-ribbon" : ""}`.trim()}>
      {notificationMessage ? (
        <NotificationRibbon
          message={notificationMessage}
          onClose={() => setNotificationMessage(null)}
        />
      ) : null}

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
        {activeTabId !== "index" && (
          <div className="steps-create-general-layout">
            <Form
              key={`step-form-${resetStepForm}`}
              id="create-step-form"
              onSubmit={async (data: any) => {
                setNotificationMessage(null);

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
              onInvalid={(errors: any) => {
                setNotificationMessage(buildMissingTabsMessage(errors, STEP_TAB_BY_FIELD));
              }}
              defaultValues={{
                title: "",
                description: "",
                points: "",
                latitude: "",
                longitude: "",
                hunt_id: "",
                index_id: "",
                model_file: null,
                image_file: null,
              }}
              className={activeTabId === "documents" ? "steps-step-form steps-step-form--documents" : "steps-step-form"}
            >
              <HuntSelectionSync onHuntChange={setSelectedHuntId} />

              <div className={activeTabId === "general" ? "steps-step-form-left" : "steps-step-form-left is-hidden"}>
                <p className="steps-create-section-title">Informations de l'étape</p>
                <FormInput name="title" label="Titre" required={true} />
                <FormInput name="description" label="Description" required={true} />
                <FormInput name="points" label="Points" type="number" required={true} />
                <FormInput name="latitude" label="Latitude" type="number" required={false} />
                <FormInput name="longitude" label="Longitude" type="number" required={false} />

                <FormSelect name="hunt_id" label="Chasse" options={huntOptions} required={true} />
                <FormSelect name="index_id" label="Index" options={indexOptions} required={false} />
              </div>

              <div className={activeTabId === "documents" ? "steps-step-form-left" : "steps-step-form-left is-hidden"}>
                <p className="steps-create-section-title">Documents de l'étape</p>

                <FormFile
                  name="model_file"
                  label="Modèle 3D (.obj)"
                  accept=".obj"
                  required={true}
                />

                <FormFile
                  name="image_file"
                  label="Image (.png, .jpg)"
                  accept=".png,.jpg,.jpeg"
                  required={true}
                />
              </div>

              <div className={activeTabId === "general" ? "steps-step-form-map" : "steps-step-form-map is-hidden"}>
                <StepsMapField />
              </div>
            </Form>
          </div>
        )}

        {activeTabId === "index" && (
          <div className="steps-create-index-layout">
            <Form
              key={`index-form-${resetIndexForm}`}
              id="create-index-form"
              onSubmit={async (data: CreateIndexDto) => {
                setNotificationMessage(null);
                await handleAddIndex(data);
                setResetIndexForm((n) => n + 1);
              }}
              onInvalid={(errors: any) => {
                setNotificationMessage(buildMissingTabsMessage(errors, INDEX_TAB_BY_FIELD));
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
