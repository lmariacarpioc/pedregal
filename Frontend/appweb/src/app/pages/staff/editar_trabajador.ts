import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Trabajador } from './trabajador';


@Component({
  selector: 'app-editar-trabajador',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './editar_trabajador.html',
  styleUrl: './editar_trabajador.css'
})
export class EditarTrabajador implements OnInit {
    dniTrabajador: string | null = null;
  trabajadorEdicion: any = null;

  
  constructor(private route: ActivatedRoute, private router: Router,private trabajador: Trabajador) {}

  ngOnInit(): void {this.dniTrabajador = this.route.snapshot.paramMap.get('dni');
    if (this.dniTrabajador) {
      this.buscarTrabajador(this.dniTrabajador);
    }
  }

  buscarTrabajador(dni: string): void {
    // Buscamos el operario directamente en el servicio único
    const encontrado = this.trabajador.obtenerTrabajadorPorDni(dni);
    
    if (encontrado) {
      // Usamos desestructuración (clonación) para aislar los inputs del formulario
      this.trabajadorEdicion = { ...encontrado };
    } else {
      this.regresarAStaff();
      }
    }
  
  guardarCambios(): void {
   if (this.trabajadorEdicion) {
      // 1. Guardamos las modificaciones en la data de simulación del servicio
      this.trabajador.actualizarTrabajador(this.trabajadorEdicion);
    }
this.regresarAStaff();
  }
  regresarAStaff(): void {
    this.router.navigate(['/staff']);
  }
  }
