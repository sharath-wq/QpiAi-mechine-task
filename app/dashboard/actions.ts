"use server";

import { Roles } from "@/types/clerk";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

// ---------- AUTH CHECK ----------
async function requireSuperAdmin() {
  const { sessionClaims } = await auth();
  if (sessionClaims?.metadata?.role !== "superadmin") {
    throw new Error("Not Authorized");
  }
}

// ---------- CREATE USER ----------
export async function addUser(formData: FormData) {
  await requireSuperAdmin();

  const client = await clerkClient();

  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const role = formData.get("role") as Roles;
  const firstName = formData.get("firstName") as string | null;
  const lastName = formData.get("lastName") as string | null;

  if (!email || !password) throw new Error("Email and password are required");

  try {
    await client.users.createUser({
      emailAddress: [email],
      password,
      publicMetadata: { role },
      firstName: firstName ?? undefined,
      lastName: lastName ?? undefined,
    });

    revalidatePath("/users");
  } catch (error: any) {
    console.error("Clerk error:", error);

    const messages = error?.errors?.map(
      (e: any) => e.longMessage || e.message
    ) ?? [error.message || "Unknown error occurred"];
    throw new Error(JSON.stringify(messages));
  }
}

// ---------- EDIT USER (UPDATE PROFILE + ROLE) ----------
export async function editUser(formData: FormData) {
  await requireSuperAdmin();

  const client = await clerkClient();

  const id = formData.get("id") as string;
  const firstName = formData.get("firstName") as string | null;
  const lastName = formData.get("lastName") as string | null;
  const role = formData.get("role") as Roles | null;

  if (!id) throw new Error("User ID required");

  try {
    await client.users.updateUser(id, {
      firstName: firstName ?? undefined,
      lastName: lastName ?? undefined,
      publicMetadata: { role },
    });

    revalidatePath("/users");
  } catch (error) {
    console.error("Error editing user:", error);
    throw new Error("Failed to update user");
  }
}

// ---------- DELETE USER ----------
export async function deleteUser(formData: FormData) {
  await requireSuperAdmin();

  const client = await clerkClient();
  const id = formData.get("id") as string;

  if (!id) throw new Error("User ID required");

  try {
    await client.users.deleteUser(id);
    revalidatePath("/users");
  } catch (error) {
    console.error("Error deleting user:", error);
    throw new Error("Failed to delete user");
  }
}

// ---------- SET ROLE ----------
export async function setRole(formData: FormData) {
  await requireSuperAdmin();

  const client = await clerkClient();
  const id = formData.get("id") as string;
  const role = formData.get("role") as Roles;

  try {
    await client.users.updateUser(id, {
      publicMetadata: { role },
    });

    revalidatePath("/users");
  } catch (error) {
    console.error("Error updating user role:", error);
    throw new Error("Failed to update user role");
  }
}

// ---------- REMOVE ROLE ----------
export async function removeRole(formData: FormData) {
  await requireSuperAdmin();

  const client = await clerkClient();
  const id = formData.get("id") as string;

  try {
    await client.users.updateUser(id, {
      publicMetadata: { role: null },
    });

    revalidatePath("/users");
  } catch (error) {
    console.error("Error removing user role:", error);
    throw new Error("Failed to remove user role");
  }
}
