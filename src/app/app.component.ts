import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor( public authService: AuthService, public router : Router) {}

  signOut(){

    this.authService.signOut()
    this.router.navigate(['/login'])
  }
}
