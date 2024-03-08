import { Component } from '@angular/core';
import { MainComponent } from './main/main.component';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    MainComponent,
    HttpClientModule,
    CommonModule,
  ],
  template: `
  <main>
    <header class="brand-name">
      <app-main></app-main>
    </header>
    <section class="content">
    </section>
  </main>
`,
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'default';
}
