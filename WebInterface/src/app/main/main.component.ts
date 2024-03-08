import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule],
  template: `
      <div class="hero-image">
        <div class="hero-text">
          {{info | json}}
        </div>
      </div>
  `,
  styleUrl: './main.component.css'
})

export class MainComponent {
  title = 'Yahtzee';
  info: any;
  
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get('https://yahtzee-api.v1cky.com/api/getpoints').subscribe((response) => {
      this.info = response;
    }, (error) => {
      console.log('Error:', error);
    });
  }
}
