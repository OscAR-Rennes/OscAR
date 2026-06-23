import Ribbon from "../../../common/components/ribbon/ribbon";
import { HUNTS_CREATE_TABS, MapCoordinatesField, useHomeData } from "./hunts.data";
import { Form } from "../../../common/components/form_elements/Form";
import { FormInput } from "../../../common/components/form_elements/FormInput";
import { FormSelect } from "../../../common/components/form_elements/FormSelect";
import HeaderForm from "../../../common/components/header_form/HeaderForm";
import { useAuthStore } from "../../../common/store/authStore";
import { useState } from "react";
import NotificationRibbon from "../../../common/components/notification_ribbon/NotificationRibbon";
import "../../../common/components/map/map.style.css";
import "./index.style.css";

const HUNT_TAB_BY_FIELD: Record<string, string> = {
  title: "Général",
  points: "Général",
  longitude: "Général",
  latitude: "Général",
  description: "Général",
  difficulty_id: "Général",
};

function buildMissingTabsMessage(errors: any) {
  const missingTabs = new Set<string>();

  Object.keys(errors ?? {}).forEach((fieldName) => {
    const tabLabel = HUNT_TAB_BY_FIELD[fieldName];
    if (tabLabel) {
      missingTabs.add(tabLabel);
    }
  });

  if (missingTabs.size === 0) {
    return "Veuillez renseigner les champs obligatoires.";
  }

  return `Veuillez renseigner les champs obligatoires dans les onglets : ${Array.from(missingTabs).join(", ")}`;
}

export default function HuntsCreation() {
  const { handleAddHunt, difficulties } = useHomeData();
  const connectedUserName = useAuthStore((state) => state.user?.username);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(null);

  return (
    <div className={`hunts-create-page ${notificationMessage ? "has-notification-ribbon" : ""}`.trim()}>
      {notificationMessage ? (
        <NotificationRibbon
          message={notificationMessage}
          onClose={() => setNotificationMessage(null)}
        />
      ) : null}

      <Ribbon formId="create-hunt-form" />

      <HeaderForm
        title="Nouvelle chasse"
        entityName="Chasse"
        tabs={HUNTS_CREATE_TABS}
        activeTabId="general"
        onTabChange={() => {}}
        creatorName={connectedUserName}
        creatorLabel="Créé par"
        creatorPlacement="right"
      />

      <section className="hunts-create-content">
        <div className="hunts-create-general-layout">
          <Form
            id="create-hunt-form"
            className="hunts-create-form"
            onSubmit={async (data: any) => {
              setNotificationMessage(null);

              await handleAddHunt({
                title: data.title,
                description: data.description,
                points: Number(data.points),
                latitude: Number(data.latitude),
                longitude: Number(data.longitude),
                difficulty_id: String(data.difficulty_id),
                creator_id: "",
                picture_path: data.picture_path ?? "",
              });
            }}
            onInvalid={(errors: any) => {
              setNotificationMessage(buildMissingTabsMessage(errors));
            }}
            defaultValues={{
              title: "",
              points: 0,
              longitude: "",
              latitude: "",
              description: "",
              difficulty_id: "",
              picture_path: "",
            }}
          >
            <div className="hunts-create-form-left">
              <p className="hunts-create-section-title">Informations de la chasse</p>

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
            </div>

            <MapCoordinatesField />
          </Form>
        </div>
      </section>
    </div>
  );
}

