import { auth } from "@clerk/nextjs/server";
import { AccessDenied } from "@/components/access-denied";
import { AdminHeader } from "@/components/header";
import { Suspense } from "react";
import { AdminContent } from "@/components/admin-content";


export default async function AdminPage() {
  const { sessionClaims } = await auth();
  if (sessionClaims?.metadata?.role !== "superadmin") {
    return <AccessDenied />;
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <div className="container mx-auto px-4 py-6 sm:py-8">
        <Suspense fallback={<div>Loading dashboard content...</div>}>
          <AdminContent />
        </Suspense>
      </div>
    </div>
  );
}
