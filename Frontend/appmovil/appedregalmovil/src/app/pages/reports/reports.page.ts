import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonHeader,
  IonToolbar,
  IonButton,
  IonIcon,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  arrowForwardOutline,
  syncOutline,
  peopleOutline,
  statsChartOutline,
  starOutline,
  star,
} from 'ionicons/icons';

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [IonHeader, IonToolbar, IonContent, IonButton, IonIcon, FormsModule],
  templateUrl: './reports.page.html',
  styleUrls: ['./reports.page.css'],
})
export class ReportsPage {

  activeTab: 'inversion' | 'produccion' = 'inversion';

  // ── Inversión fields ────────────────────────────────
  campania    = '2023-2024';
  cultivo     = 'Uva de Mesa';
  fundo       = 'Fundo Los Olivos';
  lote        = 'Lote 01-A';
  etapa       = 'Cosecha';
  proceso     = 'Selección y Empaque';

  // ── Producción fields ───────────────────────────────
  cajas       = 0;
  tipoEmpaque = '';
  calidadFruta: 'CAT1' | 'CAT2' = 'CAT1';

  constructor(private router: Router) {
    addIcons({ arrowForwardOutline, syncOutline, peopleOutline, statsChartOutline, starOutline, star });
  }

  setTab(tab: 'inversion' | 'produccion') {
    this.activeTab = tab;
  }

  setCalidad(cat: 'CAT1' | 'CAT2') {
    this.calidadFruta = cat;
  }

  continuar() {
    console.log('Continuar parte diario');
  }

  irA(tab: string) {
    this.router.navigateByUrl(`/tabs/${tab}`);
  }
}