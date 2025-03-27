import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CountryService } from '../../../../services/country.service';

@Component({
  selector: 'app-update-state',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './update-state.component.html',
  styleUrl: './update-state.component.css'
})
export class UpdateStateComponent implements OnInit,OnChanges {
  @Input() isModalUpdateOpen = false; // Controla la visibilidad del modal
  @Input() selectedState: any = null; // Recibe el país seleccionado
  @Output() stateUpdated = new EventEmitter<any>(); // Emite cuando se actualiza un país
  @Output() modalClosedUpdated = new EventEmitter<void>(); // Emite cuando se cierra el modal

  state = {
    StateID: '',
    Name: '',
    CountryID: '',
  };

  
  countries: any[] = [];

  constructor(private countryService: CountryService) {}

  ngOnInit(): void {
    this.loadCountries();
  }


  ngOnChanges(changes: SimpleChanges): void {
    console.log('Cambios en el modal de actualización:', changes);
    if (changes['selectedState'] && this.selectedState) {
      // Actualiza los datos del país en el modal
      this.state = { ...this.selectedState };
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

  // Método para manejar cambios en los campos del formulario
  onFieldChange(event: Event): void {
    const target = event.target as HTMLInputElement;
    const fieldName = target.name;

    if (fieldName === 'Name') {
      this.state.Name = target.value;
    } else if (fieldName === 'Code') {
      this.state.CountryID = target.value;
    }
  }

  // Método para cerrar el modal
  closeModal(): void {
    this.modalClosedUpdated.emit(); // Emite el evento para cerrar el modal
  }

  // Método para manejar el envío del formulario
  onSubmit(): void {
    if (this.state.Name && this.state.CountryID) {
      console.log('Datos del país a actualizar:', this.state);
      this.stateUpdated.emit(this.state); // Emite el evento con los datos del país
      this.closeModal(); // Cierra el modal después de guardar
    } else {
      console.error('Por favor, completa todos los campos obligatorios.');
    }
  }
}
