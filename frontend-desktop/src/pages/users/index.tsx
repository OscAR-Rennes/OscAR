import { logoutUser } from "../../api/services/auth.api";
import Table from "../../common/components/table/Table";
import { useAuthStore } from "../../common/store/authStore";
import { useUsersnData } from "./users.data";


export default function Users() {

  const {
    isAdmin,
    users,
    setSelectedUsersRows,
    userColumns,
    handleActivateDeactivateUsers
  } = useUsersnData();

  const clearUser = useAuthStore((state) => state.clearUser);

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
          <Table
            data={users}
            columns={userColumns}
            onRowSelect={setSelectedUsersRows}
            renderActionButton={() => (
              <button 
              className="table-btn" 
              onClick={handleActivateDeactivateUsers}
              >
                Désactiver / Réactiver
              </button>
            )}
          />
        </>
      )}

    
    </>
  );
}
