"use client";

import { useState } from "react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RoleForm } from "@/components/role-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { permissionsByRole } from "@/constants";
import { Roles, SafeUser } from "@/types/clerk";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteUser, editUser, removeRole } from "@/app/dashboard/actions";
import { SubmitButton } from "./submit-button";

interface UserCardProps {
  user: SafeUser;
  setRole: (formData: FormData) => Promise<void>;
}

export const UserCard = ({ user, setRole }: UserCardProps) => {
  const role = (user.role as Roles) || "guest";
  const permissions = permissionsByRole[role] ?? [];
  const [openEdit, setOpenEdit] = useState(false);

  async function handleEdit(formData: FormData) {
    await editUser(formData);
    setOpenEdit(false);
  }

  async function handleDelete(id: string) {
    const fd = new FormData();
    fd.append("id", id);
    await deleteUser(fd);
  }

  return (
    <div className="border border-border bg-background rounded-lg p-4 sm:p-5 hover:shadow-md transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base truncate">
            {user.fullName || "No Name"}
          </h3>

          <p className="text-sm text-muted-foreground truncate">{user.email}</p>

          <span className="inline-block mt-2 px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded capitalize">
            {role}
          </span>
        </div>

        {/* PERMISSIONS */}
        <div className="flex-1">
          <p className="text-xs text-muted-foreground mb-1">Permissions</p>

          <div className="flex flex-wrap gap-1">
            {permissions.slice(0, 2).map((perm, i) => (
              <span
                key={i}
                className="text-xs bg-secondary/30 text-secondary-foreground px-2 py-1 rounded"
              >
                {perm}
              </span>
            ))}

            {permissions.length > 2 && (
              <Popover>
                <PopoverTrigger asChild>
                  <span className="text-xs text-muted-foreground px-1 py-1 cursor-pointer">
                    +{permissions.length - 2} more
                  </span>
                </PopoverTrigger>

                <PopoverContent className="w-48">
                  <p className="text-sm font-medium mb-2">All Permissions</p>
                  <div className="flex flex-wrap gap-1">
                    {permissions.map((perm, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-secondary/30 text-secondary-foreground px-2 py-1 rounded"
                      >
                        {perm}
                      </span>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>

        <div
          className={`flex flex-col gap-2 min-w-[140px] ${
            role === "superadmin" && "invisible"
          }`}
        >
          <RoleForm userId={user.id} currentRole={role} action={setRole} />

          {/* EDIT USER */}
          <Dialog open={openEdit} onOpenChange={setOpenEdit}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                Edit
              </Button>
            </DialogTrigger>

            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit User</DialogTitle>
              </DialogHeader>

              <form action={handleEdit} className="space-y-3">
                <input type="hidden" name="id" value={user.id} />

                <Input
                  name="firstName"
                  defaultValue={user.firstName || ""}
                  placeholder="First Name"
                />
                <Input
                  name="lastName"
                  defaultValue={user.lastName || ""}
                  placeholder="Last Name"
                />

                <select
                  name="role"
                  defaultValue={role}
                  className="w-full border rounded p-2"
                >
                  <option value="superadmin">Superadmin</option>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="user">User</option>
                  <option value="guest">Guest</option>
                </select>

                <SubmitButton varient="default" disabled={false} />
              </form>
            </DialogContent>
          </Dialog>

          {/* DELETE USER */}
          <SubmitButton
            handleClick={() => handleDelete(user.id)}
            varient="destructive"
            disabled={false}
            text="Delete"
          />
        </div>
      </div>
    </div>
  );
};
