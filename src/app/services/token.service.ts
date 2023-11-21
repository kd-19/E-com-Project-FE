import { Injectable } from '@angular/core';
import { JwtHelperService, JWT_OPTIONS  } from '@auth0/angular-jwt';

const jwtHelper = new JwtHelperService();

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  getToken():string | null{
    return localStorage.getItem('token');
  }

  decodeToken(): any | null {
    const token = this.getToken();

    if (token) {
      try {
        return jwtHelper.decodeToken(token);
      } catch (error) {
        console.error('Error decoding token:', error);
      }
    }

    return null;
  }
}
