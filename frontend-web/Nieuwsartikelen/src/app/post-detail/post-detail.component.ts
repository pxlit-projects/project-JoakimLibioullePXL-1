import { Component, OnDestroy, inject } from '@angular/core';
import { AsyncPipe, NgClass, NgIf } from '@angular/common';
import { PostService } from '../shared/services/post.service';
import { Post } from '../shared/models/post.model';
import { Observable, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [NgIf, NgClass, AsyncPipe],
  templateUrl: './post-detail.component.html',
  styles: []
})
export class PostDetailComponent implements OnDestroy {
  postService: PostService = inject(PostService);
  route: ActivatedRoute = inject(ActivatedRoute);
  id: number = this.route.snapshot.params['id'];
  sub!: Subscription;

  post$: Observable<Post> = this.postService.getPost(this.id);

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}
