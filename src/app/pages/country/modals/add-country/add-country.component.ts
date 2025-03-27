import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-country',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './add-country.component.html',
  styleUrls: ['./add-country.component.css'],
})
export class AddCountryComponent {
  @Input() isModalOpen = false; // Controla la visibilidad del modal
  @Output() countryAdded = new EventEmitter<any>(); // Emite cuando se agrega un país
  @Output() modalClosed = new EventEmitter<void>(); // Emite cuando se cierra el modal

  country = {
    name: '',
    code: ''
  };

  // Método para manejar cambios en los campos del formulario
  onFieldChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const fieldName = target.name;

    if (fieldName === 'Name') {
      this.country.name = target.value;
    } else if (fieldName === 'Code') {
      this.country.code = target.value;
    }
  }

  // Método para cerrar el modal
  closeModal(): void {
    this.modalClosed.emit(); // Emite el evento para cerrar el modal
  }

  // Método para manejar el envío del formulario
  onSubmit(): void {
    if (this.country.name && this.country.code) {
      console.log('Datos del país:', this.country);
      this.countryAdded.emit(this.country); // Emite el evento con los datos del país
      this.closeModal(); // Cierra el modal después de guardar
    } else {
      console.error('Por favor, completa todos los campos obligatorios.');
    }
  }
}
