import { useEffect, useState } from "react";
import { useCheckRights } from "../../common/components/security/CheckRights";
import { RoleEnum } from "../../common/enum/RolesEnum";
import { activateDeactivateUsers, getAllUsers, getUsersByCulturalCenter } from "../../api/services/users.api";
import { useAuthStore } from "../../common/store/authStore";

export function useUsersnData() {

    const [selectedUsersRows, setSelectedUsersRows] = useState([]);
    const [users, setUsers] = useState([]);

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
            { key: "isActive", label: "Status" }
        ]

    // Handlers

    const getSelectedUsersIds = () => selectedUsersRows.map(row => row.id);

    const hasSelectedUsers = selectedUsersRows.length > 0;

    const executeActivateDeactivateUsers = async () => {
        const ids = getSelectedUsersIds();
        await activateDeactivateUsers(ids)
        setSelectedUsersRows([])
        refreshUsers()
    };

    return {
        isAdmin,

        users,

        setSelectedUsersRows,

        userColumns,

        hasSelectedUsers,

        executeActivateDeactivateUsers,
    }

};
