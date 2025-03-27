import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { StateService } from '../../../../services/state.service';

@Component({
  selector: 'app-update-city',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './update-city.component.html',
  styleUrl: './update-city.component.css',
})
export class UpdateCityComponent implements OnInit, OnChanges {
  @Input() isModalUpdateOpen = false; // Controla la visibilidad del modal
  @Input() selectedCity: any = null; // Recibe el país seleccionado
  @Output() cityUpdated = new EventEmitter<any>(); // Emite cuando se actualiza un país
  @Output() modalClosedUpdated = new EventEmitter<void>(); // Emite cuando se cierra el modal

  city = {
    CityID: '',
    Name: '',
    StateID: '',
  };

  states: any[] = [];

  constructor(private stateService: StateService) {}

  ngOnInit(): void {
    this.loadStates();
  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Cambios en el modal de actualización:', changes);
    if (changes['selectedCity'] && this.selectedCity) {
      // Actualiza los datos del país en el modal
      this.city = { ...this.selectedCity };
    }
  }

  loadStates(): void {
    this.stateService.getAllStates().subscribe(
      (data) => {
        this.states = Array.isArray(data.Data) ? data.Data : []; // Validamos que sea un array
      },
      (error) => {
        console.error('Error al obtener los departamentos:', error);
      }
    );
  }

  // Método para manejar cambios en los campos del formulario
  onFieldChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const fieldName = target.name;

    if (fieldName === 'Name') {
      this.city.Name = target.value;
    } else if (fieldName === 'StateID') {
      this.city.StateID = target.value;
    }
  }

  // Método para cerrar el modal
  closeModal(): void {
    this.modalClosedUpdated.emit(); // Emite el evento para cerrar el modal
  }

  // Método para manejar el envío del formulario
  onSubmit(): void {
    if (this.city.Name && this.city.StateID) {
      console.log('Datos de la ciudad a actualizar:', this.city);
      this.cityUpdated.emit(this.city); // Emite el evento con los datos del país
      this.closeModal(); // Cierra el modal después de guardar
    } else {
      console.error('Por favor, completa todos los campos obligatorios.');
    }
  }
}
