import { Component, OnInit } from '@angular/core';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { product, cart, priceSummary } from '../data-type';
import { ProductService } from '../services/product.service';
import { Router } from '@angular/router';

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

  constructor(private product: ProductService, private router:Router) { }

  ngOnInit(): void {
    this.reloadCart();
  }

  checkout(){
    this.router.navigate(['/checkout'])
  }

  removeToCart(cartId:string|undefined){
    let user = localStorage.getItem('user');
      let userId = user && JSON.parse(user).user._id;
      cartId && this.cartData && this.product.removeToCart(cartId).subscribe((result)=>{
        if(result){
          this.product.getCartList(userId);
          this.reloadCart();
        }
      });
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
