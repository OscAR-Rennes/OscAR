import { useEffect, useState } from "react";
import { getHuntsByCulturalCenter } from "../../../api/services/hunt.api";


export function useHuntsData() {
  const [hunts, setHunts] = useState([]);
  const [selectedHuntsRows, setSelectedHuntsRows] = useState([]);
  const hasSelectedHunts = selectedHuntsRows.length > 0;
  const hasSingleSelectedHunt = selectedHuntsRows.length === 1;
  const selectedHuntId = hasSingleSelectedHunt ? selectedHuntsRows[0].id : undefined;

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
    hasSelectedHunts,
    hasSingleSelectedHunt,
    selectedHuntId,
  }

}
