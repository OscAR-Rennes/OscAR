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

      { isAdmin && (
        <>         
          <Table
            data={users}
            columns={userColumns}
            onRowSelect={setSelectedUsersRows}
            allItemsLabel="utilisateurs"
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
