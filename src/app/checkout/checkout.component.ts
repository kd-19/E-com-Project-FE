import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProductService } from '../services/product.service';
import { order } from '../data-type';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {
  orderData: FormGroup;
  totalPrice: number | undefined;

  constructor(private product: ProductService, private formBuilder: FormBuilder) {
    this.orderData = this.formBuilder.group({
      address: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      contact: ['', [Validators.required, Validators.pattern("^((\\+91-?)|0)?[0-9]{10}$")]],
    });
  }

  ngOnInit(): void {
    this.product.currentCart().subscribe((result) => {
      let price = 0;
      result.forEach((item) => {
        if (item.quantity)
          price = price + (+item.price * + item.quantity);
      });


      this.totalPrice = (price) + ((price * 18) / 100) + (70) - (price / 10);

    });

  }

  orderNow(data: order) {
    let user = localStorage.getItem('user');
    let userId = user && JSON.parse(user).id;

    if (this.totalPrice) {
      let orderData: order = {
        ...data,
        totalPrice: this.totalPrice,
        userId
      }
      this.product.orderNow(orderData).subscribe((result)=>{
        if(result){
          console.warn(result);
        }
      })
    }
  }
}
