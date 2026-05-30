import { Component,OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.page.html',
  styleUrl: './dashboard.page.css',
})
export class DashboardPage implements OnInit {
  //DATOS DE PRUEBAS 
  alertasPersonal = [
    { 
      nombre: 'Juan Carlos Ramos', 
      dni: '45678912', 
      lote: 'Lote 12 - Fundo Ica', 
      labor: 'Cosecha de Uva', 
      unidadesHora: 5, 
      rendimiento: 50, 
      impactoEconomico: 180.00 
    },
    { 
      nombre: 'María Elías Espinoza', 
      dni: '71234568', 
      lote: 'Lote 05 - Fundo Ica', 
      labor: 'Poda de Formación', 
      unidadesHora: 6, 
      rendimiento: 60, 
      impactoEconomico: 145.50 
    },
    { 
      nombre: 'Carlos Mendoza Loza', 
      dni: '40897654', 
      lote: 'Lote 14 - Los Brujos', 
      labor: 'Cosecha de Uva', 
      unidadesHora: 8, 
      rendimiento: 80, 
      impactoEconomico: 0.00 
    },
    { 
      nombre: 'Ana Flores Quispe', 
      dni: '42781390', 
      lote: 'Lote 02 - Fundo Ica', 
      labor: 'Riego / Fertirriego', 
      unidadesHora: 11, 
      rendimiento: 110, 
      impactoEconomico: 0.00 
    }
  ];

  constructor() { }

  ngOnInit(): void { }
}
