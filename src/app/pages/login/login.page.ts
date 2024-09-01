import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  loginForm!: FormGroup;


  constructor(public formBuilder: FormBuilder, public loadingConteoller: LoadingController, public authService: AuthService, public router : Router) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email :['', [
        Validators.required,
         Validators.email,
         Validators.pattern("[a-z0-9._%+\-]+@[a-z0-9.\-]+\.[a-z]{2,}$")
      ]],

      password:['',[
        Validators.required,
        Validators.pattern("(?=.*[a-z])(?=.*[0-9])(?=.*[A-Z]).{8,}")
      ]]
    })
  }
  get errorControl(){
    return this.loginForm.controls;
  }
  async login(){

    const loading = await this.loadingConteoller.create();
    await loading.present();
    if(this.loginForm.valid){
      const user = await this.authService.loginUser(this.loginForm.value.email, this.loginForm.value.password).catch((error)=>{
       console.log(error);
       loading.dismiss()
      })
      if(user){
       loading.dismiss()
       this.router.navigate(['/journals'])
      }else{
       console.log('provide correct values')
      }
     }
  }
   

}
