import { Component, OnInit } from '@angular/core';
import { MainHeaderComponent } from "../components/main-header/main-header.component";


@Component({
  selector: 'app-main-details',
  templateUrl: './main-details.component.html',
  styleUrls: ['./main-details.component.scss'],
  standalone: true,
  imports: [MainHeaderComponent],
})
export class MainDetailsComponent  implements OnInit {

  constructor() { }

  ngOnInit() {}

}
