import { useEffect, useState } from "react";
import { useCheckRights } from "../../common/components/security/CheckRights";
import { RoleEnum } from "../../common/enum/RolesEnum";
import { activateDeactivateCulturalCenter, getAllCulturalCenters } from "../../api/services/culturalcenter.api";
import { activateDeactivateUsers, getAllUsers, getUsersByCulturalCenter } from "../../api/services/users.api";
import { useAuthStore } from "../../common/store/authStore";

export function useUsersnData() {

    const [selectedCulturalCentersRows, setSelectedCulturalCenterssRows] = useState([]);
    const [culturalCenters, setCulturalCenters] = useState([])

    const checkRights = useCheckRights();

    const isAdmin = checkRights(RoleEnum.ADMIN)

    const user = useAuthStore((state) => state.user);
    
    // Fetch data
    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            if (isAdmin) {
            const culturalCentersData = await getAllCulturalCenters()
            setCulturalCenters(culturalCentersData)
            }
        }

        fetchData()
    }, [user])

    // Refresh data

    const refreshCulturalCenters = async () => {
        if (isAdmin) {
        const culturalCentersData = await getAllCulturalCenters()
        setCulturalCenters(culturalCentersData)
        }
    };  

    // Colonne des tables

    const culturalCentersColumns = 
        [
            { key: "name", label: "Name" },
            {
            key: "isActive",
            label: "Status",
            render: (row: { isActive: boolean; }) => (row.isActive ? "🟢 Actif" : "🔴 Inactif"),
            }
        ]


    // Handlers
    const handleActivateDeactivateCulturalCenters = async () => {
        const ids = selectedCulturalCentersRows.map(row => row.id);
        await activateDeactivateCulturalCenter(ids)
        setSelectedCulturalCenterssRows([])
        refreshCulturalCenters()
    };

    return {
        isAdmin,

        culturalCenters,

        setSelectedCulturalCenterssRows,

        culturalCentersColumns,

        handleActivateDeactivateCulturalCenters,
    }

};
