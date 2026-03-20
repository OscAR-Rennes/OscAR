import { useEffect, useState } from "react";
import { useCheckRights } from "../../common/components/security/CheckRights";
import { RoleEnum } from "../../common/enum/RolesEnum";
import { activateDeactivateCulturalCenter, getAllCulturalCenters } from "../../api/services/culturalcenter.api";
import { useAuthStore } from "../../common/store/authStore";
import "../../common/components/table/Table.style.css";

export function useUsersnData() {

    const [selectedCulturalCentersRows, setSelectedCulturalCenterssRows] = useState([]);
    const [culturalCenters, setCulturalCenters] = useState([])

    const checkRights = useCheckRights();

    const isAdmin = checkRights(RoleEnum.ADMIN)

    const user = useAuthStore((state) => state.user);
    const hasSelectedCulturalCenters = selectedCulturalCentersRows.length > 0;
    
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
            { key: "name", label: "Nom du centre" },
            {
            key: "isActive",
            label: "Status",
            render: (row: { isActive: boolean; }) => (row.isActive ? "🟢 Actif" : "🔴 Inactif"),
            }
        ]


    // Handlers
    const getSelectedCulturalCentersIds = () => selectedCulturalCentersRows.map(row => row.id);

    const executeActivateDeactivateCulturalCenters = async () => {
        const ids = getSelectedCulturalCentersIds();
        await activateDeactivateCulturalCenter(ids)
        setSelectedCulturalCenterssRows([])
        refreshCulturalCenters()
    };

    return {
        isAdmin,

        culturalCenters,

        setSelectedCulturalCenterssRows,

        culturalCentersColumns,

        hasSelectedCulturalCenters,

        executeActivateDeactivateCulturalCenters,
    }

};
