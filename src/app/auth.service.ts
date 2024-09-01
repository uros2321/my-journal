import { Injectable } from '@angular/core';
import firebase from 'firebase/compat';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import User = firebase.User;
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(public fireAuth: AngularFireAuth) { }

  async registerUser(email: string, password:string){

    return await this.fireAuth.createUserWithEmailAndPassword(email, password)
  }
  async loginUser(email: string, password: string){
    return await this.fireAuth.signInWithEmailAndPassword(email, password)
  }

  async resetPassword(email: string){
    return await this.fireAuth.sendPasswordResetEmail(email)

  }

  async signOut(){ 
    return await this.fireAuth.signOut()
  }

  async getProfile(){
    return new Promise<User | null>((resolve, reject)=>{

      this.fireAuth.onAuthStateChanged(user=>{
        if(user){
          resolve(user)
        }else{
          resolve(null)
        }
      }, reject)
        })


    
  }
}
