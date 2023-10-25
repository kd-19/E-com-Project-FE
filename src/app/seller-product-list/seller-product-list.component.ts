import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { product } from '../data-type';

@Component({
  selector: 'app-seller-product-list',
  templateUrl: './seller-product-list.component.html',
  styleUrls: ['./seller-product-list.component.css']
})
export class SellerProductListComponent implements OnInit {
  addProductMessage:string | undefined;

  constructor(private product:ProductService){}

  ngOnInit(): void {
    
  }

  AddProduct(data:product){
    this.product.addProduct(data).subscribe((result)=>{
      console.warn(result);
      if(result){
        this.addProductMessage="Product Added Successfully";
      }
      setTimeout(()=>{
        this.addProductMessage=undefined
      },3000)
    })
  }

}
