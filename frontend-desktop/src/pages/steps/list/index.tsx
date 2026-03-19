import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../../common/components/table/Table";
import "../../../common/components/table/Table.style.css";
import ConfirmModal from "../../../common/components/confirmmodal/ConfirmModal";
import { useStepsData } from "./steps.data";

const plusIcon = require("../../../common/assets/icon/plus.svg").default;
const deleteIcon = require("../../../common/assets/icon/close.svg").default;
const modifyIcon = require("../../../common/assets/icon/pen.svg").default;

export default function StepsList() {

  const {
    steps,
    stepsColumns,
    setSelectedStepsRows,
    handleModifySteps,
    handleDeleteSteps,
  } = useStepsData();

  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  return (
    <>
        <Table
          data={steps}
          columns={stepsColumns}
          onRowSelect={(rows) => setSelectedStepsRows(rows)}
          allItemsPrefix="Toutes les"
          allItemsLabel="étapes"
          renderActionButton={() => (
            <div className="table-action-buttons">
              <button 
              className="table-btn" 
              onClick={() => navigate("/home/steps/create")}
              >
                <img src={plusIcon} className="table-btn-icon-larger" alt="Plus" />
                <span>Créer</span>
              </button>
              <button 
              className="table-btn" 
              onClick={handleModifySteps}
              >
                <img src={modifyIcon} className="table-btn-icon-larger" alt="Modifier" />
                <span>Modifier</span>
              </button>
              <button 
              className="table-btn" 
              onClick={() => {
                if (handleDeleteSteps()) {
                  setIsDeleteModalOpen(true);
                }
              }}
              >
                <img src={deleteIcon} className="table-btn-icon" alt="Supprimer" />
                <span>Supprimer</span>
              </button>
            </div>
            )}
        />

        <ConfirmModal
          isOpen={isDeleteModalOpen}
          message="Etes vous sur de vouloir supprimer ces étapes ?"
          onCancel={() => setIsDeleteModalOpen(false)}
          onConfirm={() => {
            setIsDeleteModalOpen(false);
          }}
        />
    </>
  );
}