import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";

@Injectable()
export class ApiService {
    constructor(private http: HttpClient) {}
 
    yahtzee(){
        return this.http.get('https://yahtzee-api.v1cky.com/'); 
    }
}