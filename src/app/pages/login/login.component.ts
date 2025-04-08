import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from './../../services/login.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import * as bootstrap from 'bootstrap';

@Component({
  standalone: true,
  imports: [FormsModule, CommonModule],
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginData = {
    username: 'mor_2314',
    password: '83r5^_'
  };

  inputError = {
    username: false,
    password: false
  };

  constructor(private loginService: LoginService, private router: Router) {}

  ngOnInit(): void {}

  formSubmit() {
    this.inputError.username = this.loginData.username.trim() === '';
    this.inputError.password = this.loginData.password.trim() === '';

    if (this.inputError.username || this.inputError.password) {
      this.showAlert();
      return;
    }

    this.loginService.generateToken(this.loginData).subscribe(
      (data: any) => {
        this.loginService.loginUser(data.token);

        const fakeUser = {
          username: this.loginData.username,
          authorities: [{ authority: 'NORMAL' }]
        };

        this.loginService.setUser(fakeUser);
        const role = this.loginService.getUserRole();

        this.showSuccess(); // ✅ Muestra modal de éxito

        if (role === 'ADMIN') {
          this.router.navigate(['admin-dashboard']);
        } else if (role === 'NORMAL') {
          this.router.navigate(['admin-dashboard']);
        }

        this.loginService.loginStatusSubject.next(true);
      },
      (error) => {
        console.error('Login fallido:', error);
        this.showAlert('Credenciales inválidas, intente nuevamente.');
      }
    );
  }

  showAlert(message: string = 'Por favor, completa todos los campos.') {
    const modalElement = document.getElementById('alertModal');
    if (modalElement) {
      (modalElement.querySelector('.modal-body p') as HTMLElement).innerText = message;
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  showSuccess() {
    const modalElement = document.getElementById('successModal');
    if (modalElement) {
      const modal = new bootstrap.Modal(modalElement);
      modal.show();
    }
  }

  resetFields() {
    this.loginData.username = '';
    this.loginData.password = '';
    this.inputError.username = false;
    this.inputError.password = false;
  }
}
