import { useEffect, useState } from "react";
import { useCheckRights } from "../../common/components/security/CheckRights";
import { RoleEnum } from "../../common/enum/RolesEnum";
import { activateDeactivateUsers, getAllUsers, getUsersByCulturalCenter } from "../../api/services/users.api";
import { useAuthStore } from "../../common/store/authStore";

export function useUsersnData() {

    const [selectedUsersRows, setSelectedUsersRows] = useState([]);
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 15,
        total: 0,
        totalPages: 1,
    });

    const checkRights = useCheckRights();

    const isAdmin = checkRights(RoleEnum.ADMIN)
    const isCulturalCenterManager = checkRights(RoleEnum.CULTURAL_CENTER_MANAGER)

    const user = useAuthStore((state) => state.user);
    
    // Fetch data
    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            const response = await (
            isAdmin
                ? getAllUsers({ page: pagination.page, limit: pagination.limit })
                : getUsersByCulturalCenter({ page: pagination.page, limit: pagination.limit })
            );

            const rawUsers = Array.isArray(response?.data) ? response.data : [];
            const filtered = isCulturalCenterManager
                ? rawUsers.filter((u: any) => Array.isArray(u.rights) && u.rights.includes(RoleEnum.HUNT_MANAGER))
                : rawUsers;

            setUsers(filtered);

            setPagination((prev) => {
                const next = {
                    page: response?.pagination?.page ?? prev.page,
                    limit: response?.pagination?.limit ?? prev.limit,
                    total: response?.pagination?.total ?? prev.total,
                    totalPages: response?.pagination?.totalPages ?? prev.totalPages,
                };

                if (
                    prev.page === next.page &&
                    prev.limit === next.limit &&
                    prev.total === next.total &&
                    prev.totalPages === next.totalPages
                ) {
                    return prev;
                }

                return next;
            });
        }

        fetchData()
    }, [user, isAdmin, pagination.page, pagination.limit])

    // Refresh data
    const refreshUsers = async () => {
        const response = await (
        isAdmin
            ? getAllUsers({ page: pagination.page, limit: pagination.limit })
            : getUsersByCulturalCenter({ page: pagination.page, limit: pagination.limit })
        );
        const rawUsers = Array.isArray(response?.data) ? response.data : [];
        const filtered = isCulturalCenterManager
            ? rawUsers.filter((u: any) => Array.isArray(u.rights) && u.rights.includes(RoleEnum.HUNT_MANAGER))
            : rawUsers;
        setUsers(filtered)
    };

    const handlePaginationChange = ({ page, limit }: { page: number; limit: number }) => {
        setPagination((prev) => {
            if (prev.page === page && prev.limit === limit) {
                return prev;
            }

            return {
                ...prev,
                page,
                limit,
            };
        });
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
        isCulturalCenterManager,

        users,
        pagination,
        handlePaginationChange,

        setSelectedUsersRows,

        userColumns,

        hasSelectedUsers,

        executeActivateDeactivateUsers,
    }

};
