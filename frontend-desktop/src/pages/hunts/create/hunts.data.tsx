import { useEffect, useMemo, useState } from "react";
import { getAllDifficulty } from "../../../api/services/difficulty.api";
import { addHunt } from "../../../api/services/hunt.api";
import { CreateHuntDto } from "../../../api/models/hunts/AddHuntDto";
import TextInput from "../../../common/components/text_input/TextInput";
import MapPicker from "../../../common/components/map/map";
import { useFormContext } from "react-hook-form";
import { useNavigate } from "react-router-dom";


export const HUNTS_CREATE_TABS = [{ id: "general", label: "Général" }];

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
  const navigate = useNavigate();
  const [difficulties, setDifficulties] = useState([]);
  const [hunts, setHunts] = useState([]);

  // Fetch difficulties + hunts au chargement
  useEffect(() => {
    const fetchData = async () => {
      const diff = await getAllDifficulty();
      setDifficulties(diff.data);
    };
    fetchData();
  }, []);

  // Handlers
  const handleAddHunt = async (data: CreateHuntDto) => {
    const hunt =await addHunt(data);
    console.log("Chasse créée:", hunt);
    navigate('/home/hunts');
  };


  return {
    difficulties,
    hunts,

    handleAddHunt
  };
}
