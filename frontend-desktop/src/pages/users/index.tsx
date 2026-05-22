import { useState } from "react";
import { useLocation } from "react-router-dom";
import Table from "../../common/components/table/Table";
import ConfirmModal from "../../common/components/confirmmodal/ConfirmModal";
import { useUsersnData } from "./users.data";
import { ReactComponent as PowerIcon } from "../../common/assets/icon/power-button.svg";
import { ReactComponent as DeleteIcon } from "../../common/assets/icon/close.svg";
import "./index.style.css";

export default function Users() {
  const {
    isAdmin,
    isCulturalCenterManager,
    users,
    pagination,
    handlePaginationChange,
    setSelectedUsersRows,
    userColumns,
    hasSelectedUsers,
    executeActivateDeactivateUsers,
    handleSearchChange,
    handleSortChange,
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
            getRowLink={() => location.pathname}
            serverPagination={pagination}
            onServerPaginationChange={handlePaginationChange}
            onRowSelect={setSelectedUsersRows}
            allItemsLabel="utilisateurs"
            onFirstClick={false}
            externalSearch={true}
            onSearchChange={handleSearchChange}
            onSortChange={(key, direction) => handleSortChange(direction)}
            renderActionButton={() => (
              <div className="table-action-buttons">
                <button className="table-btn" disabled={!hasSelectedUsers} onClick={() => {
                  setIsSwitchStatusModalOpen(true);
                }}>
                  <PowerIcon className="table-btn-icon-bigger" aria-hidden="true" focusable="false" />
                  Désactiver / Réactiver
                </button>
              </div>
            )}
          />

          <ConfirmModal
            isOpen={isSwitchStatusModalOpen}
            message="Êtes-vous sûr de vouloir désactiver/réactiver ces utilisateurs ?"
            onCancel={() => setIsSwitchStatusModalOpen(false)}
            onConfirm={() => {
              executeActivateDeactivateUsers();
              setIsSwitchStatusModalOpen(false);
            }}
          />

          <ConfirmModal
            isOpen={isDeleteModalOpen}
            message="Êtes-vous sûr de vouloir supprimer ces utilisateurs ?"
            onCancel={() => setIsDeleteModalOpen(false)}
            onConfirm={() => {
              setIsDeleteModalOpen(false);
            }}
            showWarning={true}
          />
        </>
      )}

      {isCulturalCenterManager && !isAdmin && (
        <>
          <Table
            data={users}
            columns={userColumns}
            getRowLink={() => location.pathname}
            serverPagination={pagination}
            onServerPaginationChange={handlePaginationChange}
            onRowSelect={setSelectedUsersRows}
            allItemsLabel="créateurs de chasses"
            onFirstClick={false}
            externalSearch={true}
            onSearchChange={handleSearchChange}
            onSortChange={(key, direction) => handleSortChange(direction)}
            renderActionButton={() => (
              <div className="table-action-buttons">
                <button className="table-btn" disabled={!hasSelectedUsers} onClick={() => {
                  setIsSwitchStatusModalOpen(true);
                }}>
                  <PowerIcon className="table-btn-icon-bigger" aria-hidden="true" focusable="false" />
                  Désactiver / Réactiver
                </button>
              </div>
            )}
          />

          <ConfirmModal
            isOpen={isSwitchStatusModalOpen}
            message="Êtes-vous sûr de vouloir désactiver/réactiver ces créateurs ?"
            onCancel={() => setIsSwitchStatusModalOpen(false)}
            onConfirm={() => {
              executeActivateDeactivateUsers();
              setIsSwitchStatusModalOpen(false);
            }}
          />
        </>
      )}

      {!isAdmin && !isCulturalCenterManager && (
        <div className="users-empty-state">
          Cette page est réservée aux administrateurs.
        </div>
      )}
    </>
  );
}
