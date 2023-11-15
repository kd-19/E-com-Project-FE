import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { product, order } from '../data-type';
import { cart } from '../data-type';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { 
    
  }

  cartData= new EventEmitter<product[] | []>();
  addProduct(data:product){
    return this.http.post("http://localhost:3000/products/add", data);
  }

  productList(){
    return this.http.get<product[]>(`http://localhost:3000/products`);
  }

  deleteProduct(id:string){
    return this.http.delete(`http://localhost:3000/products/delete/${id}`);
  }

  getProduct(id:string){
    return this.http.get<product>(`http://localhost:3000/products/${id}`);
  }

  updateProduct(product:product){
    return this.http.put<product>(`http://localhost:3000/products/update/${product._id}`,product);
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
    return this.http.post("http://localhost:3000/cart/add", cartData);
  }

  getCartList(userId:string){
    return this.http.get<product[]>("http://localhost:3000/cart/get?userId="+userId, {observe:'response'}).subscribe((result)=>{
      if(result && result.body){
        this.cartData.emit(result.body); 
      }
    })
  }

  removeToCart(cartId:string){
    return this.http.delete(`http://localhost:3000/cart/remove/${cartId}`);
  }

  currentCart(){
    let userStore=localStorage.getItem('user');
    let userData = userStore && JSON.parse(userStore);
    return this.http.get<cart[]>("http://localhost:3000/cart/get?userId="+userData.user._id);
  }

  orderNow(data:order){
    return this.http.post('http://localhost:3000/orders',data)
  }

}
