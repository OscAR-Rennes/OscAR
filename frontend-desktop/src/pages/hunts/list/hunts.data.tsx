import { useEffect, useState } from "react";
import { getStepsByCulturalCenter } from "../../../api/services/step.api";
import { useNavigate } from "react-router-dom";
import { getHuntsByCulturalCenter } from "../../../api/services/hunt.api";


export function useHuntsData() {
  const [hunts, setHunts] = useState([]);
  const [selectedHuntsRows, setSelectedHuntsRows] = useState([]);

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

  return {
    hunts,
    huntsColumns,
    setSelectedHuntsRows,
  }

}
