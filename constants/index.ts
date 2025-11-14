export const permissionsByRole: Record<string, string[]> = {
  superadmin: [
    "Full system access",
    "Can manage admins",
    "Can manage permissions schema",
    "Can view/edit/delete any user",
    "Can assign any role",
  ],
  admin: [
    "Manages managers + users",
    "Manages most resources",
    "Cannot alter superadmin",
    "Cannot change global RBAC config",
  ],
  manager: [
    "Manages users in their department/team",
    "Can view most dashboards",
    "Cannot manage admins or superadmins",
    "Cannot change RBAC config",
  ],
  user: [
    "Standard access",
    "Limited dashboards",
    "No management privileges",
  ],
  guest: [
    "Read-only or restricted access",
    "Minimum visibility",
  ],
};
