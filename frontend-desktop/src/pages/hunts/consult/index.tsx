import Ribbon from "../../../common/components/ribbon/ribbon";
import HeaderForm from "../../../common/components/header_form/HeaderForm";
import { Form } from "../../../common/components/form_elements/Form";
import { FormInput } from "../../../common/components/form_elements/FormInput";
import { FormSelect } from "../../../common/components/form_elements/FormSelect";
import { FormItem } from "../../../common/components/form_elements/Components/FormItem";
import { FormLabel } from "../../../common/components/form_elements/Components/FormLabel";
import Table from "../../../common/components/table/Table";
import MapPicker from "../../../common/components/map/map";
import { HUNTS_CONSULT_TABS, useHuntConsultData } from "./hunts.data";
import "../../../common/components/map/map.style.css";
import "./index.style.css";

export default function HuntConsultation() {
  const id = window.location.pathname.split("/").pop();

  const { hunt, steps, stepsColumns } = useHuntConsultData(id);

  if (!hunt) return <p>Loading...</p>;

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

              <Form
                key={hunt.id}
                onSubmit={async () => {}}
                defaultValues={{
                  title: hunt.title,
                  points: hunt.points,
                  longitude: hunt.longitude,
                  latitude: hunt.latitude,
                  description: hunt.description,
                  difficulty_id: hunt.difficulty.id,
                  picture_path: hunt.pictureUrl ?? "",
                  cultural_center: hunt.culturalCenter.name,
                  active: hunt.isActive ? "Oui" : "Non",
                  creator: hunt.creator.username,
                }}
                className="hunts-consult-form"
              >
                <FormInput name="title" label="Titre" readOnly={true} />
                <FormInput name="points" label="Points" type="number" readOnly={true} />
                <FormInput name="longitude" label="Longitude" type="number" readOnly={true} />
                <FormInput name="latitude" label="Latitude" type="number" readOnly={true} />
                <FormInput name="description" label="Description" readOnly={true} />

                <FormSelect
                  name="difficulty_id"
                  label="Difficultée"
                  required={false}
                  disabled={true}
                  options={[
                    {
                      value: hunt.difficulty.id,
                      label: hunt.difficulty.name,
                    },
                  ]}
                />

                <FormInput name="cultural_center" label="Centre culturel" readOnly={true} />
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <div className="osc-form-control-row">
                    <span className="osc-form-required is-hidden" aria-hidden="true">
                      *
                    </span>

                    <div className="osc-form-toggle-wrap">
                      <div
                        className={`osc-form-toggle ${hunt.isActive ? "osc-form-toggle--active" : ""}`.trim()}
                        role="switch"
                        aria-checked={hunt.isActive}
                        aria-label={hunt.isActive ? "Actif" : "Inactif"}
                        title={hunt.isActive ? "Actif" : "Inactif"}
                      >
                        <span className="osc-form-toggle-thumb" />
                      </div>
                      <span>{hunt.isActive ? "Actif" : "Inactif"}</span>
                    </div>
                  </div>
                </FormItem>
                <FormInput name="picture_path" label="URL de l'image" readOnly={true} />
                <FormInput name="creator" label="Crée par" readOnly={true} />
              </Form>
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