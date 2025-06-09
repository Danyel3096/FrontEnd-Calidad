import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
  standalone: true,
  selector: 'app-theme-section-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './theme-section-form.component.html',
  styleUrl: './theme-section-form.component.css'
})
export class ThemeSectionFormComponent {
  @Input() sectionName!: string;
  @Input() formGroup!: FormGroup;

  @Output() formSubmitted = new EventEmitter<void>();

  onSubmit() {
    if (this.formGroup.valid) {
      this.formSubmitted.emit();
    }
  }

  isColorField(key: string): boolean {
    return this.formGroup.controls[key]?.value?.startsWith?.('#');
  }
}
