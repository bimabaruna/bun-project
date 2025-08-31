import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users as UsersIcon, Plus, Edit, Trash2 } from "lucide-react";
import { useUser } from "@/hooks/useUser";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

const mockUsers = [
  { id: "1", name: "John Admin", email: "john@store.com", role: "admin", status: "active" },
  { id: "2", name: "Jane Cashier", email: "jane@store.com", role: "cashier", status: "active" },
  { id: "3", name: "Mike Manager", email: "mike@store.com", role: "manager", status: "active" },
];

const Users = () => {
  const navigate = useNavigate();

  const {
    users,
    loading,
    pageNumber,
    handlePrev,
    handleNext,
    hasMore,
  } = useUser()


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Users</h1>
          <p className="text-muted-foreground">Manage user accounts and permissions.</p>
        </div>
        <Button
          className="bg-gradient-primary"
          onClick={() => navigate("/users/create-user")}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add User
        </Button>
      </div>

      <Card className="shadow-medium">
        <CardHeader><CardTitle>User Management</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Role</TableHead>
                {/* <TableHead>Status</TableHead> */}
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell><Skeleton className="h-4 w-32" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-40" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-12">
                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                      <UsersIcon className="h-12 w-12 text-muted-foreground/50" />
                      <div>
                        <h3 className="font-medium text-foreground">No users found</h3>
                        <p className="text-sm">Add team members to manage your store operations.</p>
                      </div>
                      <Button
                        onClick={() => navigate("/users/create-user")}
                        size="sm"
                        className="mt-2 bg-gradient-primary"
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Add User
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.username}</TableCell>
                    <TableCell><Badge variant="secondary">{user.roleName}</Badge></TableCell>
                    {/* <TableCell><Badge variant={user.status === "active" ? "default" : "secondary"}>{user.status}</Badge></TableCell> */}
                    <TableCell className="text-right">
                      <div className="flex gap-2 justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate(`/users/${user.id}/edit`)}
                        >
                          <Edit className="h-3 w-3" />
                        </Button>
                        <Button variant="destructive" size="sm"><Trash2 className="h-3 w-3" /></Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Users;