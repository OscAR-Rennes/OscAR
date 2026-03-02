import { logoutUser } from "../../api/services/auth.api";
import Table from "../../common/components/table/Table";
import { useAuthStore } from "../../common/store/authStore";
import { useUsersnData } from "./culturalcenter.data";

export default function CulturalCenters() {

  const {
    isAdmin,
    culturalCenters,
    setSelectedCulturalCenterssRows,
    culturalCentersColumns,
    handleActivateDeactivateCulturalCenters,
  } = useUsersnData();

  const clearUser = useAuthStore((state) => state.clearUser);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const handleLogout = async () => {
      await logoutUser();
      clearUser();
  };

  return (
    <>
      <h1>Lootopia V0.0.1 - Cultural Centers management</h1>

      { isAdmin && (
        <>
          <h2>Table centre culturels</h2>
          <Table
            data={culturalCenters}
            columns={culturalCentersColumns}
            onRowSelect={(rows) => setSelectedCulturalCenterssRows(rows)}
            renderActionButton={() => (
              <button
                className="table-btn"
                onClick={handleActivateDeactivateCulturalCenters}
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
