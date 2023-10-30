import { Component, OnInit } from '@angular/core';
import { SellerService } from '../services/seller.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { SignUpDataType } from '../data-type';
import { LoginDataType } from '../data-type';

@Component({
  selector: 'app-seller-auth',
  templateUrl: './seller-auth.component.html',
  styleUrls: ['./seller-auth.component.css']
})
export class SellerAuthComponent {
  sellerSignUp: FormGroup;
  sellerLogin: FormGroup;
  showLogin=false;
  authError:string='';

  constructor(private seller:SellerService, private router:Router, private formBuilder:FormBuilder) {
    this.sellerSignUp = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.sellerLogin = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
   }

  ngOnInit():void{
    this.seller.reloadSeller();
  }

  signUp(data:SignUpDataType): void {
    if(this.sellerSignUp.valid){
      this.seller.userSignUp(data);
    }
    
  }

  Login(data:LoginDataType): void {
    this.authError="";
    if(this.sellerLogin.valid){
      this.seller.userLogin(data);
      this.seller.isLoginError.subscribe((error)=>{
        if(error){
          this.authError="Please enter valid details";
        }
     })
    }
   
  }

  openLogin(){
    this.showLogin=true;
  }

  openSignup(){
    this.showLogin=false;
  }

}
