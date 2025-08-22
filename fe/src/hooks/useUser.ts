import { UserListResponse, User } from "@/model/types"
import axios from "axios";
import { useCallback, useEffect, useState } from "react"

export const useUser = (initialPageNumber = 1, pageSize = 10) => {

    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true)
    const [pageNumber, setPageNumber] = useState(initialPageNumber);
    const [lastPage, setLastPage] = useState(1)
    const size = pageSize

    const fetchUsers = useCallback(async () => {
        setLoading(true);

        try {
            const token = localStorage.getItem('token')
            const response = await axios.get<UserListResponse>(
                `/api/users?page=${pageNumber}&size=${size}`,
                {
                    headers: {
                        Authorization: token || ""
                    }
                }
            );
            const responseData = response.data;
            const fetchedUsers = responseData.data ?? []
            setUsers(fetchedUsers);
            setLastPage(responseData.lastPage)
        } catch (error) {
            console.log("failed to fetch users:", error);
            setUsers([])
        } finally {
            setLoading(false)
        }
    }, [pageNumber, size]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers])

    const handlePrev = () => {
        if (pageNumber > 1) setPageNumber(pageNumber - 1)
    }

    const handleNext = () => {
        setPageNumber((prev) => prev + 1)
    }

    const updateUser = async (userId: string, name: string, roleId: number, password?: string) => {
        if (!userId) return

        try {
            const token = localStorage.getItem("token");
            await axios.patch(`/api/users/${userId}`, {
                name,
                roleId,
                password
            }, {
                headers: {
                    Authorization: token || "",
                    "Content-Type": "application.json"
                }
            })
            await fetchUsers()
            return { success: true }
        } catch (error) {
            console.error("Update Error", error);
            return { success: false, error }
        }
    }

    const fetchUser = async (userId: string) => {
        try {
            const token = localStorage.getItem('token')
            const response = await axios.get(`/api/users/${userId}`, {
                headers: {
                    Authorization: token || ""
                }
            });
            return { success: true, data: response.data }
        } catch (error) {
            console.error("Fetch user error:", error);
            return { success: false, error }
        }
    }

    const createUser = async (username: string, password: string, name: string, roleId: string) => {
        try {
            const token = localStorage.getItem("token");
            await axios.post("/api/users", {
                username,
                password,
                name,
                roleId: Number(roleId)
            }, {
                headers: {
                    Authorization: token || "",
                    "Content-Type": "application/json"
                }
            });
            await fetchUsers();
            return { success: true };
        } catch (error) {
            console.error("Create user error:", error);
            return { success: false, error };
        }
    }

    const hasMore: boolean = pageNumber < lastPage

    return {
        users,
        loading,
        pageNumber,
        updateUser,
        fetchUser,
        createUser,
        handlePrev,
        handleNext,
        hasMore,
        isEmpty: users.length === 0,
        refetch: fetchUsers
    }
}