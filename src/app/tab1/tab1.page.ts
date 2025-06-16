import { Component } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonTabButton, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { ExploreContainerComponent } from '../explore-container/explore-container.component';
import { MainHeaderComponent } from "../components/main-header/main-header.component";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  imports: [ IonHeader, IonToolbar, IonTitle, IonContent, ExploreContainerComponent, MainHeaderComponent],
})
export class Tab1Page {
  constructor() {}
}
