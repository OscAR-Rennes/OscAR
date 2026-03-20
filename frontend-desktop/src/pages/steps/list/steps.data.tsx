import { useEffect, useState } from "react";
import { getStepsByCulturalCenter } from "../../../api/services/step.api";


export function useStepsData() {
  const [steps, setSteps] = useState([]);
  const [selectedStepsRows, setSelectedStepsRows] = useState([]);
  const hasSelectedSteps = selectedStepsRows.length > 0;
  const hasSingleSelectedStep = selectedStepsRows.length === 1;
  const selectedStepId = hasSingleSelectedStep ? selectedStepsRows[0].id : undefined;

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

  return {
    steps,
    stepsColumns,
    setSelectedStepsRows,
    hasSelectedSteps,
    hasSingleSelectedStep,
    selectedStepId,
  }

}
