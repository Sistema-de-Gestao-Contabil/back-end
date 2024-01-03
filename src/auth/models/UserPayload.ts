export interface UserPayload {
  sub: number;
  email: string;
  roles: string;
  iat?: number;
  exp?: number;
}
