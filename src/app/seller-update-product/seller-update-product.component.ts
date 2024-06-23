import { Component ,OnInit} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../services/product.service';
import { product } from '../data-type';

@Component({
  selector: 'app-seller-update-product',
  templateUrl: './seller-update-product.component.html',
  styleUrls: ['./seller-update-product.component.css']
})
export class SellerUpdateProductComponent implements OnInit{
    productData:undefined|product;
    productMessage:undefined|string;

    constructor(private route:ActivatedRoute, private product:ProductService, private router:Router){

    }

    ngOnInit(): void {
     let productId =this.route.snapshot.paramMap.get('id');
     productId && this.product.getProduct(productId).subscribe((data)=>{
      this.productData=data;
     })
    }

    UpdateProduct(data:product){
      if(this.productData){
        data._id=this.productData._id;
      }
      this.product.updateProduct(data).subscribe((result)=>{
        if(result){
            this.productMessage="Product Updated Successfully"
        }
      })

      setTimeout(() => {
        this.productMessage=undefined;
        this.router.navigate(['/seller-home'])
      }, 3000);
    }
}
