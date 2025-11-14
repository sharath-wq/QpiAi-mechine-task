import { Shield } from "lucide-react";

export const AdminHeader = () => (
  <div className="border-b border-border bg-card">
    <div className="container mx-auto px-4 py-6 sm:py-8">
      <div className="flex items-center gap-3 mb-1 sm:mb-2">
        <div className="rounded-lg bg-primary/10 p-2">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
          Admin Panel
        </h1>
      </div>

      <p className="text-muted-foreground ml-10 sm:ml-11 text-sm sm:text-base">
        Manage users and their roles
      </p>
    </div>
  </div>
);
