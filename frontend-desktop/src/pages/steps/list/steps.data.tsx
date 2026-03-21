import { useEffect, useState } from "react";
import { deleteStep, getStepsByCulturalCenter } from "../../../api/services/step.api";


export function useStepsData() {
  const [steps, setSteps] = useState([]);
  const [selectedStepsRows, setSelectedStepsRows] = useState([]);
  const hasSelectedSteps = selectedStepsRows.length > 0;
  const hasSingleSelectedStep = selectedStepsRows.length === 1;
  const selectedStepId = hasSingleSelectedStep ? selectedStepsRows[0].id : undefined;
  const selectedStepIds = selectedStepsRows.map((row: any) => row.id);

  const stepsColumns = 
    [
        { key: "title", label: "Nom de l'étape" },
        { key: "description", label: "Description"},
    ]

  const fetchSteps = async () => {
    const stepsData = await getStepsByCulturalCenter();
    setSteps(stepsData ?? []);
  };

  useEffect(() => {
    fetchSteps();
  },[]);

  const deleteSelectedSteps = async () => {
    if (!selectedStepIds.length) return;

    await Promise.all(selectedStepIds.map((stepId: string) => deleteStep(stepId)));
    setSelectedStepsRows([]);
    await fetchSteps();
  };

  return {
    steps,
    stepsColumns,
    setSelectedStepsRows,
    hasSelectedSteps,
    hasSingleSelectedStep,
    selectedStepId,
    deleteSelectedSteps,
  }

}
