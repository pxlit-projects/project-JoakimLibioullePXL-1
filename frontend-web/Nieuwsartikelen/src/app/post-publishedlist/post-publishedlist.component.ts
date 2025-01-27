import { Component, OnInit, inject } from '@angular/core';
import { PostItemComponent } from '../post-item/post-item.component';
import { FilterComponent } from '../filter/filter.component';
import { Post } from '../shared/models/post.model';
import { PostFilter } from '../shared/models/filter.model';
import { PostService } from '../shared/services/post.service';
import { CommonModule } from '@angular/common'; // Import CommonModule

@Component({
  selector: 'app-post-publishedlist',
  standalone: true,
  imports: [PostItemComponent, FilterComponent, CommonModule],
  templateUrl: './post-publishedlist.component.html',
  styleUrls: ['./post-publishedlist.component.css']
})
export class PostPublishedListComponent implements OnInit {
  posts: Post[] = [];
  postService: PostService = inject(PostService);

  ngOnInit(): void {
    this.postService.getAllPublished().subscribe({
      next: (posts) => {
        this.posts = posts;
      }
    });
  }

  handleFilter(filter: PostFilter): void {
    this.postService.filterPublishedPosts(filter).subscribe({
      next: (posts) => {
        this.posts = posts;
      }
    });
  }
}
