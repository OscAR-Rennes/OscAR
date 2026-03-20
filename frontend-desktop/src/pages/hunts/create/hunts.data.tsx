import { useEffect, useMemo, useState } from "react";
import { getAllDifficulty } from "../../../api/services/difficulty.api";
import { addHunt } from "../../../api/services/hunt.api";
import { CreateHuntDto } from "../../../api/models/hunts/AddHuntDto";
import TextInput from "../../../common/components/text_input/TextInput";
import MapPicker from "../../../common/components/map/map";
import { useFormContext } from "react-hook-form";

export function MapCoordinatesField() {
  const { setValue, watch } = useFormContext();
  const latitude = watch("latitude");
  const longitude = watch("longitude");

  const markerValue =
    latitude !== undefined &&
    latitude !== null &&
    latitude !== "" &&
    longitude !== undefined &&
    longitude !== null &&
    longitude !== ""
      ? {
          lat: Number(latitude),
          lng: Number(longitude),
        }
      : null;

  return (
    <div className="hunts-create-map-panel">
      <MapPicker
        value={markerValue}
        onChange={(coords: { lat: number; lng: number }) => {
          setValue("latitude", coords.lat, { shouldDirty: true, shouldValidate: true });
          setValue("longitude", coords.lng, { shouldDirty: true, shouldValidate: true });
        }}
      />
    </div>
  );
}

export function useHomeData() {
  const [difficulties, setDifficulties] = useState([]);
  const [hunts, setHunts] = useState([]);

  // Fetch difficulties + hunts au chargement
  useEffect(() => {
    const fetchData = async () => {
      const diff = await getAllDifficulty();
      setDifficulties(diff);
    };
    fetchData();
  }, []);


  // Champs des formulaires
  const addHuntFields = useMemo(() => [
    {
      name: "title",
      label: "Titre de la chasse",
      type: "text",
      required: true,
      render: (props) => (
        <TextInput {...props} placeholder="Entrez le titre de la chasse" />
      )
    },
    {
      name: "description",
      label: "Description de la chasse",
      type: "text",
      required: true,
      render: (props) => (
        <TextInput {...props} placeholder="Entrez la description de la chasse" />
      )
    },
    {
      name: "points",
      label: "Points de la chasse",
      type: "number",
      required: true,
      render: (props) => (
        <TextInput {...props} type="number" placeholder="Entrez le nombre de points" />
      )
    },
    {
      name: "latitude",
      label: "Latitude",
      type: "number",
      required: true,
      render: (props) => (
        <TextInput {...props} type="number" placeholder="Entrez la latitude" />
      )
    },
    {
      name: "longitude",
      label: "Longitude",
      type: "number",
      required: true,
      render: (props) => (
        <TextInput {...props} type="number" placeholder="Entrez la longitude" />
      )
    },
    {
      name: "picture_path",
      label: "Image",
      type: "text",
      required: false,
      render: (props) => (
        <TextInput {...props} placeholder="Entrez le chemin de l'image" />
      )
    },
    {
      name: "difficulty_id",
      label: "Difficulté",
      type: "select",
      required: true,
      options: difficulties.map(d => ({ label: d.name, value: d.id })),
      render: (props) => (
        <select {...props}>
          <option value="">Sélectionner la difficulté</option>
          {difficulties.map(d => (
            <option key={d.id} value={d.id}>{d.name}</option>
          ))}
        </select>
      )
    }
  ], [difficulties]);

  // Handlers
  const handleAddHunt = async (data: CreateHuntDto) => {
    const hunt =await addHunt(data);
    console.log("Chasse créée:", hunt);
  };


  return {
    difficulties,
    hunts,

    addHuntFields,

    handleAddHunt
  };
}
