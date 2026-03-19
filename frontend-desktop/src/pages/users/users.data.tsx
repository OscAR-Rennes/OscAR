import { useEffect, useState } from "react";
import { useCheckRights } from "../../common/components/security/CheckRights";
import { RoleEnum } from "../../common/enum/RolesEnum";
import { activateDeactivateUsers, getAllUsers, getUsersByCulturalCenter } from "../../api/services/users.api";
import { useAuthStore } from "../../common/store/authStore";
import { useNotificationStore } from "../../common/store/notificationStore";

export function useUsersnData() {

    const [selectedUsersRows, setSelectedUsersRows] = useState([]);
    const [users, setUsers] = useState([]);

    const checkRights = useCheckRights();

    const isAdmin = checkRights(RoleEnum.ADMIN)

    const user = useAuthStore((state) => state.user);
    const addNotification = useNotificationStore((state) => state.addNotification);
    
    // Fetch data
    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            const usersData = await (
            isAdmin
                ? getAllUsers()
                : getUsersByCulturalCenter()
            );

            setUsers(usersData)
        }

        fetchData()
    }, [user])

    // Refresh data
    const refreshUsers = async () => {
        const usersData = await (
        isAdmin
            ? getAllUsers()
            : getUsersByCulturalCenter()
        );
        setUsers(usersData)
    };


    // Colonne des tables
    const userColumns = 
        [
            { key: "username", label: "Nom d'utilisateur" },
            { key: "email", label: "Email"},
            {
                key: "isActive",
                label: "Status",
                render: (row: { isActive: boolean; }) => (row.isActive ? "🟢 Actif" : "🔴 Inactif"),
            }
        ]

    // Handlers

    const getSelectedUsersIds = () => selectedUsersRows.map(row => row.id);

    const validateActivateDeactivateUsers = (): boolean => {
        const ids = getSelectedUsersIds();

        if (ids.length === 0) {
            addNotification("Veuillez sélectionner au moins un utilisateur", undefined, 400);
            return false;
        }
        return true;
    };

    const executeActivateDeactivateUsers = async () => {
        const ids = getSelectedUsersIds();
        await activateDeactivateUsers(ids)
        setSelectedUsersRows([])
        refreshUsers()
    };

    const handleModifyUsers = (): boolean => {
        const ids = getSelectedUsersIds();

        if (ids.length === 0) {
            addNotification("Veuillez sélectionner au moins un utilisateur", undefined, 400);
            return false;
        }

        if (ids.length > 1) {
            addNotification("Veuillez sélectionner un seul utilisateur", undefined, 400);
            return false;
        }
        return true;
    };

    const handleDeleteUsers = (): boolean => {
        const ids = getSelectedUsersIds();

        if (ids.length === 0) {
            addNotification("Veuillez sélectionner au moins un utilisateur", undefined, 400);
            return false;
        }
        return true;
    };

    return {
        isAdmin,

        users,

        setSelectedUsersRows,

        userColumns,

        validateActivateDeactivateUsers,

        executeActivateDeactivateUsers,

        handleModifyUsers,

        handleDeleteUsers
    }

};
