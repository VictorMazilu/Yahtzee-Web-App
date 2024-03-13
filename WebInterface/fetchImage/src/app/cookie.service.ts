import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { prodEnvironment } from '../config/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class CookieService {

  constructor(private http: HttpClient) { }

  getData():string | null {
    //get the cookie from the endpoint
    //get the endpoint address from environment.prod.ts
    let cookieTmp: string | null ="" ;
    this.http.get(prodEnvironment.apiUrl + 'session/start', { observe: 'response' }).subscribe(response => {
      //parse the cookie from the response header
      const cookie = this.parseCookie(response.headers.get('Set-Cookie'));
      console.log(cookie);
      cookieTmp = cookie;
    });
    return cookieTmp;
  }

  // Helper function to parse the cookie value from the 'Set-Cookie' header
  private parseCookie(setCookieHeader: string | null): string | null {
    const match = setCookieHeader?.match(/your_cookie_name=([^;]+)/);
    return match ? match[1] : null;
  }
}
