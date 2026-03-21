import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Ribbon from "../../../common/components/ribbon/ribbon";
import HeaderForm from "../../../common/components/header_form/HeaderForm";
import { Form } from "../../../common/components/form_elements/Form";
import { FormInput } from "../../../common/components/form_elements/FormInput";
import { FormSelect } from "../../../common/components/form_elements/FormSelect";
import { FormToogle } from "../../../common/components/form_elements/FormToogle";
import { ReadOnlyField } from "../../../common/components/form_elements/ReadOnlyField";
import Table from "../../../common/components/table/Table";
import MapPicker from "../../../common/components/map/map";
import {
  EditDirtyTracker,
  EditHuntMapField,
  HUNTS_CONSULT_TABS,
  useHuntConsultData,
} from "./hunts.data";
import "../../../common/components/map/map.style.css";
import "./index.style.css";

export default function HuntConsultation() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const isEditMode = location.pathname.endsWith("/edit");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const { hunt, difficulties, steps, stepsColumns, buildEditHuntSubmitHandler } = useHuntConsultData(id, location.pathname);

  useEffect(() => {
    if (!isEditMode) {
      setHasUnsavedChanges(false);
    }
  }, [isEditMode]);

  if (!hunt) return <p>Chargement...</p>;

  return (
    <div className="hunts-consult-page">
      <Ribbon
        showSave={isEditMode}
        formId={isEditMode ? "edit-hunt-form" : undefined}
        showEdit={!isEditMode}
        onEdit={() => {
          if (id) {
            navigate(`/home/hunts/${id}/edit`);
          }
        }}
      />

      <HeaderForm
        title={hunt.title}
        entityName="Chasse"
        tabs={HUNTS_CONSULT_TABS}
        activeTabId="general"
        onTabChange={() => {}}
        creatorName={hunt.creator.username}
        creatorLabel="Créé par"
        creatorPlacement="right"
        saveState={isEditMode && hasUnsavedChanges ? "unsaved" : "saved"}
      />

      <section className="hunts-consult-content">
        {isEditMode ? (
          <Form
            id="edit-hunt-form"
            onSubmit={buildEditHuntSubmitHandler(() => {
              if (id) {
                navigate(`/home/hunts/${id}`);
              }
            })}
            defaultValues={{
              title: hunt.title,
              points: hunt.points,
              longitude: hunt.longitude,
              latitude: hunt.latitude,
              description: hunt.description,
              difficulty_id: hunt.difficulty.id,
              picture_path: hunt.pictureUrl ?? "",
              active: hunt.isActive,
            }}
            className="hunts-consult-edit-form"
          >
            <div className="hunts-consult-left-column">
              <div className="hunts-consult-fields-card">
                <p className="hunts-consult-section-title">Informations de la chasse</p>

                <EditDirtyTracker onDirtyChange={setHasUnsavedChanges} />

                <FormInput name="title" label="Titre" required={true} />
                <FormInput name="points" label="Points" type="number" required={true} />
                <FormInput name="longitude" label="Longitude" type="number" required={true} />
                <FormInput name="latitude" label="Latitude" type="number" required={true} />
                <FormInput name="description" label="Description" required={true} />
                <FormSelect
                  name="difficulty_id"
                  label="Difficulté"
                  required={true}
                  options={difficulties.map((d: any) => ({
                    value: d.id,
                    label: d.name,
                  }))}
                />
                <FormToogle
                  name="active"
                  label="Statut"
                  activeLabel="Actif"
                  inactiveLabel="Inactif"
                />
                <FormInput name="picture_path" label="URL de l'image" required={false} />
              </div>

              <div className="consult-steps-table">
                <Table
                  data={steps}
                  columns={stepsColumns}
                  displayMode="subgrid"
                  allItemsLabel="étapes"
                  allItemsPrefix="Toutes les"
                  getRowLink={(row) => `/home/steps/${row.id}`}
                />
              </div>
            </div>

            <div className="hunts-consult-map-panel">
              <EditHuntMapField />
            </div>
          </Form>
        ) : (
          <div className="hunts-consult-layout">
            <div className="hunts-consult-left-column">
              <div className="hunts-consult-fields-card">
                <p className="hunts-consult-section-title">Informations de la chasse</p>

                <ReadOnlyField label="Titre" value={hunt.title} />
                <ReadOnlyField label="Points" value={String(hunt.points)} />
                <ReadOnlyField label="Longitude" value={String(hunt.longitude)} />
                <ReadOnlyField label="Latitude" value={String(hunt.latitude)} />
                <ReadOnlyField label="Description" value={hunt.description} />
                <ReadOnlyField label="Difficulté" value={hunt.difficulty.name} />
                <ReadOnlyField label="Centre culturel" value={hunt.culturalCenter.name} />
                <Form
                  onSubmit={async () => {}}
                  defaultValues={{
                    active: hunt.isActive,
                  }}
                  className="hunts-consult-form"
                >
                  <FormToogle
                    name="active"
                    label="Statut"
                    readOnly={true}
                    activeLabel="Actif"
                    inactiveLabel="Inactif"
                  />
                </Form>
                <ReadOnlyField label="URL de l'image" value={hunt.pictureUrl ?? "-"} />
              </div>

              <div className="consult-steps-table">
                <Table
                  data={steps}
                  columns={stepsColumns}
                  displayMode="subgrid"
                  allItemsLabel="étapes"
                  allItemsPrefix="Toutes les"
                  getRowLink={(row) => `/home/steps/${row.id}`}
                />
              </div>
            </div>

            <div className="hunts-consult-map-panel">
              <MapPicker
                readOnly={true}
                value={{ lat: Number(hunt.latitude), lng: Number(hunt.longitude) }}
              />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
