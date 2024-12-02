import {Component, OnDestroy, inject, OnInit} from '@angular/core';
import {AsyncPipe, CommonModule, NgClass, NgForOf, NgIf} from '@angular/common';
import { PostService } from '../shared/services/post.service';
import { Post } from '../shared/models/post.model';
import { Observable, Subscription } from 'rxjs';
import {ActivatedRoute, RouterLink} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {CommentService} from "../shared/services/comment.service";
import {CommentItemComponent} from "../comment-item/comment-item.component";
import { Comment } from "../shared/models/comment.model";
import {ReviewFormComponent} from "../review-form/review-form.component";

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, NgIf, NgClass, AsyncPipe, RouterLink, ReactiveFormsModule, NgForOf, CommentItemComponent, ReviewFormComponent],
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnDestroy, OnInit {
  postService: PostService = inject(PostService);
  commentService: CommentService = inject(CommentService);
  route: ActivatedRoute = inject(ActivatedRoute);
  id: number = this.route.snapshot.params['id'];
  sub!: Subscription;

  post$: Observable<Post> = this.postService.getPost(this.id);

  fb: FormBuilder = inject(FormBuilder);
  addCommentForm: FormGroup = this.fb.group({
    postId: [this.id],
    username: ['', Validators.required],
    comment: ['', Validators.required],
  })
  comments: Comment[] = [];
  ngOnInit(): void {
    this.commentService.getCommentByPostId(this.id).subscribe({
      next: (comments) => {
        this.comments = comments;
      }
    });
  }
  onSubmit(){
    if (this.addCommentForm.valid){
      const newComment: Comment = {...this.addCommentForm.value};
      this.commentService.addComment(newComment).subscribe(() => {
        this.addCommentForm.reset();
      })
    }
  }

  ngOnDestroy(): void {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }


  deleteComment(id:number) {
    this.commentService.deleteComment(id);
  }
}
