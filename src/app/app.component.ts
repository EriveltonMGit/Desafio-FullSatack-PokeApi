import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet, IonMenu, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonMenuToggle, IonIcon, IonLabel } from '@ionic/angular/standalone'; // MAKE SURE THESE ARE ALL IMPORTED
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 

import { addIcons } from 'ionicons';
import { home, star } from 'ionicons/icons';
import { MainHeaderComponent } from "./components/main-header/main-header.component"; 

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html', 
  standalone: true,
  imports: [
    IonApp,
    IonRouterOutlet,
    IonMenu,
    IonHeader, 
    IonToolbar, 
    IonTitle, 
    IonContent, 
    IonList, 
    IonItem, 
    IonMenuToggle, 
    IonIcon, 
    IonLabel, 
    CommonModule,
    RouterModule 
    ,
    MainHeaderComponent
],
})
export class AppComponent {
  constructor() {
    addIcons({ home, star }); 
  }
}