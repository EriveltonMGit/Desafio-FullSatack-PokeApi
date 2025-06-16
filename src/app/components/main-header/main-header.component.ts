import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router'; // Import this for routerLink
import {
  IonHeader,
  IonToolbar,
  IonSearchbar,
  IonTabButton, // Keep if you decide to use it in header, but reconsider its typical use
  IonLabel // Keep if you decide to use it in header
} from '@ionic/angular/standalone'; // Ionic Components

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss'],
  standalone: true,
  imports: [
    RouterModule, 
    IonHeader,   
    IonToolbar,  
    IonSearchbar,
    IonTabButton,
    IonLabel      
  ]
})
export class MainHeaderComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

}
