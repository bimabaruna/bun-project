import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Plus, Edit, Trash2, Store } from "lucide-react";
import { useOutlets } from "@/hooks/useOutlet";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { PhoneInput } from "@/components/ui/phone-input";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Textarea } from "@/components/ui/textarea";
// const mockOutlets = [
//   { id: "1", name: "Main Store", address: "123 Main St, City", status: "active", sales: 15420 },
//   { id: "2", name: "Mall Branch", address: "456 Mall Ave, City", status: "active", sales: 12350 },
//   { id: "3", name: "Airport Kiosk", address: "789 Airport Rd, City", status: "inactive", sales: 8900 },
// ];

const Outlets = () => {
  const {
    outlets,
    loading,
    createOutlet,
    updateOutlet,
    deleteOutlet
  } = useOutlets();
  const { toast } = useToast();
  // Modal states
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedOutlet, setSelectedOutlet] = useState<any>(null);

  // Form states
  const [createOutletName, setCreateOutletName] = useState("");
  const [createOutletPhone, setCreateOutletPhone] = useState("");
  const [createOutletAddress, setCreateOutletAddress] = useState("");
  const [editOutletPhone, setEditOutletPhone] = useState("");
  const [editOutletAddress, setEditOutletAddress] = useState("");
  const [editOutletName, setEditOutletName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreateOutlet = async () => {
    if (!createOutletName.trim())
      return

    setIsSubmitting(true);
    const result = await createOutlet(createOutletName, createOutletPhone, createOutletAddress);

    if (result.success) {
      toast({
        title: "Success",
        description: "Outlet created successfully"
      });
      setCreateModalOpen(false);
      setCreateOutletName("")
    } else {
      toast({
        title: "Error",
        description: "Failed to create outlet",
        variant: "destructive"
      });
    }
    setIsSubmitting(false)
  }

  const handleEditOutlet = async () => {
    if (!editOutletName.trim() || !selectedOutlet)
      return
    setIsSubmitting(true);
    const result = await updateOutlet(selectedOutlet.id, editOutletName, editOutletPhone, editOutletAddress);

    if (result.success) {
      toast({
        title: "Success",
        description: "Outlet updated successfully",
      });
      setEditModalOpen(false);
      setEditOutletName("")
      setSelectedOutlet(null)
    } else {
      toast({
        title: "Error",
        description: "Failed to update Outlet",
        variant: "destructive"
      });
    }
    setIsSubmitting(false)

  }

  const handleDeleteOutlet = async () => {
    if (!selectedOutlet) return

    setIsSubmitting(true);
    const result = await deleteOutlet(selectedOutlet.id);

    if (result.success) {
      toast({
        title: "Success",
        description: "Outlet deleted successfully",
      });
      setDeleteDialogOpen(false);
      setSelectedOutlet(null);
    } else {
      toast({
        title: "Error",
        description: "Failed to delete Outlet",
        variant: "default",
      });
    }
    setIsSubmitting(false);
  };

  const openEditModal = (outlet: any) => {
    setSelectedOutlet(outlet);
    setEditOutletName(outlet.name);
    setEditOutletPhone(outlet.phone);
    setEditOutletAddress(outlet.address);
    setEditModalOpen(true);
  };

  const openDeleteDialog = (outlet: any) => {
    setSelectedOutlet(outlet);
    setDeleteDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Outlets</h1>
          <p className="text-muted-foreground">Manage your store locations and branches.</p>
        </div>
        <Button className="bg-gradient-primary" onClick={() => setCreateModalOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Outlet
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {loading ? (
          Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="w-50 h-60">
              <CardContent>
                <div className="flex items-center gap-2">
                  <Skeleton className="h-5 w-5 mt-10" />
                  <Skeleton className="w-full h-5 mt-10 flex items-center justify-between" />
                </div>
                <Skeleton className="w-32 h-5 mt-5 flex items-center justify-between" />
                <Skeleton className="w-32 h-5 mt-2 flex items-center justify-between" />
                <Skeleton className="w-32 h-5 mt-2 flex items-center justify-between" />
                <div className="flex gap-2">
                  <Skeleton className="h-8 w-8 mt-5" />
                  <Skeleton className="h-8 w-8 mt-5 " />
                </div>
              </CardContent>
            </Card>
          ))
        ) : outlets.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-16 text-center">
            <Store className="h-16 w-16 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No outlets found</h3>
            <p className="text-muted-foreground mb-6 max-w-sm">
              Set up your first outlet location to start managing your store branches and inventory distribution.
            </p>
            <Button className="bg-gradient-primary" onClick={() => setCreateModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Outlet
            </Button>
          </div>
        ) : (
          outlets.map((outlet) => (
            <Card key={outlet.id} className="shadow-medium">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    {outlet.name}
                  </CardTitle>
                  {/* <Badge variant={outlet.name === "active" ? "default" : "secondary"}>
                  {outlet.status}
                </Badge> */}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{outlet.address}</p>
                <div className="flex items-center justify-between">

                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEditModal(outlet)}><Edit className="h-3 w-3" /></Button>
                    <Button variant="destructive" size="sm" onClick={() => openDeleteDialog(outlet)}><Trash2 className="h-3 w-3" /></Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create outlet Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Outlet</DialogTitle>
            <DialogDescription>
              Add a new outlet to organize your products.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="outletName">Outlet Name</Label>
              <Input
                id="outletName"
                value={createOutletName}
                onChange={(e) => setCreateOutletName(e.target.value)}
                placeholder="Enter outlet name"
              />
            </div>
            <div>
              <Label htmlFor="outletPhone">Outlet Phone Number</Label>
              <PhoneInput
                id="outletPhone"
                value={createOutletPhone}
                onChange={(e) => setCreateOutletPhone(e.target.value)}
                placeholder="Enter outlet phone"
              />
            </div>
            <div>
              <Label htmlFor="outletAddress">Outlet Adress</Label>
              <Textarea
                id="outletAddress"
                value={createOutletAddress}
                onChange={(e) => setCreateOutletAddress(e.target.value)}
                placeholder="Enter outlet address"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateOutlet} disabled={isSubmitting || !createOutletName.trim()}>
              {isSubmitting ? "Creating..." : "Create Outlet"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Outlet Modal */}
      <Dialog open={editModalOpen} onOpenChange={setEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit outlet</DialogTitle>
            <DialogDescription>
              Update the outlet information.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="editOutletName">Outlet Name</Label>
              <Input
                id="editOutletName"
                value={editOutletName}
                onChange={(e) => setEditOutletName(e.target.value)}
                placeholder="Enter Outlet name"
              />
            </div>
            <div>
              <Label htmlFor="outletPhone">Outlet Phone Number</Label>
              <PhoneInput
                id="outletPhone"
                value={editOutletPhone}
                onChange={(e) => setEditOutletPhone(e.target.value)}
                placeholder="Enter outlet phone"
              />
            </div>
            <div>
              <Label htmlFor="outletAddress">Outlet Adress</Label>
              <Textarea
                id="outletAddress"
                value={editOutletAddress}
                onChange={(e) => setEditOutletAddress(e.target.value)}
                placeholder="Enter outlet address"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditOutlet} disabled={isSubmitting || !editOutletName.trim()}>
              {isSubmitting ? "Updating..." : "Update outlet"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {/* Delete Category Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Outlet</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedOutlet?.outletName}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteOutlet}
              disabled={isSubmitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Outlets;