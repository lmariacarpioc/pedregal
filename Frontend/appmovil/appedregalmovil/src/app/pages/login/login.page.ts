import { Component } from '@angular/core';
import { NavController } from '@ionic/angular'; // 1. Importar el controlador

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.css'],
})
export class LoginPage {

  // 2. Inyectar NavController en el constructor
  constructor(private navCtrl: NavController) {}

  // 3. Crear la función que se ejecuta al hacer clic
  ingresar() {
    console.log('Botón presionado, ingresando...');
    
    // Aquí en el futuro puedes poner la validación de tu usuario y contraseña.
    // Por ahora, le damos pase directo.
    
    // OJO: Cambia '/staff' por el nombre real de tu ruta. 
    // Si estás usando la plantilla de pestañas (tabs), podría ser '/tabs/staff' o '/tabs/tab1'
    this.navCtrl.navigateRoot('/staff'); 
  }
}