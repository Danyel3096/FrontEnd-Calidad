import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { DynamicCardComponent } from '../../components/dynamic-card/dynamic-card.component';

@Component({
  selector: 'app-about',
  imports: [CommonModule], //DynamicCardComponent ERROR PENDIENTE
  templateUrl: './about.component.html',
  styleUrl: './about.component.css'
})
export class AboutComponent {
  teamMembers = [
    {
      name: 'Fernando Martínez',
      role: 'Administrador',
      image: 'assets/team/fernando.png'
    },
    {
      name: 'Lucía Gómez',
      role: 'Cajera',
      image: 'assets/team/lucia.png'
    },
    {
      name: 'Diego Ruiz',
      role: 'Bodeguero',
      image: 'assets/team/diego.png'
    }
  ];

}
