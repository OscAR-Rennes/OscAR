import Ribbon from "../../../common/components/ribbon/ribbon";
import HeaderForm from "../../../common/components/header_form/HeaderForm";
import { Form } from "../../../common/components/form_elements/Form";
import { FormToogle } from "../../../common/components/form_elements/FormToogle";
import { ReadOnlyField } from "../../../common/components/form_elements/ReadOnlyField";
import Table from "../../../common/components/table/Table";
import MapPicker from "../../../common/components/map/map";
import { HUNTS_CONSULT_TABS, useHuntConsultData } from "./hunts.data";
import "../../../common/components/map/map.style.css";
import "./index.style.css";

export default function HuntConsultation() {
  const id = window.location.pathname.split("/").pop();

  const { hunt, steps, stepsColumns } = useHuntConsultData(id);

  if (!hunt) return <p>Chargement...</p>;

  return (
    <div className="hunts-consult-page">
      <Ribbon showSave={false} />

      <HeaderForm
        title={hunt.title}
        entityName="Chasse"
        tabs={HUNTS_CONSULT_TABS}
        activeTabId="general"
        onTabChange={() => {}}
        creatorName={hunt.creator.username}
        creatorLabel="Créé par"
        creatorPlacement="right"
        saveState="saved"
      />

      <section className="hunts-consult-content">
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
              <ReadOnlyField label="Créé par" value={hunt.creator.username} />
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
      </section>
    </div>
  );
}
