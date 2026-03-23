import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Table from "../../../common/components/table/Table";
import "../../../common/components/table/Table.style.css";
import ConfirmModal from "../../../common/components/confirmmodal/ConfirmModal";
import { useHuntsData } from "./hunts.data";
import { ReactComponent as PlusIcon } from "../../../common/assets/icon/plus.svg";
import { ReactComponent as DeleteIcon } from "../../../common/assets/icon/close.svg";
import { ReactComponent as ModifyIcon } from "../../../common/assets/icon/pen.svg";

export default function HuntsList() {
  const navigate = useNavigate();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    hunts,
    huntsColumns,
    setSelectedHuntsRows,
    hasSelectedHunts,
    hasSingleSelectedHunt,
    selectedHuntId,
    deleteSelectedHunts,
  } = useHuntsData();

  return (
    <>
      <Table
        data={hunts}
        columns={huntsColumns}
        onRowSelect={(rows) => setSelectedHuntsRows(rows)}
        allItemsPrefix="Toutes les"
        allItemsLabel="chasses"
        renderActionButton={() => (
          <div className="table-action-buttons">
            <button className="table-btn" onClick={() => navigate("/home/hunts/create")}>
              <PlusIcon className="table-btn-icon-larger" aria-hidden="true" focusable="false" />
              <span>Créer</span>
            </button>
            <button className="table-btn" disabled={!hasSingleSelectedHunt} onClick={() => {
              if (selectedHuntId) {
                navigate(`/home/hunts/${selectedHuntId}/edit`);
              }
            }}>
              <ModifyIcon className="table-btn-icon-larger" aria-hidden="true" focusable="false" />
              <span>Modifier</span>
            </button>
            <button className="table-btn" disabled={!hasSelectedHunts} onClick={() => {
              setIsDeleteModalOpen(true);
            }}>
              <DeleteIcon className="table-btn-icon" aria-hidden="true" focusable="false" />
              <span>Supprimer</span>
            </button>
          </div>
        )}
      />

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        message="Êtes-vous sûr de vouloir supprimer ces chasses ?"
        onCancel={() => {
          if (isDeleting) return;
          setIsDeleteModalOpen(false);
        }}
        onConfirm={async () => {
          if (isDeleting) return;

          setIsDeleting(true);
          await deleteSelectedHunts();
          setIsDeleting(false);
          setIsDeleteModalOpen(false);
        }}
        showWarning={true}
      />
    </>
  );
}
