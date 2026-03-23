import { useEffect, useState } from "react";
import { deleteStep, getStepsByCulturalCenter } from "../../../api/services/step.api";


export function useStepsData() {
  const [steps, setSteps] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 15,
    total: 0,
    totalPages: 1,
  });
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
    const response = await getStepsByCulturalCenter({
      page: pagination.page,
      limit: pagination.limit,
    });

    setSteps(Array.isArray(response?.data) ? response.data : []);

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
    fetchSteps();
  }, [pagination.page, pagination.limit]);

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

  const deleteSelectedSteps = async () => {
    if (!selectedStepIds.length) return;

    await Promise.all(selectedStepIds.map((stepId: string) => deleteStep(stepId)));
    setSelectedStepsRows([]);
    await fetchSteps();
  };

  return {
    steps,
    pagination,
    handlePaginationChange,
    stepsColumns,
    setSelectedStepsRows,
    hasSelectedSteps,
    hasSingleSelectedStep,
    selectedStepId,
    deleteSelectedSteps,
  }

}
