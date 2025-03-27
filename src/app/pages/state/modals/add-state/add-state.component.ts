import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CountryService } from '../../../../services/country.service';

@Component({
  selector: 'app-add-state',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './add-state.component.html',
  styleUrl: './add-state.component.css'
})
export class AddStateComponent implements OnInit {
  @Input() isModalOpen = false; // Controla la visibilidad del modal
  @Output() stateAdded = new EventEmitter<any>(); // Emite cuando se agrega un país
  @Output() modalClosed = new EventEmitter<void>(); // Emite cuando se cierra el modal

  state = {
    name: '',
    CountryID: ''
  };
  countries: any[] = [];

  constructor(private countryService: CountryService) {}

  ngOnInit(): void {
    this.loadCountries();
  }

  // Método para manejar cambios en los campos del formulario
  onFieldChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const fieldName = target.name;

    if (fieldName === 'Name') {
      this.state.name = target.value;
    } else if (fieldName === 'CountryID') {
      this.state.CountryID = target.value;
    }
  }

  loadCountries(): void {
    this.countryService.getAllCountries().subscribe(
      (data) => {
        this.countries = Array.isArray(data.Data) ? data.Data : []; // Validamos que sea un array
      },
      (error) => {
        console.error('Error al obtener los paises:', error);
      }
    );
  }

  // Método para cerrar el modal
  closeModal(): void {
    this.modalClosed.emit(); // Emite el evento para cerrar el modal
  }

  // Método para manejar el envío del formulario
  onSubmit(): void {
    if (this.state.name && this.state.CountryID) {
      console.log('Datos del departamento:', this.state);
      this.stateAdded.emit(this.state); // Emite el evento con los datos del país
      this.closeModal(); // Cierra el modal después de guardar
    } else {
      console.error('Por favor, completa todos los campos obligatorios.');
    }
  }
}
