import { useEffect, useState } from "react";
import Table from "../../common/components/table/Table";
import { RoleEnum } from "../../common/enum/RolesEnum";
import { useCheckRights } from "../../common/components/security/CheckRights";
import { useAuthStore } from "../../common/store/authStore";
import { activateDeactivateUsers, getAllUsers, getUsersByCulturalCenter } from "../../api/services/users.api";
import { activateDeactivateCulturalCenter, getAllCulturalCenters } from "../../api/services/culturalcenter.api";


export default function Users() {

  const [selectedUsersRows, setSelectedUsersRows] = useState([]);
  const [selectedCulturalCentersRows, setSelectedCulturalCenterssRows] = useState([]);
  const [users, setUsers] = useState([]);
  const [culturalCenters, setCulturalCenters] = useState([])

  const checkRights = useCheckRights();

  const isAdmin = checkRights(RoleEnum.ADMIN)
  const isCulturalCenterManager = checkRights(RoleEnum.CULTURAL_CENTER_MANAGER)

  const user = useAuthStore((state) => state.user);
  
  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
    const usersData = await (
      isAdmin
        ? getAllUsers()
        : getUsersByCulturalCenter(user.id_cultural_center)
    );

      setUsers(usersData)

      if (isAdmin) {
        const culturalCentersData = await getAllCulturalCenters()
        setCulturalCenters(culturalCentersData)
      }
    }

    fetchData()
  }, [user])

  const refreshUsers = async () => {
    const usersData = await (
      isAdmin
        ? getAllUsers()
        : getUsersByCulturalCenter(user.id_cultural_center)
    );
    setUsers(usersData)
  };

  const refreshCulturalCenters = async () => {
    if (isAdmin) {
      const culturalCentersData = await getAllCulturalCenters()
      setCulturalCenters(culturalCentersData)
    }
  };

  const handleActivateDeactivateUsers = async () => {
    const ids = selectedUsersRows.map(row => row.id);
    await activateDeactivateUsers(ids)
    setSelectedUsersRows([])
    refreshUsers()
  };

  const handleActivateDeactivateCulturalCenters = async () => {
    const ids = selectedCulturalCentersRows.map(row => row.id);
    await activateDeactivateCulturalCenter(ids)
    setSelectedCulturalCenterssRows([])
    refreshCulturalCenters()
    refreshUsers()
  };

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
            columns={[
              { key: "username", label: "Username" },
              { key: "email", label: "Email"},
              {
                key: "isActive",
                label: "Status",
                render: (row) => (row.isActive ? "🟢 Actif" : "🔴 Inactif"),
              }
            ]}
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
            columns={[
              { key: "name", label: "Name" },
              {
                key: "isActive",
                label: "Status",
                render: (row) => (row.isActive ? "🟢 Actif" : "🔴 Inactif"),
              }
            ]}
            onRowSelect={(rows) => setSelectedCulturalCenterssRows(rows)}
          />
        </>
      )}

    </>
  );
}
