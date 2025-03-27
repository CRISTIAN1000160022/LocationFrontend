import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StateService } from '../../../../services/state.service';

@Component({
  selector: 'app-add-city',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './add-city.component.html',
  styleUrl: './add-city.component.css',
})
export class AddCityComponent implements OnInit {
  @Input() isModalOpen = false; // Controla la visibilidad del modal
  @Output() cityAdded = new EventEmitter<any>(); // Emite cuando se agrega un país
  @Output() modalClosed = new EventEmitter<void>(); // Emite cuando se cierra el modal

  city = {
    name: '',
    StateID: '',
  };
  states: any[] = [];

  constructor(private stateService: StateService) {}

  ngOnInit(): void {
    this.loadStates();
  }

  // Método para manejar cambios en los campos del formulario
  onFieldChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const fieldName = target.name;

    if (fieldName === 'Name') {
      this.city.name = target.value;
    } else if (fieldName === 'StateID') {
      this.city.StateID = target.value;
    }
  }

  loadStates(): void {
    this.stateService.getAllStates().subscribe(
      (data) => {
        this.states = Array.isArray(data.Data) ? data.Data : []; // Validamos que sea un array
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
    if (this.city.name && this.city.StateID) {
      console.log('Datos de la ciudad:', this.city);
      this.cityAdded.emit(this.city); // Emite el evento con los datos del país
      this.closeModal(); // Cierra el modal después de guardar
    } else {
      console.error('Por favor, completa todos los campos obligatorios.');
    }
  }
}
