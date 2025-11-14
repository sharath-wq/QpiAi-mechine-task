import { Card, CardContent } from "@/components/ui/card";
import { Users, ShieldCheck, Shield, UserCog, User, Ticket } from "lucide-react";

const ICONS = {
  total: Users,
  superadmin: ShieldCheck,
  admin: Shield,
  manager: UserCog,
  user: User,
  guest: Ticket,
};

const ROLES = ["superadmin", "admin", "manager", "user", "guest"] as const;

export const StatsGrid = ({ users }: any) => {
  const roleCount = (role: string) =>
    users.filter((u: any) => u.publicMetadata?.role === role).length;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
      <StatCard
        label="Total Users"
        value={users.length}
        Icon={ICONS.total}
      />

      {ROLES.map((role) => (
        <StatCard
          key={role}
          label={role.charAt(0).toUpperCase() + role.slice(1) + "s"}
          value={roleCount(role)}
          Icon={ICONS[role]}
        />
      ))}
    </div>
  );
};

const StatCard = ({ label, value, Icon }: any) => (
  <Card>
    <CardContent className="pt-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <Icon className="w-10 h-10 text-primary/50" />
      </div>
    </CardContent>
  </Card>
);
