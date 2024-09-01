import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  email:any
  constructor(public authService: AuthService, public router : Router, private navCtrl: NavController) { }

  ngOnInit() {
  }
 
  async resetPassword(){

    this.authService.resetPassword(this.email).then(()=>{
      this.router.navigate(['/login'])
    }).catch((error)=>{
      console.log(error)
    })
  }
  goBack() {
    this.navCtrl.back(); // Funkcija za povratak
  } 
}
