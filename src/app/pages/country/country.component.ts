import { Component, OnInit } from '@angular/core';
import { CountryService } from '../../services/country.service';
import { AddCountryComponent } from './modals/add-country/add-country.component';
import { UpdateCountryComponent } from './modals/update-country/update-country.component';

@Component({
  selector: 'app-country',
  standalone: true,
  imports: [AddCountryComponent, UpdateCountryComponent],
  templateUrl: './country.component.html',
  styleUrl: './country.component.css',
})
export class CountryComponent implements OnInit {
  countries: any[] = []; // Almacenará los paises obtenidos
  filteredCountries: any[] = []; // Paises filtrados para búsqueda y paginación
  searchQuery = ''; // Texto de búsqueda
  currentPage = 1; // Página actual
  itemsPerPage = 10; // Elementos por página
  totalPages = 1; // Total de páginas
  selectedPrediction: any = null; // Predicción seleccionada para mostrar en OrdersComponent
  isModalOpen = false; // Controla la visibilidad del modal
  isModalUpdateOpen = false; // Controla la visibilidad del modal
  token = '';
  CountryID = '';

  constructor(private countryService: CountryService) {}

  ngOnInit(): void {
    this.authenticateAndFetchCountries();
  }

  authenticateAndFetchCountries(): void {
    this.countryService
      .authenticate('admin', '123456')
      .subscribe((response) => {
        if (response.success) {
          this.countryService.saveToken(response.Data);
          this.token = response.Data;
          this.getCountries();
        }
      });
  }

  getCountries(): void {
    this.countryService.getAllCountries().subscribe(
      (data) => {
        this.countries = Array.isArray(data.Data) ? data.Data : []; // Validamos que sea un array
        this.filteredCountries = [...this.countries]; // Inicializamos las predicciones filtradas
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
    this.filteredCountries = this.countries.filter((country) =>
      country.Name.toLowerCase().includes(
        this.searchQuery.toLowerCase()
      )
    );
    this.updatePagination();
  }

  sortTable(column: string): void {
    this.filteredCountries.sort((a, b) =>
      a[column] > b[column] ? 1 : a[column] < b[column] ? -1 : 0
    );
    this.updatePagination();
  }

  updatePagination(): void {
    this.totalPages = Math.ceil(
      this.filteredCountries.length / this.itemsPerPage
    );
    this.currentPage = 1; // Reinicia a la primera página al cambiar el número de elementos por página
  }

  get paginatedCountries(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredCountries.slice(start, end);
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

  newCountry(): void {
    this.isModalOpen = true; // Abre el modal
  }

  updateCountry(country: any): void {
    this.isModalUpdateOpen = true; // Abre el modal
    this.CountryID = country.CountryID; // Asigna el ID del país
    this.selectedPrediction = { ...country }; // Pasa los datos del país seleccionado
  }

  deleteCountry(countryID: string): void {
    const confirmation = confirm('Are you entirely sure you want to delete this country?');
    if (confirmation) {
      this.countryService.deleteCountry(countryID).subscribe(
        (response) => {
          if (response.success) {
            console.log('Country deleted successfully:', response);
            this.getCountries(); // Actualiza la lista de países
          } else {
            console.error('Error deleting country:', response);
          }
        },
        (error) => {
          console.error('Error deleting country:', error);
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

  onCountryAdded(country: any): void {
    console.log('New city added:', country);
    this.countryService.addCountry(country).subscribe(
      (response) => {
        if (response.success) {
          console.log('Country added successfully:', response);
          this.getCountries(); // Actualiza la lista de paises
        } else {
          console.error('Error adding country:', response);
        }
      },
      (error) => {
        console.error('Error adding country:', error);
      }
    );
    this.closeModal();
  }

  onCountryUpdated(country: any): void {
    console.log('Country updated:', country);
    this.countryService.updateCountry(country).subscribe(
      (response) => {
        if (response.success) {
          console.log('Country updated successfully:', response);
          this.getCountries(); // Actualiza la lista de países
        } else {
          console.error('Error updating country:', response);
        }
      },
      (error) => {
        console.error('Error updating country:', error);
      }
    );
    this.getCountries();
    this.closeModalUpdate();
  }
}
