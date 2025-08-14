export type Role = "CUSTOMER" | "SELLER" | "ADMIN";

export interface Address {
  line1?: string;
  line2?: string;
  city?: string;
  zip?: string;
  country?: string;
}

export interface BaseProfile {
  id: string;
  email: string;
  role: Role;
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string | null;
  address?: Address;
}

export interface SellerExtras {
  storeName?: string | null;
  businessType?: string | null;
}

export type CustomerProfile = BaseProfile;
export type SellerProfile = BaseProfile & SellerExtras;

export type MeResponse = {
  role: Role;
  profile: CustomerProfile | SellerProfile;
};
