import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'LocationFrontend';

  constructor(private router: Router) {}

  // Método para redirigir manualmente
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  // Método para verificar si una ruta está activa
  isActive(route: string): boolean {
    return this.router.url === route;
  }
}
