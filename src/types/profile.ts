export type Address = {
  line1?: string;
  line2?: string;
  city?: string;
  zip?: string;
  country?: string;
};

export interface ProfileDraft {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatarUrl?: string;
  address?: Address;
}

export interface SellerDraft extends ProfileDraft {
  storeName?: string;
  businessType?: string;
}
