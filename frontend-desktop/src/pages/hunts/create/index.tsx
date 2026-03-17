import Button from '../../../common/components/button/Button';
import { MapCoordinatesField, useHomeData } from "./hunts.data";
import { Form } from "../../../common/components/form_elements/Form";
import { FormInput } from "../../../common/components/form_elements/FormInput";
import { FormSelect } from "../../../common/components/form_elements/FormSelect";
import "../../../common/components/map/map.style.css";

export default function HuntsCreation() {
  useHomeData();

  return (
    <>
      <h1>Lootopia V0.0.1 - Hunts Creation</h1>

      {/* <section>
        <h2>Ajouter une chasse</h2>
        <form onSubmit={async (e) => {
          e.preventDefault();
          await handleAddHunt({
            ...formState,
            points: Number(formState.points),
            latitude: Number(formState.latitude),
            longitude: Number(formState.longitude),
          });
          setResetHuntForm((n) => n + 1);
        }}>
          {addHuntFields.map(field =>
            field.render
              ? field.render({
                  name: field.name,
                  value: formState[field.name],
                  onChange: (e) => {
                    const value = e.target.value;
                    setFormState(prev => ({ ...prev, [field.name]: value }));
                  },
                  required: field.required,
                  label: field.label
                })
              : null
          )}
          <Button type="submit">Envoyer</Button>
        </form>
      </section> */}

      <Form
        onSubmit={() => console.log("submit")}
        defaultValues={{
          title: "",
          points: 0,
          longitude: "",
          latitude: "",
          description: "",
        }}
      >
        <FormInput
          name="title"
          label="Title"
        />

        <FormInput
          name="points"
          label="Points"
          type="number"
        />
        <FormInput
          name="longitude"
          label="Longitude"
          type="number"
        />
        <FormInput
          name="latitude"
          label="Latitude"
          type="number"
        />

        <FormSelect
          name="difficultyId"
          label="Difficulty"
          options={[
            { value: "1", label: "Easy" },
            { value: "2", label: "Medium" },
            { value: "3", label: "Hard" },
          ]}
        />
        
        <Button type="submit">
          Sauvegarder
        </Button>

        <MapCoordinatesField />
      </Form>
    </>
  );
}

