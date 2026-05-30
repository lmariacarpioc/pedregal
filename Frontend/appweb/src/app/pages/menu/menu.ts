import { Component } from '@angular/core';
import { RouterModule ,Router, RouterOutlet} from '@angular/router';
import { CommonModule } from '@angular/common'; 

@Component({
  selector: 'app-menu',
  imports: [ RouterModule, CommonModule,RouterOutlet],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu {
  constructor(private router: Router) {}

 
  mostrarMenu(): boolean {
    return this.router.url !== '/login' && this.router.url !== '/';
  }
}
