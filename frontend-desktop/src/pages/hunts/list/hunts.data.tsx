import { useEffect, useState } from "react";
import { getHuntsByCulturalCenter } from "../../../api/services/hunt.api";
import { useNotificationStore } from "../../../common/store/notificationStore";


export function useHuntsData() {
  const [hunts, setHunts] = useState([]);
  const [selectedHuntsRows, setSelectedHuntsRows] = useState([]);
  const addNotification = useNotificationStore((state) => state.addNotification);

  const huntsColumns = 
    [
        { key: "title", label: "Nom de la chasse" },
        { key: "description", label: "Description"},
    ]

  useEffect(() => {
    const fetchHunts = async () => {
      const huntsData = await getHuntsByCulturalCenter();
      setHunts(huntsData);
    };
    fetchHunts();
  },[]);

  const getSelectedHuntsIds = () => selectedHuntsRows.map((row) => row.id);

  const handleModifyHunts = (): boolean => {
    const ids = getSelectedHuntsIds();

    if (ids.length === 0) {
      addNotification("Veuillez sélectionner au moins une chasse", undefined, 400);
      return false;
    }

    if (ids.length > 1) {
      addNotification("Veuillez sélectionner une seule chasse", undefined, 400);
      return false;
    }
    return true;
  };

  const handleDeleteHunts = (): boolean => {
    const ids = getSelectedHuntsIds();

    if (ids.length === 0) {
      addNotification("Veuillez sélectionner au moins une chasse", undefined, 400);
      return false;
    }
    return true;
  };

  return {
    hunts,
    huntsColumns,
    setSelectedHuntsRows,
    handleModifyHunts,
    handleDeleteHunts,
  }

}
