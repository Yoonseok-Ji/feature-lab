export interface Memo {
  id: number;
  content: string;
  image_url: string | null;
  owner_id: number;
  owner_email: string;
}

export interface Token {
  access_token: string;
  refresh_token: string;
  token_type: string;
}
