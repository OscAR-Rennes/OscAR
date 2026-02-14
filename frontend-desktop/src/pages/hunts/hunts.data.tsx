import { useEffect, useMemo, useState } from "react";
import { getAllDifficulty } from "../../api/services/difficulty.api";
import { addIndex, getAllIndexByHunt } from "../../api/services/index.api";
import { addHunt, getAllHunts } from "../../api/services/hunt.api";
import { addStep } from "../../api/services/step.api";
import { CreateHuntDto } from "../../api/models/hunts/AddHuntDto";
import { CreateIndexDto } from "../../api/models/index/AddIndexDto";
import { CreateStepDto } from "../../api/models/steps/AddStepDto";

export function useHomeData() {
  const [difficulties, setDifficulties] = useState([]);
  const [hunts, setHunts] = useState([]);
  const [selectedHuntId, setSelectedHuntId] = useState(null);
  const [indexesForHunt, setIndexesForHunt] = useState([]);

  // Fetch difficulties + hunts au chargement
  useEffect(() => {
    const fetchData = async () => {
      const diff = await getAllDifficulty();
      setDifficulties(diff);
      refreshHunts();
    };
    fetchData();
  }, []);

  // Fetch index quand une hunt est sélectionnée
  useEffect(() => {
    if (!selectedHuntId) return;

    const fetchIndexes = async () => {
      const idx = await getAllIndexByHunt(selectedHuntId);
      setIndexesForHunt(idx);
    };

    fetchIndexes();
  }, [selectedHuntId]);

  const refreshHunts = async () => {
    const huntsData = await getAllHunts();
    setHunts(huntsData);
  };

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

  const addStepFields = useMemo(() => [
    { name: "title", label: "Titre", type: "text", required: true },
    { name: "description", label: "Description", type: "text", required: true },
    { name: "points", label: "Points", type: "number", required: true },
    { name: "latitude", label: "Latitude", type: "number", required: false },
    { name: "longitude", label: "Longitude", type: "number", required: false },
    {
      name: "hunt_id",
      label: "Chasse",
      type: "select",
      required: true,
      options: hunts.map(h => ({ label: h.title, value: h.id }))
    },
    {
      name: "index_id",
      label: "Index",
      type: "select",
      required: false,
      options: indexesForHunt
        .filter(i => i.name)
        .map(i => ({ label: i.name, value: i.id }))
    }
  ], [hunts, indexesForHunt]);

  const addIndexFields = useMemo(() => [
    { name: "name", label: "Nom de l'index", type: "text", required: true },
    {
      name: "hunt_id",
      label: "Chasse",
      type: "select",
      required: true,
      options: hunts.map(h => ({ label: h.title, value: h.id }))
    }
  ], [hunts]);

  // Handlers
  const handleAddHunt = async (data: CreateHuntDto) => {
    const hunt =await addHunt(data);
    console.log("Chasse créée:", hunt);
    await refreshHunts();
  };

  const handleAddStep = async (data: CreateStepDto) => {
    const step = await addStep(data);
    console.log("Étape créée:", step);
  };

  const handleAddIndex = async (data: CreateIndexDto) => {
    const index = await addIndex(data);
    console.log("Index créé:", index);
  };

  return {
    difficulties,
    hunts,
    indexesForHunt,
    selectedHuntId,
    setSelectedHuntId,

    addHuntFields,
    addStepFields,
    addIndexFields,

    handleAddHunt,
    handleAddStep,
    handleAddIndex
  };
}