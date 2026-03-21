import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import HeaderForm from "../../../common/components/header_form/HeaderForm";
import { ReadOnlyField } from "../../../common/components/form_elements/ReadOnlyField";
import Ribbon from "../../../common/components/ribbon/ribbon";
import { Form } from "../../../common/components/form_elements/Form";
import { FormInput } from "../../../common/components/form_elements/FormInput";
import { FormSelect } from "../../../common/components/form_elements/FormSelect";
import { editStep } from "../../../api/services/step.api";
import {
  EditDirtyTracker,
  EditStepMapField,
  STEPS_CONSULT_TABS,
  StepsConsultMapField,
  useStepConsultData,
} from "./steps.data";
import "../../../common/components/map/map.style.css";
import "./index.style.css";

export default function StepConsultation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const isEditMode = location.pathname.endsWith("/edit");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [activeTabId, setActiveTabId] = useState("general");
  const { step, isLoading, errorMessage, indexesForHunt } = useStepConsultData(id, location.pathname);

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
    <div className="steps-consult-page">
      <Ribbon
        showSave={isEditMode && activeTabId === "general"}
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
        {activeTabId === "general" && (
          isEditMode ? (
            <Form
              id="edit-step-form"
              onSubmit={async (data: any) => {
                if (!id) return;

                const toNullableNumber = (value: any) =>
                  value === "" || value === null || value === undefined ? null : Number(value);

                const updated = await editStep(id, {
                  title: data.title,
                  description: data.description,
                  points: Number(data.points),
                  latitude: toNullableNumber(data.latitude),
                  longitude: toNullableNumber(data.longitude),
                  index_id: data.index_id || undefined,
                });

                if (updated) {
                  navigate(`/home/steps/${id}`);
                }
              }}
              defaultValues={{
                title: step.title,
                description: step.description,
                points: step.points,
                latitude: step.latitude ?? "",
                longitude: step.longitude ?? "",
                index_id: step.index.id,
              }}
              className="steps-consult-general-layout"
            >
              <div className="steps-consult-info-panel">
                <p className="steps-consult-section-title">Informations de l'étape</p>

                <EditDirtyTracker onDirtyChange={setHasUnsavedChanges} />

                <FormInput name="title" label="Titre" required={true} />
                <FormInput name="description" label="Description" required={true} />
                <FormInput name="points" label="Points" type="number" required={true} />
                <FormInput name="latitude" label="Latitude" type="number" required={false} />
                <FormInput name="longitude" label="Longitude" type="number" required={false} />
                <FormSelect name="index_id" label="Index" options={indexOptions} required={false} />
              </div>

              <EditStepMapField />
            </Form>
          ) : (
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
          )
        )}

        {activeTabId === "documents" && (
          <div className="steps-consult-placeholder">
            Aucun document à afficher pour le moment.
          </div>
        )}
      </section>
    </div>
  );
}
