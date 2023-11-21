import { Injectable , EventEmitter} from '@angular/core';
import { LoginDataType, SignUpDataType } from '../data-type';
import { HttpClient ,HttpResponse} from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  invalidUserAuth = new EventEmitter<boolean>(false);
  private userAuthChanged = new Subject<boolean>();

  constructor(private http:HttpClient, private router:Router) {

   }

   userSignUp(user:SignUpDataType){
    this.http.post('http://localhost:3000/users/signup', user, {observe:'response'})
    .subscribe((result)=>{
      console.warn(result);
      if(result instanceof HttpResponse){
        //localStorage.setItem('user',JSON.stringify(result.body));
        const user = result.body;
        this.handleAuthentication(user);
        this.router.navigate(['/'])
      }
    })
   }

   userLogin(user:LoginDataType){
    const loginData = {email:user.email, password:user.password};
    this.http.post('http://localhost:3000/users/login', loginData ,{observe:'response'}).subscribe((result)=>{
      console.log(result);
    if(result instanceof HttpResponse && result.body ){
      
      this.invalidUserAuth.emit(false);
      const user = result.body;
      this.handleAuthentication(user);
      //localStorage.setItem('user',JSON.stringify(result.body));
        this.router.navigate(['/'])
    }
    else{
      this.invalidUserAuth.emit(true);
    }  
    
    });
   }

   private handleAuthentication(user: any): void {
    localStorage.setItem('token', user.token);
    this.invalidUserAuth.emit(true); 
    this.router.navigate(['/']);
  }

   userAuthRelaod():void{
    if(this.isUserAuthenticated()){
      this.userAuthChanged.next(true);
      this.router.navigate(['/']);
    }
   }

   isUserAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }

  getUserAuthStatus(): Observable<boolean> {
    return this.userAuthChanged.asObservable();
  }

  logout(): void {
    localStorage.removeItem('token');
    this.userAuthChanged.next(false); 
  }
}

// ?email=${user.email}&&password=${user.password}
//localStorage.getItem('user')



