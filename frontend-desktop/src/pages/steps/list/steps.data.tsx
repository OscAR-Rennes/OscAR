import { useEffect, useState } from "react";
import { getStepsByCulturalCenter } from "../../../api/services/step.api";
import { useNotificationStore } from "../../../common/store/notificationStore";


export function useStepsData() {
  const [steps, setSteps] = useState([]);
  const [selectedStepsRows, setSelectedStepsRows] = useState([]);
  const addNotification = useNotificationStore((state) => state.addNotification);

  const stepsColumns = 
    [
        { key: "title", label: "Nom de l'étape" },
        { key: "description", label: "Description"},
    ]

  useEffect(() => {
    const fetchSteps = async () => {
      const stepsData = await getStepsByCulturalCenter();
      setSteps(stepsData);
    };
    fetchSteps();
  },[]);

  const getSelectedStepsIds = () => selectedStepsRows.map((row) => row.id);

  const handleModifySteps = (): boolean => {
    const ids = getSelectedStepsIds();

    if (ids.length === 0) {
      addNotification("Veuillez sélectionner au moins une étape", undefined, 400);
      return false;
    }

    if (ids.length > 1) {
      addNotification("Veuillez sélectionner une seule étape", undefined, 400);
      return false;
    }
    return true;
  };

  const handleDeleteSteps = (): boolean => {
    const ids = getSelectedStepsIds();

    if (ids.length === 0) {
      addNotification("Veuillez sélectionner au moins une étape", undefined, 400);
      return false;
    }
    return true;
  };

  return {
    steps,
    stepsColumns,
    selectedStepsRows,
    setSelectedStepsRows,
    handleModifySteps,
    handleDeleteSteps,
  }

}
