import { useState } from "react";
import Table from "../../common/components/table/Table";
import ConfirmModal from "../../common/components/confirmmodal/ConfirmModal";
import { useUsersnData } from "./users.data";

const powerIcon = require("../../common/assets/icon/power-button.svg").default;
const plusIcon = require("../../common/assets/icon/plus.svg").default;
const deleteIcon = require("../../common/assets/icon/close.svg").default;
const modifyIcon = require("../../common/assets/icon/pen.svg").default;

export default function Users() {
  const {
    isAdmin,
    users,
    setSelectedUsersRows,
    userColumns,
    validateActivateDeactivateUsers,
    executeActivateDeactivateUsers,
    handleModifyUsers,
    handleDeleteUsers,
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
                <button className="table-btn">
                  <img src={plusIcon} className="table-btn-icon-larger" alt="Plus" />
                  <span>Créer</span>
                </button>
                <button className="table-btn" onClick={() => {
                  if (validateActivateDeactivateUsers()) {
                    setIsSwitchStatusModalOpen(true);
                  }
                }}>
                  <img src={powerIcon} className="table-btn-icon-bigger" alt="Activer / Désactiver" />
                  Désactiver / Réactiver
                </button>
                <button className="table-btn" onClick={handleModifyUsers}>
                  <img src={modifyIcon} className="table-btn-icon-larger" alt="Modifier" />
                  <span>Modifier</span>
                </button>
                <button className="table-btn" onClick={() => {
                  if (handleDeleteUsers()) {
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
