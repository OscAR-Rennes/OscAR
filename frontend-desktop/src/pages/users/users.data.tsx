import { useEffect, useState } from "react";
import { useCheckRights } from "../../common/components/security/CheckRights";
import { RoleEnum } from "../../common/enum/RolesEnum";
import { activateDeactivateCulturalCenter, getAllCulturalCenters } from "../../api/services/culturalcenter.api";
import { activateDeactivateUsers, getAllUsers, getUsersByCulturalCenter } from "../../api/services/users.api";
import { useAuthStore } from "../../common/store/authStore";

export function useUsersnData() {

    const [selectedUsersRows, setSelectedUsersRows] = useState([]);
    const [selectedCulturalCentersRows, setSelectedCulturalCenterssRows] = useState([]);
    const [users, setUsers] = useState([]);
    const [culturalCenters, setCulturalCenters] = useState([])

    const checkRights = useCheckRights();

    const isAdmin = checkRights(RoleEnum.ADMIN)

    const user = useAuthStore((state) => state.user);
    
    // Fetch data
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

    // Refresh data
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

    // Colonne des tables
    const userColumns = 
        [
            { key: "username", label: "Username" },
            { key: "email", label: "Email"},
            {
                key: "isActive",
                label: "Status",
                render: (row: { isActive: boolean; }) => (row.isActive ? "🟢 Actif" : "🔴 Inactif"),
            }
        ]

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
        refreshUsers()
    };

    const handleActivateDeactivateUsers = async () => {
        const ids = selectedUsersRows.map(row => row.id);
        await activateDeactivateUsers(ids)
        setSelectedUsersRows([])
        refreshUsers()
    };
    return {
        isAdmin,

        users,
        culturalCenters,

        setSelectedUsersRows,
        setSelectedCulturalCenterssRows,

        userColumns,
        culturalCentersColumns,

        handleActivateDeactivateCulturalCenters,
        handleActivateDeactivateUsers
    }

};
