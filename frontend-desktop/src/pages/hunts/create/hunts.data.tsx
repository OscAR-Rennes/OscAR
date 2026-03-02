import { useEffect, useMemo, useState } from "react";
import { getAllDifficulty } from "../../../api/services/difficulty.api";
import { addHunt } from "../../../api/services/hunt.api";
import { CreateHuntDto } from "../../../api/models/hunts/AddHuntDto";

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
    { name: "title", label: "Titre de la chasse", type: "text", required: true },
    { name: "description", label: "Description de la chasse", type: "text", required: true },
    { name: "points", label: "Points de la chasse", type: "number", required: true },
    { name: "latitude", label: "Latitude", type: "number", required: true },
    { name: "longitude", label: "Longitude", type: "number", required: true },
    { name: "picture_path", label: "Image", type: "text", required: false },
    {
      name: "difficulty_id",
      label: "Difficulté",
      type: "select",
      required: true,
      options: difficulties.map(d => ({ label: d.name, value: d.id }))
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
