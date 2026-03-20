import { useState } from "react";
import Table from "../../common/components/table/Table";
import ConfirmModal from "../../common/components/confirmmodal/ConfirmModal";
import { useUsersnData } from "./users.data";
import { ReactComponent as PowerIcon } from "../../common/assets/icon/power-button.svg";
import { ReactComponent as DeleteIcon } from "../../common/assets/icon/close.svg";

export default function Users() {
  const {
    isAdmin,
    users,
    setSelectedUsersRows,
    userColumns,
    hasSelectedUsers,
    executeActivateDeactivateUsers,
  } = useUsersnData();

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isSwitchStatusModalOpen, setIsSwitchStatusModalOpen] = useState(false);

  return (
    <>
      {isAdmin && (
        <>
          <Table
            data={users}
            columns={userColumns}
            onRowSelect={setSelectedUsersRows}
            allItemsLabel="utilisateurs"
            renderActionButton={() => (
              <div className="table-action-buttons">
                <button className="table-btn" disabled={!hasSelectedUsers} onClick={() => {
                  setIsSwitchStatusModalOpen(true);
                }}>
                  <PowerIcon className="table-btn-icon-bigger" aria-hidden="true" focusable="false" />
                  Désactiver / Réactiver
                </button>
                <button className="table-btn" disabled={!hasSelectedUsers} onClick={() => {
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
            message="Etes vous sur de vouloir désactiver/réactiver ces utilisateurs ?"
            onCancel={() => setIsSwitchStatusModalOpen(false)}
            onConfirm={() => {
              executeActivateDeactivateUsers();
              setIsSwitchStatusModalOpen(false);
            }}
          />

          <ConfirmModal
            isOpen={isDeleteModalOpen}
            message="Etes vous sur de vouloir supprimer ces utilisateurs ?"
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
