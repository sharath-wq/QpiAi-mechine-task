import { Lock } from "lucide-react";

export const AccessDenied = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="text-center space-y-4">
      <div className="flex justify-center mb-4">
        <div className="rounded-full bg-destructive/10 p-4">
          <Lock className="w-8 h-8 text-destructive" />
        </div>
      </div>

      <h1 className="text-3xl font-bold text-foreground">Access Denied</h1>
      <p className="text-muted-foreground text-lg">
        You do not have permission to access this page.
      </p>
    </div>
  </div>
);
