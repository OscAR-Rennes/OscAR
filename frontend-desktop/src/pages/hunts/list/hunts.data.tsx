import { useEffect, useState } from "react";
import { deleteHunt, getHuntsByCulturalCenter } from "../../../api/services/hunt.api";
import { useAuthStore } from "../../../common/store/authStore";


export function useHuntsData() {
  const [hunts, setHunts] = useState([]);
  const [selectedHuntsRows, setSelectedHuntsRows] = useState([]);
  const user = useAuthStore((state) => state.user);
  const hasSelectedHunts = selectedHuntsRows.length > 0;
  const hasSingleSelectedHunt = selectedHuntsRows.length === 1;
  const selectedHuntId = hasSingleSelectedHunt ? selectedHuntsRows[0].id : undefined;
  const selectedHuntIds = selectedHuntsRows.map((row: any) => row.id);

  const huntsColumns = 
    [
        { key: "title", label: "Nom de la chasse" },
        { key: "description", label: "Description"},
    ]

  const fetchHunts = async () => {
    const huntsData = await getHuntsByCulturalCenter(user.id_cultural_center ?? "no-cultural-center");
    setHunts(huntsData ?? []);
  };

  useEffect(() => {
    fetchHunts();
  },[user]);

  const deleteSelectedHunts = async () => {
    if (!selectedHuntIds.length) return;

    await Promise.all(selectedHuntIds.map((huntId: string) => deleteHunt(huntId)));
    setSelectedHuntsRows([]);
    await fetchHunts();
  };

  return {
    hunts,
    huntsColumns,
    setSelectedHuntsRows,
    hasSelectedHunts,
    hasSingleSelectedHunt,
    selectedHuntId,
    deleteSelectedHunts,
  }

}
