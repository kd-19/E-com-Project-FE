import { EventEmitter, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { SignUpDataType } from '../data-type';
import { BehaviorSubject , Observable, Subject} from 'rxjs';
import { Router} from '@angular/router'
import { LoginDataType } from '../data-type';

@Injectable({
  providedIn: 'root'
})
export class SellerService {  

  isSellerLoggedIn = new BehaviorSubject<boolean>(false);
  private sellerAuthChanged = new Subject<boolean>();
  isLoginError =new EventEmitter<boolean>(false);
  

  constructor(private http: HttpClient, private router:Router) { }  

  userSignUp(data: SignUpDataType) {
    this.http.post('http://localhost:3000/seller/signup', data, { observe: 'response' }).subscribe((result) => {
      if(result instanceof HttpResponse){
        // this.isSellerLoggedIn.next(true);
      // localStorage.setItem('seller',JSON.stringify(result.body));
      const seller = result.body;
        this.handleAuthentication(seller);
      this.router.navigate(['seller-home']);
      }
      
    });
  }

  private handleAuthentication(seller: any): void {
    localStorage.setItem('token', seller.token);
    this.isSellerLoggedIn.next(true); 
    this.router.navigate(['seller-home']);
  }

  reloadSeller(){
    if(this.isSellerAuthenticated()){
      this.sellerAuthChanged.next(true);
      this.router.navigate(['seller-home']);
    }
  }

  userLogin(data: LoginDataType){
    const loginData = {email:data.email, password:data.password};
    this.http.post(`http://localhost:3000/seller/login`,loginData,
    { observe: 'response' }).subscribe((result) => {
      console.log("-->",result);
      if(result instanceof HttpResponse && result.body){

        // localStorage.setItem('seller',JSON.stringify(result.body));
        // this.isSellerLoggedIn.next(true);
        const seller = result.body
        this.handleAuthentication(seller);
        this.router.navigate(['seller-home']);
      }
      else{
        this.isLoginError.emit(true);
      }
    })
    console.warn(data);
  }

  getSellerAuthStatus(): Observable<boolean> {
    return this.isSellerLoggedIn.asObservable();
  }

  isSellerAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}
