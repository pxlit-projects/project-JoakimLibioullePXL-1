import { inject, Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../../environments/environment";
import { Review, Status } from "../models/review.model";

@Injectable({
  providedIn: 'root'
})
export class ReviewService {
  private api: string = environment.apiUrl + 'review/api/review';
  private http: HttpClient = inject(HttpClient);

  // Get review details for a post by post ID
  getReviewByPostId(id: number): Observable<Review> {
    return this.http.get<Review>(`${this.api}/${id}`);
  }

  // Add a new review
  addReview(review: Review): Observable<Review> {
    return this.http.post<Review>(this.api, review);
  }

  // Update the status of a review
  updateReviewStatus(id: number, status: Status): Observable<void> {
    const payload = { status };
    return this.http.put<void>(`${this.api}/${id}`, payload);
  }

  // Add or update a comment for a review
  addComment(id: number, comment: string): Observable<void> {
    return this.http.put<void>(`${this.api}/comment/${id}`, comment);
  }

  // Delete a review
  deleteReview(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/${id}`);
  }
}
