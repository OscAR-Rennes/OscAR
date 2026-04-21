import { useEffect, useState } from "react";
import { deleteHunt, getHuntsByCulturalCenter } from "../../../api/services/hunt.api";
import { useAuthStore } from "../../../common/store/authStore";


export function useHuntsData() {
  const [hunts, setHunts] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 1,
  });
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
    if (!user) return;

    const response = await getHuntsByCulturalCenter(
      user.id_cultural_center ?? "no-cultural-center",
      { page: pagination.page, limit: pagination.limit }
    );

    setHunts(Array.isArray(response?.data) ? response.data : []);

    setPagination((prev) => {
      const next = {
        page: response?.pagination?.page ?? prev.page,
        limit: response?.pagination?.limit ?? prev.limit,
        total: response?.pagination?.total ?? prev.total,
        totalPages: response?.pagination?.totalPages ?? prev.totalPages,
      };

      if (
        prev.page === next.page &&
        prev.limit === next.limit &&
        prev.total === next.total &&
        prev.totalPages === next.totalPages
      ) {
        return prev;
      }

      return next;
    });
  };

  useEffect(() => {
    fetchHunts();
  }, [user, pagination.page, pagination.limit]);

  const handlePaginationChange = ({ page, limit }: { page: number; limit: number }) => {
    setPagination((prev) => {
      if (prev.page === page && prev.limit === limit) {
        return prev;
      }

      return {
        ...prev,
        page,
        limit,
      };
    });
  };

  const deleteSelectedHunts = async () => {
    if (!selectedHuntIds.length) return;

    await deleteHunt(selectedHuntIds);
    setSelectedHuntsRows([]);
    await fetchHunts();
  };

  return {
    hunts,
    pagination,
    handlePaginationChange,
    huntsColumns,
    setSelectedHuntsRows,
    hasSelectedHunts,
    hasSingleSelectedHunt,
    selectedHuntId,
    deleteSelectedHunts,
  }

}
