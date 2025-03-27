import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CityService {
  private apiUrl = 'https://localhost:44329/City/GetAllCities';
  private authUrl = 'https://localhost:44329/Login/AuthenticateToken';
  private addCityUrl = 'https://localhost:44329/City/AddCity';
  private updateCityUrl = 'https://localhost:44329/City/UpdateCity';
  private deleteCityUrl = 'https://localhost:44329/City/DeleteCity';

  constructor(private http: HttpClient) {}

  // Método para autenticación y obtención del token
  authenticate(username: string, password: string): Observable<any> {
    return this.http.post<any>(this.authUrl, {
      Username: username,
      Password: password,
    });
  }

  // Método para guardar el token en localStorage
  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
  }

  // Método para obtener el token almacenado
  getToken(): string | null {
    return localStorage.getItem('authToken');
  }

  // Método para obtener TODAS las ciudades de clientes
  getAllCities(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any>(this.apiUrl, { headers });
  }

  // Método para agregar una nueva ciudad
  addCity(city: { Name: string; Code: string }): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<any>(this.addCityUrl, city, { headers });
  }

  updateCity(city: { CityID: string; Name: string; Code: string }): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.put<any>(this.updateCityUrl, city, { headers });
  }

  deleteCity(cityID: string): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.delete<any>(`${this.deleteCityUrl}/${cityID}`, { headers });
  }
}
