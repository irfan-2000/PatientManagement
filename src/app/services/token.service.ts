import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
@Injectable({
  providedIn: 'root'
})
export class TokenService {

  constructor() { }

  TOKEN_KEY = 'token'

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  decodeToken():any {
    const token = this.getToken();
    if (!token) return null;

    try {
      return jwtDecode(token);
    } catch (error) {
      console.error('Invalid token:', error);
      return null;
    }
  }

  isTokenExpired(): boolean {
    const decoded = this.decodeToken();
    if (!decoded || !decoded.exp) return true;

    return decoded.exp * 1000 < Date.now();
  }
}
