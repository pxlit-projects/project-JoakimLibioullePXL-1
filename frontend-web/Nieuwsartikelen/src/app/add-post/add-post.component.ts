import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PostService } from '../shared/services/post.service'
import { Post } from '../shared/models/post.model';
import {NgIf} from "@angular/common";


@Component({
  selector: 'app-add-post',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent {
  postService: PostService = inject(PostService);
  router: Router = inject(Router);
  fb: FormBuilder = inject(FormBuilder);

  postForm: FormGroup = this.fb.group({
    title: ['', Validators.required],
    text: ['', Validators.required],
    author: ['', Validators.required],
    category: ['', Validators.required],
    isConcept: [true]
  });

  onSubmit() {
    if (this.postForm.valid) {
      const newPost: Post = { ...this.postForm.value };
      this.postService.addPost(newPost).subscribe(() => {
        this.postForm.reset();
        this.router.navigate(['/published']); // Navigeer naar de posts-pagina na toevoegen
      });
    }
  }
  toggleIsConcept(): void {
    const currentValue = this.postForm.get('isConcept')?.value;
    this.postForm.get('isConcept')?.setValue(!currentValue);
  }
}
