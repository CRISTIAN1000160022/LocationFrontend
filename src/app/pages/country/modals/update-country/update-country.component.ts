import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-country',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './update-country.component.html',
  styleUrl: './update-country.component.css',
})
export class UpdateCountryComponent implements OnChanges {
  @Input() isModalUpdateOpen = false; // Controla la visibilidad del modal
  @Input() selectedCountry: any = null; // Recibe el país seleccionado
  @Output() countryUpdated = new EventEmitter<any>(); // Emite cuando se actualiza un país
  @Output() modalClosedUpdated = new EventEmitter<void>(); // Emite cuando se cierra el modal

  country = {
    CountryID: '',
    Name: '',
    Code: '',
  };

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Cambios en el modal de actualización:', changes);
    if (changes['selectedCountry'] && this.selectedCountry) {
      // Actualiza los datos del país en el modal
      this.country = { ...this.selectedCountry };
    }
  }

  // Método para manejar cambios en los campos del formulario
  onFieldChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const fieldName = target.name;

    if (fieldName === 'Name') {
      this.country.Name = target.value;
    } else if (fieldName === 'Code') {
      this.country.Code = target.value;
    }
  }

  // Método para cerrar el modal
  closeModal(): void {
    this.modalClosedUpdated.emit(); // Emite el evento para cerrar el modal
  }

  // Método para manejar el envío del formulario
  onSubmit(): void {
    if (this.country.Name && this.country.Code) {
      console.log('Datos del país a actualizar:', this.country);
      this.countryUpdated.emit(this.country); // Emite el evento con los datos del país
      this.closeModal(); // Cierra el modal después de guardar
    } else {
      console.error('Por favor, completa todos los campos obligatorios.');
    }
  }
}
