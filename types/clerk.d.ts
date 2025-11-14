export {}

export type Roles = 'admin' | 'user' | 'superadmin' | 'manager' | 'guest';

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
    };
  }
}