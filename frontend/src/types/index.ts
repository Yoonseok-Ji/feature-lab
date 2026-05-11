export interface Memo {
  id: number;
  content: string;
  owner_id: number;
}

export interface Token {
  access_token: string;
  refresh_token: string;
  token_type: string;
}
