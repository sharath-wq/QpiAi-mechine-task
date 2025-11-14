import { auth, clerkClient } from "@clerk/nextjs/server";
import { setRole } from "./actions";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RoleForm } from "@/components/role-form";

export default async function AdminPage() {
  const { sessionClaims } = await auth();

  if (sessionClaims?.metadata?.role !== "superadmin") {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-semibold">Not Authorized</h1>
        <p className="text-muted-foreground">
          You do not have permission to access this page.
        </p>
      </div>
    );
  }

  const client = await clerkClient();
  const users = await client.users.getUserList();

  return (
    <div className="container mx-auto py-10">
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Admin Panel — User Management
          </CardTitle>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 gap-6">
            {users.data.map((user) => {
              const role = (user.publicMetadata?.role as string) || "none";

              return (
                <div
                  key={user.id}
                  className="border p-4 rounded-xl flex items-center justify-between shadow-sm bg-white"
                >
                  <div>
                    <h3 className="font-medium text-lg">
                      {user.fullName || "No Name"}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {user.emailAddresses[0]?.emailAddress}
                    </p>
                    <p className="text-sm mt-1">
                      <span className="font-semibold">Role:</span>{" "}
                      <span className="capitalize">{role}</span>
                    </p>
                  </div>

                  { role !== 'superadmin' && <div className="flex items-center gap-3">
                    <RoleForm
                      userId={user.id}
                      currentRole={role}
                      action={setRole}
                    />
                  </div>}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
