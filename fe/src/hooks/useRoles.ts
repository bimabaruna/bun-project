import { RoleListResponse, Role } from "@/model/roleTypes"
import axios from "axios";
import { useCallback, useEffect, useState } from "react"

export const useRoles = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchRoles = useCallback(async () => {
        setLoading(true);

        try {
            const token = localStorage.getItem('token');
            const response = await axios.get<RoleListResponse>(
                `/api/roles`,
                {
                    headers: {
                        Authorization: token || ""
                    }
                }
            );
            const responseData = response.data;
            const fetchedRoles = responseData.data ?? [];
            setRoles(fetchedRoles);
        } catch (error) {
            console.log("failed to fetch roles:", error);
            setRoles([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRoles();
    }, [fetchRoles]);

    const createRole = async (roleName: string) => {
        const token = localStorage.getItem('token');
        const response = await axios.post(`/api/roles`, {
            roleName
        }, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: token || ""
            }
        });
        await fetchRoles(); // Refresh the list
        return response.data;
    };

    const deleteRole = async (roleId: string) => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.delete(`/api/roles/${roleId}`, {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token || ""
                }
            })
            await fetchRoles();
            return { success: true }
        } catch (error) {
            console.log("Delete error", error);
            return { success: false, error }
        }

    }

    return {
        roles,
        loading,
        isEmpty: roles.length === 0,
        refetch: fetchRoles,
        createRole,
        deleteRole
    };
};