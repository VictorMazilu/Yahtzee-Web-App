import { Component, EventEmitter, Output } from '@angular/core';
import { AuthService } from '../auth.service';
import TokenStore from '../token'; // Import the TokenStore class

@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.css'
})
export class LogoutComponent {

  @Output() userLoggedIn = new EventEmitter<boolean>();
  
  constructor(private authService: AuthService) { }

  logout(): void {
    TokenStore.clearToken();
    this.userLoggedIn.emit(false);
    console.log('Logged out successfully.');
  }
}