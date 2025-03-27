import { Component, OnInit } from '@angular/core';
import { StateService } from '../../services/state.service';
import { AddStateComponent } from './modals/add-state/add-state.component';
import { UpdateStateComponent } from './modals/update-state/update-state.component';

@Component({
  selector: 'app-state',
  standalone: true,
  imports: [ AddStateComponent, UpdateStateComponent],
  templateUrl: './state.component.html',
  styleUrl: './state.component.css',
})
export class StateComponent implements OnInit {
  states: any[] = []; // Almacenará los paises obtenidos
  filteredStates: any[] = []; // Paises filtrados para búsqueda y paginación
  searchQuery = ''; // Texto de búsqueda
  currentPage = 1; // Página actual
  itemsPerPage = 10; // Elementos por página
  totalPages = 1; // Total de páginas
  selectedPrediction: any = null; // Predicción seleccionada para mostrar en OrdersComponent
  isModalOpen = false; // Controla la visibilidad del modal
  isModalUpdateOpen = false; // Controla la visibilidad del modal
  token = '';
  stateId = '';

  constructor(private StateService: StateService) {}

  ngOnInit(): void {
    this.authenticateAndFetchStates();
  }

  authenticateAndFetchStates(): void {
    this.StateService
      .authenticate('admin', '123456')
      .subscribe((response) => {
        if (response.success) {
          this.StateService.saveToken(response.Data);
          this.token = response.Data;
          this.getStates();
        }
      });
  }

  getStates(): void {
    this.StateService.getAllStates().subscribe(
      (data) => {
        this.states = Array.isArray(data.Data) ? data.Data : []; // Validamos que sea un array
        this.filteredStates = [...this.states]; // Inicializamos las predicciones filtradas
        this.updatePagination();
      },
      (error) => {
        console.error('Error al obtener los paises:', error);
      }
    );
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
    this.filteredStates = this.states.filter((state) =>
      state.Name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    this.updatePagination();
  }

  sortTable(column: string): void {
    this.filteredStates.sort((a, b) =>
      a[column] > b[column] ? 1 : a[column] < b[column] ? -1 : 0
    );
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(
      this.filteredStates.length / this.itemsPerPage
    );
    this.currentPage = 1; // Reinicia a la primera página al cambiar el número de elementos por página
  }

  get paginatedStates(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredStates.slice(start, end);
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  newState(): void {
    this.isModalOpen = true; // Abre el modal
  }

  updateState(state: any): void {
    this.isModalUpdateOpen = true; // Abre el modal
    this.stateId = state.StateID; // Asigna el nombre del cliente
    this.selectedPrediction = { ...state };// Asigna la predicción seleccionada
  }

  deleteState(stateID: string): void {
    const confirmation = confirm('Are you entirely sure you want to delete this state?');
    if (confirmation) {
      this.StateService.deleteState(stateID).subscribe(
        (response) => {
          if (response.success) {
            console.log('State deleted successfully:', response);
            this.getStates(); // Actualiza la lista de países
          } else {
            console.error('Error deleting state:', response);
          }
        },
        (error) => {
          console.error('Error deleting state:', error);
        }
      );
    } else {
      console.log('Eliminación cancelada por el usuario.');
    }
  }

  // Método para reemplazar Math.min
  getMin(a: number, b: number): number {
    return Math.min(a, b);
  }

  closeModal(): void {
    this.isModalOpen = false; // Cierra el modal
  }

  closeModalUpdate(): void {
    this.isModalUpdateOpen = false; // Cierra el modal
  }

  // Método para manejar el cambio de filas por página
  onItemsPerPageChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.itemsPerPage = parseInt(select.value, 10); // Actualiza el número de elementos por página
    this.updatePagination(); // Actualiza la paginación
  }

  onStateAdded(state: any): void {
    console.log('New city added:', state);
    this.StateService.addState(state).subscribe(
      (response) => {
        if (response.success) {
          console.log('State added successfully:', response);
          this.getStates(); // Actualiza la lista de paises
        } else {
          console.error('Error adding state:', response);
        }
      },
      (error) => {
        console.error('Error adding state:', error);
      }
    );
    this.closeModal();
  }

  onStateUpdated(state: any): void {
    console.log('Country updated:', state);
    this.StateService.updateState(state).subscribe(
      (response) => {
        if (response.success) {
          console.log('Country updated successfully:', response);
          this.getStates(); // Actualiza la lista de países
        } else {
          console.error('Error updating state:', response);
        }
      },
      (error) => {
        console.error('Error updating state:', error);
      }
    );
    this.closeModalUpdate();
  }
}
