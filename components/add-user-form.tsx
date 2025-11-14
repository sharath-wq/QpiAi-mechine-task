"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addUser } from "@/app/dashboard/actions";
import { SubmitButton } from "./submit-button";

export function AddUserForm() {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError(null);
    setLoading(true);

    try {
      await addUser(formData);
      setOpen(false);
    } catch (err: any) {
      try {
        const msgs = JSON.parse(err.message);
        setError(msgs);
      } catch {
        setError([err.message]);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add New User</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create User</DialogTitle>
        </DialogHeader>

        {error && (
          <div className="space-y-1 p-2 border border-red-300 bg-red-50 rounded">
            {error.map((msg, i) => (
              <p key={i} className="text-red-600 text-sm">
                {msg}
              </p>
            ))}
          </div>
        )}

        <form action={handleSubmit} className="space-y-3">
          <Input name="email" placeholder="Email" required />
          <Input
            name="password"
            placeholder="Password"
            type="password"
            required
          />
          <Input
            name="firstName"
            placeholder="First Name"
            type="text"
            required
          />
          <Input name="lastName" placeholder="Last Name" type="text" required />

          <Select name="role">
            <SelectTrigger>
              <SelectValue placeholder="Select role" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="superadmin">Superadmin</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="user">User</SelectItem>
              <SelectItem value="guest">Guest</SelectItem>
            </SelectContent>
          </Select>

          <SubmitButton varient="default" disabled={loading} />
        </form>
      </DialogContent>
    </Dialog>
  );
}
