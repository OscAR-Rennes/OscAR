import Ribbon from "../../../common/components/ribbon/ribbon";
import { MapCoordinatesField, useHomeData } from "./hunts.data";
import { Form } from "../../../common/components/form_elements/Form";
import { FormInput } from "../../../common/components/form_elements/FormInput";
import { FormSelect } from "../../../common/components/form_elements/FormSelect";
import "../../../common/components/map/map.style.css";
import "./index.style.css";

export default function HuntsCreation() {
  const { handleAddHunt, difficulties } = useHomeData();

  return (
    <div className="hunts-create-page">
      <Ribbon formId="create-hunt-form" />

      <Form
        id="create-hunt-form"
        onSubmit={async (data: any) => {
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
        <FormInput
          name="title"
          label="Title"
          required = {true}
        />

        <FormInput
          name="points"
          label="Points"
          type="number"
          required = {true}
        />
        <FormInput
          name="longitude"
          label="Longitude"
          type="number"
          required = {true}
        />
        <FormInput
          name="latitude"
          label="Latitude"
          type="number"
          required = {true}
        />

        <FormInput
          name="description"
          label="Description"
          required = {true}
        />

        <FormSelect
          name="difficulty_id"
          label="Difficulty"
          options={difficulties.map((d: any) => ({
            value: d.id,
            label: d.name,
          }))}
        />

        <MapCoordinatesField />
      </Form>
    </div>
  );
}

