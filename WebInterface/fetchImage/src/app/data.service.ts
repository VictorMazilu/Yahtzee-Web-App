import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { testEnvironment } from '../config/environment.test';
import { prodEnvironment } from '../config/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = prodEnvironment.apiUrl;

  constructor(private http: HttpClient) { }

  getData(): Observable<{ [key: number]: number }> {
    return this.http.get<{ [key: number]: number }>(`${this.apiUrl}getpoints`,  { withCredentials: true });
  }
}