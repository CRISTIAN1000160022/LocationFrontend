import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StateService {
  private apiUrl = 'https://localhost:44329/State/GetAllStates';
  private authUrl = 'https://localhost:44329/Login/AuthenticateToken';
  private addStateUrl = 'https://localhost:44329/State/AddState';
  private updateStateUrl = 'https://localhost:44329/State/UpdateState';
  private deleteStateUrl = 'https://localhost:44329/State/DeleteState';

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

  // Método para obtener TODOS los departamentos de clientes
  getAllStates(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    return this.http.get<any>(this.apiUrl, { headers });
  }

  // Método para agregar un nuevo departamento
  addState(state: { Name: string; Code: string }): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.post<any>(this.addStateUrl, state, { headers });
  }

  updateState(state: { StateID: string; Name: string; Code: string }): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.put<any>(this.updateStateUrl, state, { headers });
  }

  deleteState(stateID: string): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    return this.http.delete<any>(`${this.deleteStateUrl}/${stateID}`, { headers });
  }
}
