import { auth, clerkClient } from "@clerk/nextjs/server";
import { setRole } from "./actions";
import { AccessDenied } from "@/components/access-denied";
import { AdminHeader } from "@/components/header";
import { StatsGrid } from "@/components/stats-grid";
import { UsersList } from "@/components/users-list";


export default async function AdminPage() {
  const { sessionClaims } = await auth();
  if (sessionClaims?.metadata?.role !== "superadmin") {
    return <AccessDenied />;
  }

  const client = await clerkClient();
  const users = await client.users.getUserList();

  const safeUsers = users.data.map(toSafeUser);

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <div className="container mx-auto px-4 py-6 sm:py-8">

        <StatsGrid users={safeUsers} />

        <UsersList 
          users={safeUsers} 
          setRole={setRole}
        />

      </div>
    </div>
  );
}



function toSafeUser(u: any) {
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
