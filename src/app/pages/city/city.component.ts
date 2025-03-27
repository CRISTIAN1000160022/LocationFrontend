import { Component, OnInit } from '@angular/core';
import { CityService } from '../../services/city.service';
import { AddCityComponent } from './modals/add-city/add-city.component';
import { UpdateCityComponent } from './modals/update-city/update-city.component';

@Component({
  selector: 'app-city',
  standalone: true,
  imports: [ AddCityComponent, UpdateCityComponent],
  templateUrl: './city.component.html',
  styleUrl: './city.component.css',
})
export class CityComponent implements OnInit {
  cities: any[] = []; // Almacenará los paises obtenidos
  filteredCities: any[] = []; // Paises filtrados para búsqueda y paginación
  searchQuery = ''; // Texto de búsqueda
  currentPage = 1; // Página actual
  itemsPerPage = 10; // Elementos por página
  totalPages = 1; // Total de páginas
  selectedPrediction: any = null; // Predicción seleccionada para mostrar en OrdersComponent
  isModalOpen = false; // Controla la visibilidad del modal
  isModalUpdateOpen = false; // Controla la visibilidad del modal
  token = '';
  cityId = '';

  constructor(private cityService: CityService) {}

  ngOnInit(): void {
    this.authenticateAndFetchCities();
  }

  authenticateAndFetchCities(): void {
    this.cityService
      .authenticate('admin', '123456')
      .subscribe((response) => {
        if (response.success) {
          this.cityService.saveToken(response.Data);
          this.token = response.Data;
          this.getCities();
        }
      });
  }

  getCities(): void {
    this.cityService.getAllCities().subscribe(
      (data) => {
        this.cities = Array.isArray(data.Data) ? data.Data : []; // Validamos que sea un array
        this.filteredCities = [...this.cities]; // Inicializamos las predicciones filtradas
        this.updatePagination();
      },
      (error) => {
        console.error('Error al obtener las ciudades:', error);
      }
    );
  }

  onSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchQuery = input.value;
    this.filteredCities = this.cities.filter((city) =>
      city.Name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
    this.updatePagination();
  }

  sortTable(column: string): void {
    this.filteredCities.sort((a, b) =>
      a[column] > b[column] ? 1 : a[column] < b[column] ? -1 : 0
    );
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(
      this.filteredCities.length / this.itemsPerPage
    );
    this.currentPage = 1; // Reinicia a la primera página al cambiar el número de elementos por página
  }

  get paginatedCountries(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredCities.slice(start, end);
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

  newCity(): void {
    this.isModalOpen = true; // Abre el modal
  }

  updateCity(city: any): void {
    this.isModalUpdateOpen = true; // Abre el modal
    this.cityId = city.CityID; // Asigna el nombre del cliente
    this.selectedPrediction = { ...city };// Asigna la predicción seleccionada
  }

  deleteCity(cityID: string): void {
    const confirmation = confirm('Are you entirely sure you want to delete this city?');
    if (confirmation) {
      this.cityService.deleteCity(cityID).subscribe(
        (response) => {
          if (response.success) {
            console.log('City deleted successfully:', response);
            this.getCities(); // Actualiza la lista de países
          } else {
            console.error('Error deleting city:', response);
          }
        },
        (error) => {
          console.error('Error deleting city:', error);
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

  onCityAdded(city: any): void {
    console.log('New city added:', city);
    this.cityService.addCity(city).subscribe(
      (response) => {
        if (response.success) {
          console.log('City added successfully:', response);
          this.getCities(); // Actualiza la lista de paises
        } else {
          console.error('Error adding city:', response);
        }
      },
      (error) => {
        console.error('Error adding city:', error);
      }
    );
    this.closeModal();
  }

  onCityUpdated(city: any): void {
    console.log('City updated:', city);
    this.cityService.updateCity(city).subscribe(
      (response) => {
        if (response.success) {
          console.log('City updated successfully:', response);
          this.getCities(); // Actualiza la lista de países
        } else {
          console.error('Error updating city:', response);
        }
      },
      (error) => {
        console.error('Error updating city:', error);
      }
    );
    this.closeModalUpdate();
  }
}
