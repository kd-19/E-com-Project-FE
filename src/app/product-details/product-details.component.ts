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
  
  constructor(private activeRoute:ActivatedRoute, private product:ProductService){}

  ngOnInit(): void {
    let productId= this.activeRoute.snapshot.paramMap.get('productId');
    console.warn(productId);
    productId && this.product.getProduct(productId).subscribe((result)=>{
      console.warn(result);
      this.productData=result;
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
}
