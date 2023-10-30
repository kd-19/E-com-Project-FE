import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { faCartPlus } from '@fortawesome/free-solid-svg-icons';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faKeyboard } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { faList } from '@fortawesome/free-solid-svg-icons';
import { faSearch } from '@fortawesome/free-solid-svg-icons';
import { ProductService } from '../services/product.service';
import { product } from '../data-type';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  menuType:string='default';
  cart=faCartPlus;
  home=faHome;
  person=faUser;
  keyboard=faKeyboard;
  plus=faPlus;
  list=faList;
  search=faSearch;
  sellerName:string='';
  searchResult:undefined | product[];
  userName:string='';
  cartItems=0;

  

  constructor(private route:Router, private product:ProductService){}

  ngOnInit():void{
    this.route.events.subscribe((val:any)=>{
      if(val.url){
        if(localStorage.getItem('seller') && val.url.includes('seller')){
          this.menuType="seller";
          if(localStorage.getItem('seller')){
            let sellerStore=localStorage.getItem('seller');
            let sellerData = sellerStore && JSON.parse(sellerStore);
            this.sellerName=sellerData.name;
          }
        }

        else if(localStorage.getItem('user')){
          this.menuType="user";
          let userStore=localStorage.getItem('user');
          let userData = userStore && JSON.parse(userStore);
          this.userName=userData.name;
        }

        else{
          this.menuType="default";
        }
      }
    });

    let cartData=localStorage.getItem('localCart');
    if(cartData){
      this.cartItems=JSON.parse(cartData).length;
    }

    this.product.cartData.subscribe((item)=>{
      this.cartItems=item.length;
    })
  }

  logout(){
    localStorage.removeItem('seller');
    this.route.navigate(['/']);
  }

  userlogout(){
    localStorage.removeItem('user');
    this.route.navigate(['/user-auth']);
  }

  searchProduct(query:KeyboardEvent){
      if(query){
        const element=query.target as HTMLInputElement;
        this.product.searchProducts(element.value).subscribe((result)=>{
          result.length=3;
          this.searchResult=result;
          
        })

      }
  }

  hideSearch(){
    this.searchResult=[];
  }

  submitSearch(val:string){
    this.route.navigate([`search/${val}`]);  
  }

  redirectToDetails(id:number){
    this.route.navigate(['/details/'+id]);
  }
   
}
  