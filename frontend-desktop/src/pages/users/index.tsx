import { useEffect, useState } from "react";
import Table from "../../common/components/table/Table";
import { RoleEnum } from "../../common/enum/RolesEnum";
import { useCheckRights } from "../../common/components/security/CheckRights";
import { useAuthStore } from "../../common/store/authStore";
import { activateDeactivateUsers, getAllUsers, getUsersByCulturalCenter } from "../../api/services/users.api";
import { activateDeactivateCulturalCenter, getAllCulturalCenters } from "../../api/services/culturalcenter.api";
import { useUsersnData } from "./users.data";


export default function Users() {

  const {
    isAdmin,
    users,
    culturalCenters,
    setSelectedUsersRows,
    setSelectedCulturalCenterssRows,
    userColumns,
    culturalCentersColumns,
    handleActivateDeactivateCulturalCenters,
    handleActivateDeactivateUsers
  } = useUsersnData();

  return (
    <>
      <h1>Lootopia V0.0.1 - Users management</h1>

      { isAdmin && (
        <>
          <h2>
            {isAdmin
              ? "Table des utilisateurs"
              : "Table des utilisateurs du centre culturel"}
          </h2>          
          <button
            onClick={handleActivateDeactivateUsers}
          >
            Désactiver / Réactiver
          </button>
          <Table
            data={users}
            columns={userColumns}
            onRowSelect={(rows) => setSelectedUsersRows(rows)}
          />
        </>
      )}

      { isAdmin && (
        <>
          <h2>Table centre culturels</h2>
          <button
            onClick={handleActivateDeactivateCulturalCenters}
          >
            Désactiver / Réactiver
          </button>
          <Table
            data={culturalCenters}
            columns={culturalCentersColumns}
            onRowSelect={(rows) => setSelectedCulturalCenterssRows(rows)}
          />
        </>
      )}

    </>
  );
}
