import { clerkClient } from "@clerk/nextjs/server";
import { setRole } from "@/app/dashboard/actions";
import { StatsGrid } from "@/components/stats-grid";
import { UsersList } from "@/components/users-list";
import { ClerkUser, SafeUser } from "@/types/clerk";

export async function AdminContent() {
  const client = await clerkClient();
  const users = await client.users.getUserList();

  const safeUsers = users.data.map(toSafeUser);

  return (
    <>
      <StatsGrid users={safeUsers} />
      <UsersList 
        users={safeUsers} 
        setRole={setRole}
      />
    </>
  );
}

function toSafeUser(u: ClerkUser): SafeUser {
  return {
    id: u.id,
    firstName: u.firstName,
    lastName: u.lastName,
    fullName: u.fullName,
    email: u.emailAddresses?.[0]?.emailAddress ?? "",
    imageUrl: u.imageUrl,
    role: u.publicMetadata?.role ?? "guest",
  };
}
