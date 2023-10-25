import { Injectable } from '@angular/core';
import { SellerService } from './services/seller.service';
import { ActivatedRouteSnapshot, CanActivate } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class authGuard implements CanActivate {
  constructor(private sellerService: SellerService) {}

  canActivate(route: ActivatedRouteSnapshot) {
    const isAuthenticated = this.sellerService.isSellerLoggedIn;
    if (localStorage.getItem('seller')){
      return true
    }
    return isAuthenticated;
  }
}



