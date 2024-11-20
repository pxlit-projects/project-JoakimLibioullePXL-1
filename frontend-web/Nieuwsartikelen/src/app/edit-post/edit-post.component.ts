import {Component, inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgIf} from "@angular/common";
import {PostService} from "../shared/services/post.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Post} from "../shared/models/post.model";
import {Observable} from "rxjs";

@Component({
  selector: 'app-edit-post',
  standalone: true,
  imports: [ReactiveFormsModule, NgIf],
  templateUrl: './edit-post.component.html',
  styleUrl: './edit-post.component.css'
})
export class EditPostComponent implements OnInit {
  postService: PostService = inject(PostService);
  router: Router = inject(Router);
  fb: FormBuilder = inject(FormBuilder);
  route: ActivatedRoute = inject(ActivatedRoute);

  id: number = this.route.snapshot.params['id'];
  post$: Observable<Post> = this.postService.getPost(this.id);

  editPostForm: FormGroup = this.fb.group({
    title: ["", Validators.required],
    text: ["", Validators.required],
    author: ["", Validators.required],
    category: ["", Validators.required],
    isConcept: [false] // Standaardwaarde ingesteld op false
  });

  ngOnInit(): void {
    this.post$.subscribe((post) => {
      // Vul formulierwaarden in met data uit post
      this.editPostForm.patchValue({
        title: post.title,
        text: post.text,
        author: post.author,
        category: post.category,
        isConcept: post.isConcept
      });
    });
  }

  onSubmit(): void {
    if (this.editPostForm.valid) {
      const updatedPost: Post = { ...this.editPostForm.value };
      this.postService.updatePost(this.id, updatedPost).subscribe(() => {
        this.editPostForm.reset();
        this.router.navigate(['/published']); // Navigeer naar de gepubliceerde posts
      });
    }
  }

  toggleIsConcept(): void {
    const currentValue = this.editPostForm.get('isConcept')?.value;
    this.editPostForm.get('isConcept')?.setValue(!currentValue);
  }
  onReset(): void {
    this.editPostForm.reset({
      title: '',
      text: '',
      author: '',
      category: '',
      isConcept: false, // Standaardwaarde terugzetten
    });
  }
}
