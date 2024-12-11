import { Component } from '@angular/core';
import {FormsModule} from "@angular/forms";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  standalone: true,
  imports: [
    FormsModule,
    NgIf
  ],
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  errorMessage: string = '';

  // Hardcoded gebruikersgegevens
  private readonly users = [
    { username: 'gebruiker', password: '123', role: 'Gebruiker' },
    { username: 'redacteur', password: '123', role: 'Redacteur' }
  ];

  login() {
    const user = this.users.find(
      u => u.username === this.username && u.password === this.password
    );

    if (user) {
      this.errorMessage = '';
      localStorage.setItem('userRole', user.role); // Sla de rol op
      alert(`Welkom ${user.username}! Je rol is: ${user.role}`);
      // Navigeer naar de homepagina of een andere route
    } else {
      this.errorMessage = 'Ongeldige gebruikersnaam of wachtwoord!';
    }
  }

}
