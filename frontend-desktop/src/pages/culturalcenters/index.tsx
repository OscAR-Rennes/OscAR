import { useState } from "react";
import Table from "../../common/components/table/Table";
import ConfirmModal from "../../common/components/confirmmodal/ConfirmModal";
import { useUsersnData } from "./culturalcenter.data";
import { ReactComponent as PowerIcon } from "../../common/assets/icon/power-button.svg";
import { ReactComponent as DeleteIcon } from "../../common/assets/icon/close.svg";

export default function CulturalCenters() {
  const {
    isAdmin,
    culturalCenters,
    setSelectedCulturalCenterssRows,
    culturalCentersColumns,
    hasSelectedCulturalCenters,
    executeActivateDeactivateCulturalCenters,
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
                <button className="table-btn" disabled={!hasSelectedCulturalCenters} onClick={() => {
                  setIsSwitchStatusModalOpen(true);
                }}>
                  <PowerIcon className="table-btn-icon-bigger" aria-hidden="true" focusable="false" />
                  Désactiver / Réactiver
                </button>
                <button className="table-btn" disabled={!hasSelectedCulturalCenters} onClick={() => {
                  setIsDeleteModalOpen(true);
                }}>
                  <DeleteIcon className="table-btn-icon" aria-hidden="true" focusable="false" />
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
