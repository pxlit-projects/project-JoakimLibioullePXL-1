import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Post } from '../shared/models/post.model';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-post-item',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './post-item.component.html',
  styleUrls: ['./post-item.component.css']
})
export class PostItemComponent {
  @Input() post!: Post;

  getDetails(): void {
    console.log(this.post); //TODO: route to correct page
  }
}
