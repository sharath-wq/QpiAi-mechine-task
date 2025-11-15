export {}

export type Roles = 'admin' | 'user' | 'superadmin' | 'manager' | 'guest';

declare global {
  interface CustomJwtSessionClaims {
    metadata: {
      role?: Roles;
    };
  }
}

export interface ClerkUser {
  id: string;
  externalId: string | null;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  username: string | null;
  emailAddresses: Array<{
    id: string;
    emailAddress: string;
    verification: {
      status: 'verified' | 'unverified' | 'transferable' | 'failed' | 'expired'; // Added 'expired'
      strategy: string;
      externalVerificationRedirectURL: string | URL | null;
      attempts: number | null;
      expireAt: number | null;
    } | null;
  }>;
  phoneNumbers: Array<{
    id: string;
    phoneNumber: string;
    verification: {
      status: 'verified' | 'unverified' | 'transferable' | 'failed' | 'expired'; // Added 'expired'
      strategy: string;
      externalVerificationRedirectURL: string | URL | null;
      attempts: number | null;
      expireAt: number | null;
    } | null;
  }>;
  web3Wallets: Array<{
    id: string;
    web3Wallet: string;
    verification: {
      status: 'verified' | 'unverified' | 'transferable' | 'failed' | 'expired'; // Added 'expired'
      strategy: string;
      externalVerificationRedirectURL: string | URL | null;
      attempts: number | null;
      expireAt: number | null;
    } | null;
  }>;
  primaryEmailAddressId: string | null;
  primaryPhoneNumberId: string | null;
  primaryWeb3WalletId: string | null;
  profileImageUrl?: string;
  imageUrl: string;
  hasImage: boolean;
  twoFactorEnabled: boolean;
  createdAt: number;
  updatedAt: number;
  lastSignInAt: number | null;
  publicMetadata: {
    role?: Roles;
    [key: string]: unknown;
  };
  privateMetadata: Record<string, unknown>;
  unsafeMetadata: Record<string, unknown>;
  gender?: string | null;
  birthday?: string | null;
  // ... other properties like `organizationMemberships`, `externalAccounts`, etc.
}

export interface SafeUser {
  id: string;
  firstName: string | null;
  lastName: string | null;
  fullName: string | null;
  email: string;
  imageUrl: string;
  role: Roles | "guest";
}