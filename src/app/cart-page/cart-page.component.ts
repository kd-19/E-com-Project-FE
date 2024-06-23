import { Component, OnInit } from '@angular/core';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { product, cart, priceSummary } from '../data-type';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';
import { TokenService } from '../services/token.service';

@Component({
  selector: 'app-cart-page',
  templateUrl: './cart-page.component.html',
  styleUrls: ['./cart-page.component.css']
})
export class CartPageComponent implements OnInit {
  cart = faCartPlus;
  cartData: cart[] | undefined;
  priceSummary: priceSummary = {
    price:0,
    discount:0,
    tax:0,
    delivery:0,
    total:0
  }

  constructor(private product: ProductService, private router:Router,private tokenService:TokenService) { }

  ngOnInit(): void {
    this.reloadCart();
  }

  checkout(){
    this.router.navigate(['/checkout'])
  }

  removeToCart(cartId:string|undefined){
    // let user = localStorage.getItem('user');   
    let user = this.tokenService.decodeToken();
      let userId = user && JSON.stringify(user._id);
      console.log("Product deleted");

      if (cartId && this.cartData) {
        this.product.removeToCart(cartId).subscribe(
          (result) => {
            console.log('Server response:', result);
            if (result) {
              // Update local cart data
              this.cartData = (this.cartData ?? []).filter(item => item._id !== cartId);
              
              // Trigger UI update
              this.reloadCart();
            }
          },
          (error) => {
            console.error('Error removing product from cart:', error);
          }
        );
      }

      // cartId && this.cartData && this.product.removeToCart(cartId).subscribe((result)=>{
      //   if(result){
      //     this.product.getCartList(userId);
      //     this.reloadCart();
      //   }
      // });
  }


  reloadCart(){
    this.product.currentCart().subscribe((result) => {
      this.cartData = result;
      let price = 0;
      result.forEach((item) => {
        if(item.quantity)
        price = price + (+item.price* + item.quantity);
      });
      
      this.priceSummary.price=price;
      this.priceSummary.discount=price/10;
      this.priceSummary.tax=(price*18)/100;
      this.priceSummary.delivery=70;
      this.priceSummary.total=(this.priceSummary.price)+(this.priceSummary.tax)+(this.priceSummary.delivery=70)-(this.priceSummary.discount=price/10);

      if(!this.cartData.length){
        this.router.navigate(['/'])
      }

    });
  }

}
