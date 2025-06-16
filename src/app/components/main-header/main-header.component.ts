import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  IonHeader,
  IonToolbar,
  IonSearchbar, IonLabel, IonTabButton } from '@ionic/angular/standalone';

@Component({
  selector: 'app-main-header',
  templateUrl: './main-header.component.html',
  styleUrls: ['./main-header.component.scss'],
  standalone: true,
  imports: [IonTabButton, IonLabel,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonSearchbar,

  ]
})
export class MainHeaderComponent implements OnInit {

  constructor() { }

  ngOnInit() { }

}
