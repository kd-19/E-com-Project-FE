import { Injectable , EventEmitter} from '@angular/core';
import { LoginDataType, SignUpDataType } from '../data-type';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  invalidUserAuth = new EventEmitter<boolean>(false);

  constructor(private http:HttpClient, private router:Router) {

   }

   userSignUp(user:SignUpDataType){
    this.http.post('http://localhost:3000/users/signup', user, {observe:'response'})
    .subscribe((result)=>{
      console.warn(result);
      if(result){
        localStorage.setItem('user',JSON.stringify(result.body));
        this.router.navigate(['/'])
      }
    })
   }

   userLogin(user:LoginDataType){
    const loginData = {email:user.email, password:user.password};
    this.http.post('http://localhost:3000/users/login', loginData ,{observe:'response'}).subscribe((result)=>{
      console.log(result);
    if(result && result.body ){
      
      this.invalidUserAuth.emit(false);
      localStorage.setItem('user',JSON.stringify(result.body));
        this.router.navigate(['/'])
    }
    else{
      this.invalidUserAuth.emit(true);
    }  
    
    })
   }

   userAuthRelaod(){
    if(localStorage.getItem('user')){
      this.router.navigate(['/']);
    }
   }
}

// ?email=${user.email}&&password=${user.password}