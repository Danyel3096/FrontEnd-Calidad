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
    username: '',
    password: '',
  };

  inputError = {
    username: false,
    password: false
  };

  constructor(private loginService: LoginService, private router: Router) { }

  ngOnInit(): void { }

  formSubmit() {
    this.inputError.username = this.loginData.username.trim() === '';
    this.inputError.password = this.loginData.password.trim() === '';

    if (this.inputError.username || this.inputError.password) {
      this.showAlert();
      return;
    }

    this.loginService.generateToken(this.loginData).subscribe(
      (data: any) => {
        console.log(data);
        this.loginService.loginUser(data.token);
        this.loginService.getCurrentUser().subscribe((user: any) => {
          this.loginService.setUser(user);
          console.log(user);

          if (this.loginService.getUserRole() == 'ADMIN') {
            this.router.navigate(['admin']);
            this.loginService.loginStatusSubjec.next(true);
          } else if (this.loginService.getUserRole() == 'NORMAL') {
            this.router.navigate(['user-dashboard']);
            this.loginService.loginStatusSubjec.next(true);
          } else {
            this.loginService.logout();
          }
        });
      }, (error) => {
        console.log(error);
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

  // ✅ Función corregida para limpiar los campos al hacer clic en "Borrar"
  resetFields() {
    this.loginData.username = '';
    this.loginData.password = '';
    this.inputError.username = false;
    this.inputError.password = false;
  }
}
