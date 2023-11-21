import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { cart, product } from '../data-type';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { faBagShopping } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit {
  productData: undefined | product;
  cartData: undefined | product;
  cart = faCartPlus;
  bag = faBagShopping;
  plus = faPlus;
  minus = faMinus;
  productQuantity: number = 1;
  removeCart = false;
  lgoinMessage:undefined|string='';

  constructor(private activeRoute: ActivatedRoute, private product: ProductService, private tokenService:TokenService) { }

  ngOnInit(): void {
    let productId = this.activeRoute.snapshot.paramMap.get('productId');
    productId && this.product.getProduct(productId).subscribe((result) => {
      this.productData = result;

      let cartData = localStorage.getItem('localCart');
      if (productId && cartData) {
        let items = JSON.parse(cartData);
        items = items.filter((item: product) => productId === item._id.toString())
        if (items.length) {
          this.removeCart = true;
        }
        else {
          this.removeCart = false;
        }
      }
      // let user = localStorage.getItem('user');
      let user = this.tokenService.decodeToken();
      console.log(user);
      if (user) {
        let userId = user && JSON.parse(user)._id;
        this.product.getCartList(userId);
        this.product.cartData.subscribe((result) => {
          let item = result.filter((item: product) => productId?.toString() === item.productId?.toString())
          if (item.length) {
            this.cartData = item[0];
            this.removeCart = true;
          }
          else {
            this.removeCart = false; 
          }
        })
      }

    })
  }

  handleQuantity(val: string) {
    if (this.productQuantity < 20 && val === 'plus') {
      this.productQuantity += 1;
    }
    else if (this.productQuantity > 1 && val === 'minus') {
      this.productQuantity -= 1;
    }
  }

  AddToCart() {
    if (this.productData) {
      this.productData.quantity = this.productQuantity;

      if (!localStorage.getItem('token')) {
        // console.warn(this.productData);
        // this.product.localAddToCart(this.productData);
        // this.removeCart = true;
        this.lgoinMessage='Please login for Add item into Cart';
      
        setTimeout(() => {
          this.lgoinMessage=undefined;
        }, 3000);

      }

      else {
        // let user = localStorage.getItem('user');
        let user = this.tokenService.decodeToken();
        console.log("in Add to cart",user);
        // let userId = user && JSON.parse(user)._id;
        let userId = user && JSON.stringify(user._id); 

        console.log("user id is :",userId);
        
        let cartData: cart = {
          ...this.productData, userId,
          productId: this.productData._id
        }
        delete cartData._id;
        this.product.addToCart(cartData).subscribe( (result) => {
          if (result) {
            this.product.getCartList(userId);
            this.removeCart = true;
          }
        });
      }
    }
  }

  RemoveToCart(productId: string) {
    // if (!localStorage.getItem('user')) {
    //   this.product.removeItemFromCart(productId);
    //   this.removeCart = false;
    // }
    // else{
      // let user = localStorage.getItem('user');
      let user = this.tokenService.decodeToken();
      console.log("in remove to cart option",user);
      let userId = user && JSON.stringify(user._id);
      console.log("Data Removed Succesfully");
      this.cartData && this.product.removeToCart(this.cartData?._id).subscribe((result)=>{
        if(result){
          this.product.getCartList(userId);
          this.removeCart=false;
        }
      });
    }
  //}

    BuyNow(){
      if (!localStorage.getItem('user')) {
        this.lgoinMessage='Please login Buy Now option';
      
        setTimeout(() => {
          this.lgoinMessage=undefined;
        }, 3000);

      }
    }

}


