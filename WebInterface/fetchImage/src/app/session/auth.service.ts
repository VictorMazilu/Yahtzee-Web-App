// auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { prodEnvironment } from '../../config/environment.prod';
import TokenStore from './token'; // Import the TokenStore class

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = prodEnvironment.apiUrl + '/auth';

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/login`, { username, password });
  }

  logout(): Observable<any> {
    const token = TokenStore.getToken(); // Use the TokenStore class
    return this.http.post<any>(`${this.apiUrl}/logout`, {}, { headers: new HttpHeaders({ 'Authorization': `Bearer ${token}` }) });
  }
}
