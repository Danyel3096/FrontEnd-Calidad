import { Component } from '@angular/core';
import { BootstrapValidationService } from '../../../services/bootstrap-validation.service';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-user-page',
  imports: [FormsModule],
  templateUrl: './user-page.component.html',
  styleUrl: './user-page.component.css'
})

export class UserPageComponent {
  constructor(private validationService: BootstrapValidationService) {}

  onSubmit(event: Event, form: NgForm): void {
    event.preventDefault();
    const htmlForm = event.target as HTMLFormElement; // Obtén el formulario HTML desde el evento
    if (this.validationService.validateForm(htmlForm)) {
      console.log('Formulario válido');
      // Aquí puedes agregar la lógica para enviar los datos
    } else {
      console.log('Formulario inválido');
    }
  }
}