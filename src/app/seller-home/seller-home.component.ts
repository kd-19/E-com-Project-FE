import { Component, OnInit } from '@angular/core';
import { ProductService } from '../services/product.service';
import { product } from '../data-type';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';



@Component({
  selector: 'app-seller-home',
  templateUrl: './seller-home.component.html',
  styleUrls: ['./seller-home.component.css']
})
export class SellerHomeComponent implements OnInit{
  productList:undefined | product[];
  productMessage:undefined | string;
  update=faPenToSquare;

  constructor(private product:ProductService){
      this.list();
  }

  ngOnInit(): void {
    
  }

  onDeleteClick(id:string): void {
    this.product.deleteProduct(id).subscribe((result)=>{
      if(result){
        this.productMessage="Product Deleted";
      }
      this.list();     
    })
      setTimeout(() => {
        this.productMessage=undefined;
      }, 3000);
  }

  list(){
    this.product.productList().subscribe((result)=>{
      console.warn(result);
      this.productList=result;
    })
  }

}
