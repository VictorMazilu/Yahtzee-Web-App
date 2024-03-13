import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from '../auth.service';
import TokenStore  from '../token'; // Import the TokenStore class

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  
  @Output() userLoggedIn = new EventEmitter<boolean>();

  username = '';
  password = '';

  constructor(private authService: AuthService) { }

  login(): void {
    this.authService.login(this.username, this.password).subscribe(
      response => {
        // Handle successful login (e.g., store token in the store)
        TokenStore.setToken(response.token); // Use the TokenStore class
        this.userLoggedIn.emit(true);
        console.log('Logged in successfully. Token:', response.token);
      },
      error => {
        // Handle login error
        console.error('Login error:', error);
      }
    );
  }
}
