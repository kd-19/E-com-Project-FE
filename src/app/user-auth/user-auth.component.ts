import { Component, OnInit } from '@angular/core';
import { LoginDataType, SignUpDataType, product, cart } from '../data-type';
import { UserService } from '../services/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { parse } from '@fortawesome/fontawesome-svg-core';
import { ProductService } from '../services/product.service';

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


  constructor(private user: UserService, private formBuilder: FormBuilder, private product: ProductService) {
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
    this.user.invalidUserAuth.subscribe((result) => {
      if (result) {
        this.authError = "Please enter valid details";
      }
      else{
        this.localCartToRemoteCart();
      }
    });
  }
  openLogin() {
    this.showlogin = true;
  }

  openSignup() {
    this.showlogin = false;
  }

  localCartToRemoteCart() {
    let user = localStorage.getItem('user');
      let userId = user && JSON.parse(user).id;

    let data = localStorage.getItem('localCart');
    if (data) {
      let cartDataList: product[] = JSON.parse(data);
      
      cartDataList.forEach((product: product, index) => {
        let cartData: cart = {
          ...product,
          productId: product._id,
          userId
        };
        delete cartData._id;
        setTimeout(() => {

          this.product.addToCart(cartData).subscribe((result) => {
            if (result) {
              console.warn("Item stored in DataBase");
            }
          })

          if (cartDataList.length === index + 1) {
            localStorage.removeItem('localCart');
          }


        }, 500);

      });

    }

    setTimeout(() => {
      this.product.getCartList(userId);
    }, 1000);

  }
}
