import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


  interface RegistroHistorico {
    fecha: string;
    cuadrilla: string;
    lote: string;
    produccion: number;
    calidad: 'EXCELENTE' | 'ESTÁNDAR' | 'REVISIÓN';
  }

  interface CuadrillaSemana {
    semana: string;
    real: number;
    meta: number;
  }

  interface Cuadrilla {
    nombre: string;
    eficiencia: number;
  }

@Component({
  selector: 'app-reportes',
  standalone: true,
  imports: [CommonModule,FormsModule,RouterModule], 
  templateUrl: './reportes.html',
  styleUrl: './reportes.css',
})
export class Reportes {}
