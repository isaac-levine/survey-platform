// Clerk webhook event types
export interface ClerkWebhookEvent {
  object: 'event';
  type: string;
  data: ClerkWebhookData;
}

export type ClerkWebhookData =
  | ClerkUserData
  | ClerkOrganizationData
  | ClerkOrganizationMembershipData;

export interface ClerkUserData {
  id: string;
  email_addresses?: Array<{ email_address: string }>;
  first_name?: string | null;
  last_name?: string | null;
  image_url?: string;
}

export interface ClerkOrganizationData {
  id: string;
  name: string;
  slug?: string;
  image_url?: string;
}

export interface ClerkOrganizationMembershipData {
  id: string;
  role: string;
  organization_id?: string;
  organization?: {
    id: string;
    name: string;
    slug?: string;
    image_url?: string;
  };
  public_user_data?: {
    user_id: string;
    identifier?: string;
    first_name?: string | null;
    last_name?: string | null;
    image_url?: string;
  };
}

export interface ClerkWebhookBody {
  object: 'event';
  type: string;
  data: ClerkWebhookData;
}
