"use client";

import { useState } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { SubmitButton } from "./submit-button";

export function RoleForm({
  userId,
  currentRole,
  action,
}: {
  userId: string;
  currentRole: string;
  action: (formData: FormData) => void;
}) {
  const [role, setRole] = useState(currentRole === "none" ? "" : currentRole);

  const isSame = role === (currentRole === "none" ? "" : currentRole) || role === "superadmin";

  return (
    <form action={action} className="flex items-center gap-2">
      <input type="hidden" name="id" value={userId} />

      <Select
        name="role"
        defaultValue={role}
        onValueChange={(val) => setRole(val)}
      >
        <SelectTrigger className="w-[150px]">
          <SelectValue placeholder="Set role" />
        </SelectTrigger>

        <SelectContent>
          {/* <SelectItem value="superadmin">Superadmin</SelectItem> */}
          <SelectItem value="admin">Admin</SelectItem>
          <SelectItem value="manager">Manager</SelectItem>
          <SelectItem value="user">User</SelectItem>
          <SelectItem value="guest">Guest</SelectItem>
        </SelectContent>
      </Select>

      {/* 🔥 This fixes the loader */}
      <SubmitButton disabled={isSame} />
    </form>
  );
}
