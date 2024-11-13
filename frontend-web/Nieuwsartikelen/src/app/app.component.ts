import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NavbarComponent} from "./navbar/navbar.component";
import {PostPublishedListComponent} from "./post-publishedlist/post-publishedlist.component";
import {PostConceptListComponent} from "./post-conceptlist/post-conceptlist.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, NavbarComponent, PostPublishedListComponent, PostConceptListComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Nieuwsartikelen';
}
