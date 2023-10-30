import { Component, OnInit } from '@angular/core';
import { LoginDataType, SignUpDataType } from '../data-type';
import { UserService } from '../services/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-user-auth',
  templateUrl: './user-auth.component.html',
  styleUrls: ['./user-auth.component.css']
})
export class UserAuthComponent implements OnInit {
  showlogin = false;
  userSignUp: FormGroup;
  userLogin: FormGroup;
  authError: string = '';


  constructor(private user: UserService, private formBuilder: FormBuilder) {
    this.userSignUp = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });

    this.userLogin = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    this.user.userAuthRelaod();
  }

  signUp(data: SignUpDataType) {
    this.user.userSignUp(data);
  }

  Login(data: LoginDataType) {
    this.authError = "";
    this.user.userLogin(data);
    this.user.isLoginError.subscribe((error) => {
      if (error) {
        this.authError = "Please enter valid details";
      }
    });
  }
  openLogin() {
    this.showlogin = true;
  }

  openSignup() {
    this.showlogin = false;
  }
}
