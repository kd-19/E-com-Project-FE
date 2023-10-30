import { Injectable , EventEmitter} from '@angular/core';
import { LoginDataType, SignUpDataType } from '../data-type';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  isLoginError = new EventEmitter<boolean>(false);

  constructor(private http:HttpClient, private router:Router) {

   }

   userSignUp(user:SignUpDataType){
    this.http.post('http://localhost:3000/users', user, {observe:'response'})
    .subscribe((result)=>{
      console.warn(result);
      if(result){
        localStorage.setItem('user',JSON.stringify(result.body));
        this.router.navigate(['/'])
      }
    })
   }

   userLogin(user:LoginDataType){
    this.http.get<SignUpDataType[]>(`http://localhost:3000/users?email=${user.email}&&password=${user.password}`,{observe:'response'}).subscribe((result)=>{
    if(result && result.body && result.body.length){
      localStorage.setItem('user',JSON.stringify(result.body[0]));
        this.router.navigate(['/'])
    }
    else{
      this.isLoginError.emit(true);
    }  
    
    })
   }

   userAuthRelaod(){
    if(localStorage.getItem('user')){
      this.router.navigate(['/']);
    }
   }
}
