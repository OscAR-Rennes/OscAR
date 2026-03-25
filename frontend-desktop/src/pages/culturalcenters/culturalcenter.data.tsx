import { useEffect, useState } from "react";
import { useCheckRights } from "../../common/components/security/CheckRights";
import { RoleEnum } from "../../common/enum/RolesEnum";
import { activateDeactivateCulturalCenter, getAllCulturalCenters } from "../../api/services/culturalcenter.api";
import { useAuthStore } from "../../common/store/authStore";
import "../../common/components/table/Table.style.css";

export function useUsersnData() {

    const [selectedCulturalCentersRows, setSelectedCulturalCenterssRows] = useState([]);
    const [culturalCenters, setCulturalCenters] = useState([])
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 15,
        total: 0,
        totalPages: 1,
    });

    const checkRights = useCheckRights();

    const isAdmin = checkRights(RoleEnum.ADMIN)

    const user = useAuthStore((state) => state.user);
    const hasSelectedCulturalCenters = selectedCulturalCentersRows.length > 0;
    
    // Fetch data
    useEffect(() => {
        if (!user) return;

        const fetchData = async () => {
            if (isAdmin) {
            const response = await getAllCulturalCenters({ page: pagination.page, limit: pagination.limit })
            setCulturalCenters(Array.isArray(response?.data) ? response.data : [])

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
        }

        fetchData()
    }, [user, isAdmin, pagination.page, pagination.limit])

    // Refresh data

    const refreshCulturalCenters = async () => {
        if (isAdmin) {
        const response = await getAllCulturalCenters({ page: pagination.page, limit: pagination.limit })
        setCulturalCenters(Array.isArray(response?.data) ? response.data : [])
        }
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

    const culturalCentersColumns = 
        [
            { key: "name", label: "Nom du centre" },
            { key: "isActive", label: "Status" }
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
        pagination,
        handlePaginationChange,

        setSelectedCulturalCenterssRows,

        culturalCentersColumns,

        hasSelectedCulturalCenters,

        executeActivateDeactivateCulturalCenters,
    }

};
