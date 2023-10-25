import { Component, OnInit } from '@angular/core';
import { SellerService } from '../services/seller.service';
import { Router } from '@angular/router';
import { SignUpDataType } from '../data-type';
import { LoginDataType } from '../data-type';

@Component({
  selector: 'app-seller-auth',
  templateUrl: './seller-auth.component.html',
  styleUrls: ['./seller-auth.component.css']
})
export class SellerAuthComponent {
  showLogin=false;
  authError:string='';

  constructor(private seller:SellerService, private router:Router) { }

  ngOnInit():void{
    this.seller.reloadSeller();
  }

  signUp(data:SignUpDataType): void {
    this.seller.userSignUp(data);
  }

  Login(data:LoginDataType): void {
    this.authError="";
   this.seller.userLogin(data);
   this.seller.isLoginError.subscribe((error)=>{
      if(error){
        this.authError="Please enter valid items";
      }
   })
  }

  openLogin(){
    this.showLogin=true;
  }

  openSignup(){
    this.showLogin=false;
  }

}
