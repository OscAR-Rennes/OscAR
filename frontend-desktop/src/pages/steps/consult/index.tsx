import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import HeaderForm from "../../../common/components/header_form/HeaderForm";
import { ReadOnlyField } from "../../../common/components/form_elements/ReadOnlyField";
import Ribbon from "../../../common/components/ribbon/ribbon";
import { Form } from "../../../common/components/form_elements/Form";
import { FormInput } from "../../../common/components/form_elements/FormInput";
import { FormSelect } from "../../../common/components/form_elements/FormSelect";
import { FormFile } from "../../../common/components/form_elements/FormFile";
import NotificationRibbon from "../../../common/components/notification_ribbon/NotificationRibbon";
import {
  EditDirtyTracker,
  EditStepMapField,
  STEPS_CONSULT_TABS,
  StepsConsultMapField,
  useStepConsultData,
} from "./steps.data";
import "../../../common/components/map/map.style.css";
import "./index.style.css";

const STEP_TAB_BY_FIELD: Record<string, string> = {
  title: "Général",
  description: "Général",
  points: "Général",
  latitude: "Général",
  longitude: "Général",
  index_id: "Général",
  model_file: "Documents",
  image_file: "Documents",
};

function buildMissingTabsMessage(errors: any) {
  const missingTabs = new Set<string>();

  Object.keys(errors ?? {}).forEach((fieldName) => {
    const tabLabel = STEP_TAB_BY_FIELD[fieldName];
    if (tabLabel) {
      missingTabs.add(tabLabel);
    }
  });

  if (missingTabs.size === 0) {
    return "Veuillez renseigner les champs obligatoires.";
  }

  return `Veuillez renseigner les champs obligatoires dans les onglets : ${Array.from(missingTabs).join(", ")}`;
}

export default function StepConsultation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const isEditMode = location.pathname.endsWith("/edit");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeTabId, setActiveTabId] = useState("general");
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);
  const { step, isLoading, errorMessage, indexesForHunt, buildEditStepSubmitHandler } = useStepConsultData(id, location.pathname);

  const indexOptions = useMemo(
    () =>
      (indexesForHunt ?? [])
        .filter((index: any) => index.name)
        .map((index: any) => ({ label: index.name, value: index.id })),
    [indexesForHunt]
  );

  useEffect(() => {
    if (!isEditMode) {
      setHasUnsavedChanges(false);
      setNotificationMessage(null);
    }
  }, [isEditMode]);

  if (isLoading) {
    return (
      <div className="steps-consult-page">
        <Ribbon showSave={false} showEdit={false} />
        <div className="steps-consult-loading">Chargement...</div>
      </div>
    );
  }

  if (errorMessage || !step) {
    return (
      <div className="steps-consult-page">
        <Ribbon showSave={false} showEdit={false} />
        <div className="steps-consult-error">{errorMessage ?? "Étape introuvable."}</div>
      </div>
    );
  }

  const indexLabel = step.index.name
    ? `${step.index.index} - ${step.index.name}`
    : String(step.index.index);
  
  return (
    <div className={`steps-consult-page ${notificationMessage ? "has-notification-ribbon" : ""}`.trim()}>
      {notificationMessage ? (
        <NotificationRibbon
          message={notificationMessage}
          onClose={() => setNotificationMessage(null)}
        />
      ) : null}

      <Ribbon
        showSave={isEditMode && (activeTabId === "general" || activeTabId === "documents")}
        formId={isEditMode ? "edit-step-form" : undefined}
        showEdit={!isEditMode}
        onEdit={() => {
          if (id) {
            navigate(`/home/steps/${id}/edit`);
          }
        }}
      />

      <HeaderForm
        title={step.title}
        entityName="Étape"
        tabs={STEPS_CONSULT_TABS}
        activeTabId={activeTabId}
        onTabChange={setActiveTabId}
        creatorName={step.hunt.creator.username}
        creatorLabel="Créé par"
        creatorPlacement="right"
        saveState={isEditMode && hasUnsavedChanges ? "unsaved" : "saved"}
      />

      <section className="steps-consult-content">
        {isEditMode ? (
          <Form
            id="edit-step-form"
            onSubmit={buildEditStepSubmitHandler(() => {
              setNotificationMessage(null);
              if (id) {
                navigate(`/home/steps/${id}`);
              }
            })}
            onInvalid={(errors: any) => {
              setNotificationMessage(buildMissingTabsMessage(errors));
            }}
            defaultValues={{
              title: step.title,
              description: step.description,
              points: step.points,
              latitude: step.latitude ?? "",
              longitude: step.longitude ?? "",
              index_id: step.index.id,
              model_file: null,
              image_file: null,
            }}
            className={
              activeTabId === "documents"
                ? "steps-consult-general-layout steps-consult-general-layout--documents"
                : "steps-consult-general-layout"
            }
          >
            <EditDirtyTracker onDirtyChange={setHasUnsavedChanges} />

            <div className={activeTabId === "general" ? "steps-consult-info-panel" : "steps-consult-info-panel is-hidden"}>
              <p className="steps-consult-section-title">Informations de l'étape</p>

              <FormInput name="title" label="Titre" required={true} />
              <FormInput name="description" label="Description" required={true} />
              <FormInput name="points" label="Points" type="number" required={true} />
              <FormInput name="latitude" label="Latitude" type="number" required={false} />
              <FormInput name="longitude" label="Longitude" type="number" required={false} />
              <FormSelect name="index_id" label="Index" options={indexOptions} required={false} />
            </div>

            <div className={activeTabId === "general" ? "steps-consult-map-wrap" : "steps-consult-map-wrap is-hidden"}>
              <EditStepMapField />
            </div>

            <div className={activeTabId === "documents" ? "steps-consult-info-panel" : "steps-consult-info-panel is-hidden"}>
              <p className="steps-consult-section-title">Documents de l'étape</p>

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
          </Form>
        ) : (
          <>
            {activeTabId === "general" && (
            <div className="steps-consult-general-layout" id="step-consult-form">
              <div className="steps-consult-info-panel">
                <p className="steps-consult-section-title">Informations de l'étape</p>

                <ReadOnlyField label="Titre" value={step.title} />
                <ReadOnlyField label="Description" value={step.description} />
                <ReadOnlyField label="Points" value={String(step.points)} />
                <ReadOnlyField
                  label="Latitude"
                  value={step.latitude === null ? "-" : String(step.latitude)}
                />
                <ReadOnlyField
                  label="Longitude"
                  value={step.longitude === null ? "-" : String(step.longitude)}
                />
                <ReadOnlyField label="Chasse" value={step.hunt.title} />
                <ReadOnlyField label="Centre culturel" value={step.hunt.culturalCenter.name} />
                <ReadOnlyField label="Index" value={indexLabel} />
              </div>

              <StepsConsultMapField latitude={step.latitude} longitude={step.longitude} />
            </div>
            )}

            {activeTabId === "documents" && (
            <div className="steps-consult-documents-layout">
              <div className="steps-consult-info-panel">
                <p className="steps-consult-section-title">Documents de l'étape</p>

                <FormFile
                  name="model_file_readonly"
                  label="Modèle 3D (.obj)"
                  accept=".obj"
                  readOnly={true}
                  readOnlyValue="Aucun fichier chargé"
                />

                <FormFile
                  name="image_file_readonly"
                  label="Image (.png, .jpg)"
                  accept=".png,.jpg,.jpeg"
                  readOnly={true}
                  readOnlyValue="Aucun fichier chargé"
                />
              </div>
            </div>
            )}
          </>
        )}
      </section>
    </div>
  );
}
