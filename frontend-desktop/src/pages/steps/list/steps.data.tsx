import { useEffect, useState } from "react";
import { getStepsByCulturalCenter } from "../../../api/services/step.api";
import { useNavigate } from "react-router-dom";


export function useStepsData() {
  const [steps, setSteps] = useState([]);
  const [selectedStepsRows, setSelectedStepsRows] = useState([]);
  const navigate = useNavigate();

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
    selectedStepsRows,
    setSelectedStepsRows,
  }

}
