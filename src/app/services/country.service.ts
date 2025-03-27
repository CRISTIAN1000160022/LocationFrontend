import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private apiUrl = 'https://localhost:44329/Country/GetAllCountries';
  private authUrl = 'https://localhost:44329/Login/AuthenticateToken';
  private addCountryUrl = 'https://localhost:44329/Country/AddCountry';
  private updateCountryUrl = 'https://localhost:44329/Country/UpdateCountry';
  private deleteCountryUrl = 'https://localhost:44329/Country/DeleteCountry';

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

  // Método para obtener TODOS los paises de clientes
  getAllCountries(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any>(this.apiUrl, { headers });
  }

  // Método para agregar un nuevo país
  addCountry(country: { Name: string; Code: string }): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<any>(this.addCountryUrl, country, { headers });
  }

  updateCountry(country: { CountryID: string; Name: string; Code: string }): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.put<any>(this.updateCountryUrl, country, { headers });
  }

  deleteCountry(countryID: string): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.delete<any>(`${this.deleteCountryUrl}/${countryID}`, { headers });
  }
}
