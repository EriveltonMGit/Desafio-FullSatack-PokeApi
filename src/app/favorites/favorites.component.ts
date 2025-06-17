import { Component, OnInit } from '@angular/core';
import { MainHeaderComponent } from "../components/main-header/main-header.component";
import { ExploreContainerComponent } from "../explore-container/explore-container.component";

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.scss'],
  standalone: true,
  imports: [MainHeaderComponent],
})
export class FavoritesComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
