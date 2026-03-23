import { useEffect, useMemo, useState } from "react";
import { addIndex, getAllIndexByHunt } from "../../../api/services/index.api";
import { getHuntsByCulturalCenter } from "../../../api/services/hunt.api";
import { addStep } from "../../../api/services/step.api";
import { CreateIndexDto } from "../../../api/models/index/AddIndexDto";
import { CreateStepDto } from "../../../api/models/steps/AddStepDto";
import { useAuthStore } from "../../../common/store/authStore";
import MapPicker from "../../../common/components/map/map";
import { useFormContext } from "react-hook-form";

export const STEPS_CREATE_TABS = [
  { id: "general", label: "Général" },
  { id: "documents", label: "Documents" },
  { id: "index", label: "Index" },
];

export function HuntSelectionSync({
  onHuntChange,
}: {
  onHuntChange: (huntId: string | null) => void;
}) {
  const { watch } = useFormContext();
  const huntId = watch("hunt_id");

  useEffect(() => {
    if (huntId === undefined || huntId === null || huntId === "") {
      onHuntChange(null);
      return;
    }

    onHuntChange(String(huntId));
  }, [huntId, onHuntChange]);

  return null;
}

export function StepsMapField() {
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
    <div className="steps-create-map-panel">
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

export function useStepsData() {
  const [hunts, setHunts] = useState([]);
  const [selectedHuntId, setSelectedHuntId] = useState(null);
  const [indexesForHunt, setIndexesForHunt] = useState([]);
  const user = useAuthStore((state) => state.user);

  // Fetch difficulties + hunts au chargement
  useEffect(() => {
    const fetchData = async () => {
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
    const response = await getHuntsByCulturalCenter(user.id_cultural_center, { page: 1, limit: 200 });
    setHunts(Array.isArray(response?.data) ? response.data : []);
  };

  // Champs des formulaires

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

  const handleAddStep = async (data: CreateStepDto) => {
    const step = await addStep(data);
    console.log("Étape créée:", step);
  };

  const handleAddIndex = async (data: CreateIndexDto) => {
    const index = await addIndex(data);
    console.log("Index créé:", index);
  };

  return {
    hunts,
    indexesForHunt,
    selectedHuntId,
    setSelectedHuntId,

    addStepFields,
    addIndexFields,

    handleAddStep,
    handleAddIndex
  };
}