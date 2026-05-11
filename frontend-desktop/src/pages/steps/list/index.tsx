import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../../common/components/table/Table";
import "../../../common/components/table/Table.style.css";
import ConfirmModal from "../../../common/components/confirmmodal/ConfirmModal";
import { useStepsData } from "./steps.data";
import { ReactComponent as PlusIcon } from "../../../common/assets/icon/plus.svg";
import { ReactComponent as DeleteIcon } from "../../../common/assets/icon/close.svg";
import { ReactComponent as ModifyIcon } from "../../../common/assets/icon/pen.svg";

export default function StepsList() {

  const {
    steps,
    pagination,
    handlePaginationChange,
    stepsColumns,
    setSelectedStepsRows,
    hasSelectedSteps,
    hasSingleSelectedStep,
    selectedStepId,
    deleteSelectedSteps,
    handleSearchChange,
    handleSortChange,
  } = useStepsData();

  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <>
        <Table
          data={steps}
          columns={stepsColumns}
          serverPagination={pagination}
          onServerPaginationChange={handlePaginationChange}
          onRowSelect={(rows) => setSelectedStepsRows(rows)}
          externalSearch={true}
          onSearchChange={handleSearchChange}
          onSortChange={(key, direction) => handleSortChange(direction)}
          allItemsPrefix="Toutes les"
          allItemsLabel="étapes"
          renderActionButton={() => (
            <div className="table-action-buttons">
              <button 
              className="table-btn" 
              onClick={() => {
                navigate("/home/steps/create");
              }}
              >
                <PlusIcon className="table-btn-icon-larger" aria-hidden="true" focusable="false" />
                <span>Créer</span>
              </button>
              <button 
              className="table-btn" 
              disabled={!hasSingleSelectedStep}
              onClick={() => {
                if (selectedStepId) {
                  navigate(`/home/steps/${selectedStepId}/edit`);
                }
              }}
              >
                <ModifyIcon className="table-btn-icon-larger" aria-hidden="true" focusable="false" />
                <span>Modifier</span>
              </button>
              <button 
              className="table-btn" 
              disabled={!hasSelectedSteps}
              onClick={() => {
                setIsDeleteModalOpen(true);
              }}
              >
                <DeleteIcon className="table-btn-icon" aria-hidden="true" focusable="false" />
                <span>Supprimer</span>
              </button>
            </div>
            )}
        />

        <ConfirmModal
          isOpen={isDeleteModalOpen}
          message="Êtes-vous sûr de vouloir supprimer ces étapes ?"
          onCancel={() => {
            if (isDeleting) return;
            setIsDeleteModalOpen(false);
          }}
          onConfirm={async () => {
            if (isDeleting) return;

            setIsDeleting(true);
            await deleteSelectedSteps();
            setIsDeleting(false);
            setIsDeleteModalOpen(false);
          }}
          showWarning={true}
        />
    </>
  );
}