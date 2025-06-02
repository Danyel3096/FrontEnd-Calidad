import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import Swal from 'sweetalert2';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '../../material/material.module';
import { UserService } from './../../services/user.service';
import { User } from '../../interfaces/user.interface';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule
  ]
})
export class SignupComponent implements OnInit {

  user: User = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    address: '',
    createdAt: '',
    role: 'CUSTOMER',
    photoUrl: 'https://images.vexels.com/content/145908/preview/male-avatar-maker-2a7919.png', // solo url
    phoneNumber: '',
    status: true,
  };

  imagePreview: string | ArrayBuffer | null = null;

  errores = {
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    phoneNumber: false
  };

  constructor(
    private userService: UserService,
    private snack: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {}

  // Si quieres eliminar esta función, la puedes borrar completamente
  // onImageSelected(event: Event): void {
  //   // aquí quitamos la lógica de archivos
  // }

  formSubmit() {
    // Validaciones
    let camposVacios = false;

    if (this.user.firstName.trim() === '') {
      this.errores.firstName = true;
      camposVacios = true;
    } else {
      this.errores.firstName = false;
    }
    if (this.user.lastName.trim() === '') {
      this.errores.lastName = true;
      camposVacios = true;
    } else {
      this.errores.lastName = false;
    }
    if (this.user.email.trim() === '') {
      this.errores.email = true;
      camposVacios = true;
    } else {
      this.errores.email = false;
    }
    if (this.user.password.trim() === '') {
      this.errores.password = true;
      camposVacios = true;
    } else {
      this.errores.password = false;
    }
    if (this.user.phoneNumber.trim() === '') {
      this.errores.phoneNumber = true;
      camposVacios = true;
    } else {
      this.errores.phoneNumber = false;
    }

    if (camposVacios) {
      Swal.fire({
        icon: 'warning',
        title: 'Campos vacíos',
        text: 'Por favor completa todos los campos obligatorios.'
      });
      return;
    }

    // Armar objeto usuario para enviar (con photoUrl como string)
    const userPayload = {
      firstName: this.user.firstName,
      lastName: this.user.lastName,
      email: this.user.email,
      password: this.user.password,
      role: this.user.role,
      phoneNumber: this.user.phoneNumber,
      status: this.user.status,
      address: this.user.address || '',
      createdAt: new Date().toISOString(),
      photoUrl: this.user.photoUrl // sólo url aquí
    };

    // Llamar servicio con JSON
    this.userService.createUser(userPayload).subscribe(
      () => {
        Swal.fire('Éxito', 'Usuario registrado correctamente', 'success').then(() => {
          this.router.navigate(['/login']);
        });

        // Limpiar formulario
        this.user = {
          firstName: '',
          lastName: '',
          email: '',
          password: '',
          address: '',
          createdAt: '',
          role: 'CUSTOMER',
          photoUrl: 'https://images.vexels.com/content/145908/preview/male-avatar-maker-2a7919.png',
          phoneNumber: '',
          status: true,
        };
        this.imagePreview = null;
      },
      () => {
        Swal.fire('Error', 'No se pudo registrar el usuario', 'error');
      }
    );
  }
}
