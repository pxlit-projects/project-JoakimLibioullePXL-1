import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ReviewService } from '../shared/services/review.service';
import { Review, Status } from '../shared/models/review.model';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-review-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './review-form.component.html',
  styleUrls: ['./review-form.component.css'],
})
export class ReviewFormComponent implements OnInit {
  @Input() postId!: number; // ID van de post
  review: Review | null = null; // Review data ophalen of null als geen review bestaat
  reviewForm: FormGroup;
  isDenied: boolean = false; // Of er een comment wordt toegevoegd

  constructor(private fb: FormBuilder, private reviewService: ReviewService) {
    this.reviewForm = this.fb.group({
      comment: ['', Validators.required], // Alleen vereist bij afkeuren
    });
  }

  ngOnInit(): void {
    this.loadReview();
  }

  // Laad review data voor de post
  loadReview(): void {
    this.reviewService.getReviewByPostId(this.postId).subscribe({
      next: (review) => (this.review = review),
      error: (err) => console.error('Error bij ophalen review:', err),
    });
  }

  // Review goedkeuren
  approvePost(): void {
    if (!this.review) {
      // Voeg een nieuwe review toe
      const newReview: Review = {
        postId: this.postId,
        status: Status.ACCEPTED,
        comment: '',
      };
      this.reviewService.addReview(newReview).subscribe({
        next: () => this.loadReview(),
        error: (err) => console.error('Error bij goedkeuren:', err),
      });
    } else {
      // Update bestaande review
      this.reviewService.updateReviewStatus(this.review.id!, Status.ACCEPTED).subscribe({
        next: () => this.loadReview(),
        error: (err) => console.error('Error bij goedkeuren:', err),
      });
    }
  }

  // Review afkeuren
  denyPost(): void {
    if (!this.review) {
      // Voeg een nieuwe review toe
      const newReview: Review = {
        postId: this.postId,
        status: Status.DENIED,
        comment: '',
      };
      this.reviewService.addReview(newReview).subscribe({
        next: () => {
          this.loadReview();
          this.isDenied = true;
        },
        error: (err) => console.error('Error bij afkeuren:', err),
      });
    } else {
      // Update bestaande review
      this.reviewService.updateReviewStatus(this.review.id!, Status.DENIED).subscribe({
        next: () => {
          this.loadReview();
          this.isDenied = true;
        },
        error: (err) => console.error('Error bij afkeuren:', err),
      });
    }
  }

  // Voeg een comment toe
  submitComment(): void {
    if (this.review && this.reviewForm.valid) {
      const comment = this.reviewForm.value.comment;
      this.reviewService.addComment(this.review.id!, comment).subscribe({
        next: () => {
          alert('Comment toegevoegd!');
          this.loadReview();
          this.reviewForm.reset();
          this.isDenied = false;
        },
        error: (err) => console.error('Error bij toevoegen comment:', err),
      });
    }
  }

  // Verwijder de review
  deleteReview(): void {
    if (this.review) {
      this.reviewService.deleteReview(this.review.id!).subscribe({
        next: () => {
          alert('Review verwijderd!');
          this.review = null;
          this.reviewForm.reset();
          this.isDenied = false;
        },
        error: (err) => console.error('Error bij verwijderen review:', err),
      });
    }
  }
}
