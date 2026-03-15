import { CreateHuntDto } from "../../../api/models/hunts/AddHuntDto";
import DynamicForm from "../../../common/components/dynamic_form/DynamicForm";
import TextInput from "../../../common/components/text_input/TextInput";
import Button from '../../../common/components/button/Button';
import { useHomeData } from "./hunts.data";
import { useState } from "react";
import { Form } from "../../../common/components/form_elements/Form";
import { FormInput } from "../../../common/components/form_elements/FormInput";
import { FormSelect } from "../../../common/components/form_elements/FormSelect";
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = { width: '100%', height: '400px' };
const center = { lat: 48.8584, lng: 2.2945 };

export default function HuntsCreation() {
  const {
    addHuntFields,
    handleAddHunt,
  } = useHomeData();

  // Google Maps API loader
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'AIzaSyCBC3gboWueiURoFHxsZbo87CqpBC8no2g',
  });

  const [resetHuntForm, setResetHuntForm] = useState(0);
  const [formState, setFormState] = useState({
    title: "",
    description: "",
    creator_id: "",
    difficulty_id: "",
    points: "",
    latitude: "",
    longitude: "",
    picture_path: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleMapClick = (e) => {
    setLocation({
      lat: e.latLng.lat(),
      lng: e.latLng.lng(),
    });
  };

  const [location, setLocation] = useState({ lat: '', lng: '' });

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
          Save
        </Button>
      </Form>

      <div>
        {isLoaded && (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={location.lat && location.lng ? { lat: parseFloat(location.lat), lng: parseFloat(location.lng) } : center}
            zoom={12}
            onClick={handleMapClick}
          >
            {location.lat && location.lng && (
              <Marker position={{ lat: parseFloat(location.lat), lng: parseFloat(location.lng) }} />
            )}
          </GoogleMap>
        )}
        <input value={location.lat} placeholder="Latitude" readOnly />
        <input value={location.lng} placeholder="Longitude" readOnly />
      </div>
    </>
  );
}

