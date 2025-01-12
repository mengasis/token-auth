export interface User {
    id: string;
    username: string;
    password: string;
  }
  
  export interface Token {
    id: string;
    userId: string;
    refreshToken: string;
    expiresAt: string;
    createdAt: string;
  }