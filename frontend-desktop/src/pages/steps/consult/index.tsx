import { useState } from "react";
import HeaderForm from "../../../common/components/header_form/HeaderForm";
import Ribbon from "../../../common/components/ribbon/ribbon";
import {
  STEPS_CONSULT_TABS,
  StepsConsultMapField,
  useStepConsultData,
} from "./steps.data";
import "../../../common/components/map/map.style.css";
import "./index.style.css";

export default function StepConsultation() {
  const { step, isLoading, errorMessage } = useStepConsultData();
  const [activeTabId, setActiveTabId] = useState("general");

  if (isLoading) {
    return (
      <div className="steps-consult-page">
        <Ribbon formId="step-consult-form" />
        <div className="steps-consult-loading">Chargement...</div>
      </div>
    );
  }

  if (errorMessage || !step) {
    return (
      <div className="steps-consult-page">
        <Ribbon formId="step-consult-form" />
        <div className="steps-consult-error">{errorMessage ?? "Étape introuvable."}</div>
      </div>
    );
  }

  const indexLabel = step.index.name
    ? `${step.index.index} - ${step.index.name}`
    : String(step.index.index);
  
  return (
    <div className="steps-consult-page">
      <Ribbon formId="step-consult-form" />

      <HeaderForm
        title={step.title}
        entityName="Étape"
        tabs={STEPS_CONSULT_TABS}
        activeTabId={activeTabId}
        onTabChange={setActiveTabId}
        creatorName={step.hunt.creator.username}
        creatorLabel="Créé par"
        creatorPlacement="right"
        saveState="saved"
      />

      <section className="steps-consult-content">
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
          <div className="steps-consult-placeholder">
            Aucun document à afficher pour le moment.
          </div>
        )}
      </section>
    </div>
  );
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="osc-form-item">
      <label className="osc-form-label">{label}</label>

      <div className="osc-form-control-row">
        <span className="osc-form-required is-hidden" aria-hidden="true">
          *
        </span>

        <input className="osc-form-control" value={value} readOnly />
      </div>
    </div>
  );
}