import { Component, AfterViewInit } from '@angular/core';
import { BootstrapInitService } from '../../../services/bootstrap-init.service';
import { BootstrapValidationService } from '../../../services/bootstrap-validation.service';
import { FormsModule, NgForm } from '@angular/forms';
import * as bootstrap from 'bootstrap';

@Component({
  selector: 'app-user-page',
  imports: [FormsModule],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css'
})
export class UserPageComponent implements AfterViewInit {
  constructor(
    private validationService: BootstrapValidationService,
    private bootstrapInitService: BootstrapInitService
  ) {}

  ngAfterViewInit(): void {
    this.bootstrapInitService.initBootstrap(); // Inicializa tooltips y toasts

    // Agregar evento de click a los botones de Toast
    document.getElementById('showToast')?.addEventListener('click', () => this.showToast());
    document.getElementById('liveToastBtn')?.addEventListener('click', () => this.showToast());
  }

  onSubmit(event: Event, form: NgForm): void {
    event.preventDefault();
    const htmlForm = event.target as HTMLFormElement;
    if (this.validationService.validateForm(htmlForm)) {
      console.log('Formulario válido');
    } else {
      console.log('Formulario inválido');
    }
  }

  showToast(): void {
    const toastEl = document.getElementById('liveToast'); // Asegúrate de que el ID coincida con el HTML
    if (toastEl) {
      const toast = new bootstrap.Toast(toastEl);
      toast.show();
    }
  }
}
