import { HttpClient, HttpHeaders } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { product, order } from '../data-type';
import { cart } from '../data-type';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  

  constructor(private http: HttpClient, private tokenService:TokenService) { 
    
  }

  cartData= new EventEmitter<product[] | []>();
  addProduct(data:product){
    let headers = new HttpHeaders().set("Authorization",`${localStorage.getItem('token')}`);
    return this.http.post("http://localhost:3000/products/add", data,{headers});
  }

  productList(){

    return this.http.get<product[]>(`http://localhost:3000/products`);
  }

  deleteProduct(id:string){
    let headers = new HttpHeaders().set("Authorization",`${localStorage.getItem('token')}`);
    return this.http.delete(`http://localhost:3000/products/delete/${id}`,{headers});
  }

  getProduct(id:string){
    return this.http.get<product>(`http://localhost:3000/products/${id}`);
  }

  updateProduct(product:product){
    let headers = new HttpHeaders().set("Authorization",`${localStorage.getItem('token')}`);
    return this.http.put<product>(`http://localhost:3000/products/update/${product._id}`,product,{headers});
  }

  popularProducts(limit:number){
    return this.http.get<product[]>(`http://localhost:3000/products`);
  }

  trendyProducts(){
    return this.http.get<product[]>('http://localhost:3000/products');
  }

  searchProducts(query:string){
    return this.http.get<product[]>(`http://localhost:3000/products?q=${query}`);
  }

  localAddToCart(data:product){
    let cartData =[];
    let localCart=localStorage.getItem('localCart');
    if(!localCart){
      localStorage.setItem('localCart', JSON.stringify([data]))
      this.cartData.emit([data]);
    }
    else{
      cartData=JSON.parse(localCart);
      cartData.push(data);
      localStorage.setItem('localCart', JSON.stringify(cartData));
      this.cartData.emit(cartData);
    }
    
  }

  removeItemFromCart(productId:string){
    let cartData=localStorage.getItem('localCart');
    if(cartData){
      let items:product[]=JSON.parse(cartData);
      items=items.filter((item:product)=>productId!=item._id);
      localStorage.setItem('localCart', JSON.stringify(items));
      this.cartData.emit(items);
    }
  }

  addToCart(cartData:cart){
    let headers = new HttpHeaders().set("Authorization",`${localStorage.getItem('token')}`);
    return this.http.post("http://localhost:3000/cart/add", cartData,{headers});
  }

  getCartList(userId:string){
    
    return this.http.get<product[]>("http://localhost:3000/cart/get?userId="+userId, {observe:'response'}).subscribe((result)=>{
      if(result && result.body){
        this.cartData.emit(result.body); 
      }
    })
  }

  removeToCart(cartId:string){
    let headers = new HttpHeaders().set("Authorization",`${localStorage.getItem('token')}`);
    return this.http.delete(`http://localhost:3000/cart/remove/${cartId}`,{headers});
  }

  currentCart(){
    // let userStore=localStorage.getItem('user');

    let userStore = this.tokenService.decodeToken();
    let userDataId = userStore && JSON.stringify(userStore._id);
    console.log("Hey---->>",userDataId)
    return this.http.get<cart[]>("http://localhost:3000/cart/get?userId="+userDataId);
    
  }

  orderNow(data:order){
    let headers = new HttpHeaders().set("Authorization",`${localStorage.getItem('token')}`);
    return this.http.post('http://localhost:3000/orders',data,{headers});
  }

}
