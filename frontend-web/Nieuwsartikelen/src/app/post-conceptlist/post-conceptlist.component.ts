import { Component, OnInit, inject } from '@angular/core';
import { PostItemComponent } from '../post-item/post-item.component';
import { FilterComponent } from '../filter/filter.component';
import { Post } from '../shared/models/post.model';
import { PostFilter } from '../shared/models/filter.model';
import { PostService } from '../shared/services/post.service';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-post-conceptlist',
  standalone: true,
  imports: [CommonModule, PostItemComponent, FilterComponent],
  templateUrl: './post-conceptlist.component.html',
  styleUrls: ['./post-conceptlist.component.css']
})
export class PostConceptListComponent implements OnInit {
  posts: Post[] = [];
  postService: PostService = inject(PostService);

  ngOnInit(): void {
    this.postService.getAllConcepts().subscribe({
      next: (posts) => {
        this.posts = posts;
      }
    });
  }

  handleFilter(filter: PostFilter): void {
    this.postService.filterConceptPosts(filter).subscribe({
      next: (posts) => {
        this.posts = posts;
      }
    });
  }
}
