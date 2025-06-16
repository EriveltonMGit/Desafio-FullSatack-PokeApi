import { Component, OnInit } from '@angular/core';
import { MainHeaderComponent } from "../components/main-header/main-header.component";
import { ExploreContainerComponent } from "../explore-container/explore-container.component";

@Component({
  selector: 'app-main-details',
  templateUrl: './main-details.component.html',
  styleUrls: ['./main-details.component.scss'],
  standalone: true,
  imports: [MainHeaderComponent, ExploreContainerComponent],
})
export class MainDetailsComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
