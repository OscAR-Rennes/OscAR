import { useState } from "react";
import Table from "../../common/components/table/Table";
import ConfirmModal from "../../common/components/confirmmodal/ConfirmModal";
import { useUsersnData } from "./culturalcenter.data";

const powerIcon = require("../../common/assets/icon/power-button.svg").default;
const plusIcon = require("../../common/assets/icon/plus.svg").default;
const deleteIcon = require("../../common/assets/icon/close.svg").default;
const modifyIcon = require("../../common/assets/icon/pen.svg").default;

export default function CulturalCenters() {
  const {
    isAdmin,
    culturalCenters,
    setSelectedCulturalCenterssRows,
    culturalCentersColumns,
    validateActivateDeactivateCulturalCenters,
    executeActivateDeactivateCulturalCenters,
    handleModifyCulturalCenters,
    handleDeleteCulturalCenters,
  } = useUsersnData();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSwitchStatusModalOpen, setIsSwitchStatusModalOpen] = useState(false);

  return (
    <>
      {isAdmin && (
        <>
          <Table
            data={culturalCenters}
            columns={culturalCentersColumns}
            onRowSelect={(rows) => setSelectedCulturalCenterssRows(rows)}
            allItemsLabel="centres culturels"
            renderActionButton={() => (
              <div className="table-action-buttons">
                <button className="table-btn">
                  <img src={plusIcon} className="table-btn-icon-larger" alt="Plus" />
                  <span>Créer</span>
                </button>
                <button className="table-btn" onClick={() => {
                  if (validateActivateDeactivateCulturalCenters()) {
                    setIsSwitchStatusModalOpen(true);
                  }
                }}>
                  <img src={powerIcon} className="table-btn-icon-bigger" alt="Activer / Désactiver" />
                  Désactiver / Réactiver
                </button>
                <button className="table-btn" onClick={handleModifyCulturalCenters}>
                  <img src={modifyIcon} className="table-btn-icon-larger" alt="Modifier" />
                  <span>Modifier</span>
                </button>
                <button className="table-btn" onClick={() => {
                  if (handleDeleteCulturalCenters()) {
                    setIsDeleteModalOpen(true);
                  }
                }}>
                  <img src={deleteIcon} className="table-btn-icon" alt="Supprimer" />
                  <span>Supprimer</span>
                </button>
              </div>
            )}
          />

          <ConfirmModal
            isOpen={isSwitchStatusModalOpen}
            message="Etes vous sur de vouloir désactiver/réactiver ces centres culturels ?"
            onCancel={() => setIsSwitchStatusModalOpen(false)}
            onConfirm={() => {
              executeActivateDeactivateCulturalCenters();
              setIsSwitchStatusModalOpen(false);
            }}
          />

          <ConfirmModal
            isOpen={isDeleteModalOpen}
            message="Etes vous sur de vouloir supprimer ces centres culturels ?"
            onCancel={() => setIsDeleteModalOpen(false)}
            onConfirm={() => {
              setIsDeleteModalOpen(false);
            }}
          />
        </>
      )}
    </>
  );
}
