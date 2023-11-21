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
import { TokenService } from '../services/token.service';


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

  // && val.url.includes('seller')

  constructor(private route:Router, private product:ProductService,private tokenService:TokenService){}

  ngOnInit():void{
    this.route.events.subscribe((val:any)=>{
      if(val.url){
        if(localStorage.getItem('token') && val.url.includes('seller')){
          this.menuType="seller";
            // let sellerStore=localStorage.getItem('token');
            // let sellerData = sellerStore && JSON.parse(sellerStore);
            // this.sellerName=sellerData.name;

            let SellerData = this.tokenService.decodeToken();
            this.sellerName=SellerData.name;
        }

        else if(localStorage.getItem('token') ){
          //const token=localStorage.getItem('token');
          this.menuType="user";
          //console.log("Token is: ",token)
          //let userStore=localStorage.getItem('token');
          //let userData = userStore && JSON.parse(userStore);
          let userData = this.tokenService.decodeToken();
          this.userName=userData.name;
          this.product.getCartList(userData.id);
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
    localStorage.removeItem('token');
    this.route.navigate(['/']);
  }

  userlogout(){
    localStorage.removeItem('token');
    this.route.navigate(['/user-auth']);
    this.product.cartData.emit([]);
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

  redirectToDetails(id:string){
    this.route.navigate(['/details/'+id]);
  }
   
}
  