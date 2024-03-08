import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http'

@Injectable({
  providedIn: 'root'
})
export class RESTAPIServiceYahtzeeService {
  
  constructor(private http: HttpClient) { }

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  
  getInfo() {
    let url = "https://yahtzee-api.v1cky.com/";
    return this.http.get(url, this.httpOptions);
  }
}