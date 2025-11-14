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

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />
      <div className="container mx-auto px-4 py-6 sm:py-8">
        <StatsGrid users={users.data} />

        <UsersList 
          users={users.data}
          setRole={setRole}
        />
      </div>
    </div>
  );
}
