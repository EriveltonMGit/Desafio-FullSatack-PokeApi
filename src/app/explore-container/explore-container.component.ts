import { Component, Input } from '@angular/core';
import { IonContent } from "@ionic/angular/standalone";
import { MainDetailsComponent } from "../details/main-details.component";

@Component({
  selector: 'app-explore-container',
  templateUrl: './explore-container.component.html',
  styleUrls: ['./explore-container.component.scss'],
  imports: [],
})
export class ExploreContainerComponent {
  @Input() name?: string;
}
