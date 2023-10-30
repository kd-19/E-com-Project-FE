import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { product } from '../data-type';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { faBagShopping } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faMinus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.css']
})
export class ProductDetailsComponent implements OnInit{
  productData:undefined |product;
  cart=faCartPlus;
  bag=faBagShopping;
  plus=faPlus;
  minus=faMinus;
  productQuantity:number=1;
  removeCart=false;
  
  constructor(private activeRoute:ActivatedRoute, private product:ProductService){}

  ngOnInit(): void {
    let productId= this.activeRoute.snapshot.paramMap.get('productId');
    productId && this.product.getProduct(productId).subscribe((result)=>{
      this.productData=result;

      let cartData=localStorage.getItem('localCart');
      if(productId && cartData){
        let items=JSON.parse(cartData);
        items=items.filter((item:product)=>productId==item.id.toString())
        if(items.length){
          this.removeCart=true;
        }
        else{
          this.removeCart=false;
        }
      }

    })
  }

  handleQuantity(val:string){
    if(this.productQuantity < 20 && val==='plus'){
      this.productQuantity+=1;
    }
    else if(this.productQuantity> 1 && val==='minus'){
      this.productQuantity-=1;
    }
  }

  AddToCart(){
    if(this.productData){
      this.productData.quantity=this.productQuantity;
      
      if(!localStorage.getItem('user')){
        console.warn(this.productData);
        this.product.localAddToCart(this.productData);
        this.removeCart=true;
      }
    }
  }

  RemoveToCart(productId:number){
    this.product.removeItemFromCart(productId);
    this.removeCart=false;
  }
}
