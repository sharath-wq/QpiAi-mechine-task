import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RoleForm } from "@/components/role-form";
import { permissionsByRole } from "@/constants";
import { Roles } from "@/types/clerk";

export const UserCard = ({ user, setRole }: any) => {
  const role = (user.publicMetadata?.role as Roles) || "guest";
  const permissions = permissionsByRole[role] ?? [];

  return (
    <div className="border border-border bg-background rounded-lg p-4 sm:p-5 hover:shadow-md transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        
        {/* User Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-base truncate">
            {user.fullName || "No Name"}
          </h3>

          <p className="text-sm text-muted-foreground truncate">
            {user.emailAddresses[0]?.emailAddress}
          </p>

          <span className="inline-block mt-2 px-2 py-1 bg-primary/10 text-primary text-xs font-semibold rounded capitalize">
            {role}
          </span>
        </div>

        {/* Permissions */}
        <div className="flex-1">
          <p className="text-xs text-muted-foreground mb-1">Permissions</p>

          <div className="flex flex-wrap gap-1">
            {permissions.slice(0, 2).map((perm, i) => (
              <span
                key={i}
                className="text-xs bg-secondary/30 text-secondary-foreground px-2 py-1 rounded"
              >
                {perm}
              </span>
            ))}

            {/* More permissions */}
            {permissions.length > 2 && (
              <Popover>
                <PopoverTrigger asChild>
                  <span className="text-xs text-muted-foreground px-1 py-1 cursor-pointer hover:underline">
                    +{permissions.length - 2} more
                  </span>
                </PopoverTrigger>

                <PopoverContent className="w-48">
                  <p className="text-sm font-medium mb-2">All Permissions</p>
                  <div className="flex flex-wrap gap-1">
                    {permissions.map((perm, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-secondary/30 text-secondary-foreground px-2 py-1 rounded"
                      >
                        {perm}
                      </span>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className={`${role === "superadmin" ? "opacity-0 pointer-events-none" : ""}`}>
          <RoleForm userId={user.id} currentRole={role} action={setRole} />
        </div>
      </div>
    </div>
  );
};
