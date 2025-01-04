import {TestBed} from '@angular/core/testing';
import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {ReviewService} from './review.service';
import {Review, Status} from '../models/review.model';

describe('ReviewService', () => {
  let service: ReviewService;
  let httpMock: HttpTestingController;
  const baseApiUrl = 'http://localhost:8083/review/api/review'; // Consistente URL

    const mockReview: Review = {
        id: 1,
        postId: 1,
        comment: 'This is a review',
        status: Status.ACCEPTED,
    }; // Mock Review object for testing

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ReviewService],
    });

    service = TestBed.inject(ReviewService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Ensures all HTTP requests are resolved at the end of the test
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get review by post ID', () => {
    const postId = 1;

    service.getReviewByPostId(postId).subscribe((review) => {
      expect(review).toEqual(mockReview); // Check returned data matches the mock review
    });

    const req = httpMock.expectOne(`${baseApiUrl}/${postId}`); // Check correct URL is called
    expect(req.request.method).toBe('GET'); // Check method is GET
    req.flush(mockReview); // Simulate returning the mock review from the API
  });

  it('should add a new review', () => {
    service.addReview(mockReview).subscribe((review) => {
      expect(review).toEqual(mockReview); // Check returned data matches the mock review
    });

    const req = httpMock.expectOne(baseApiUrl);
    expect(req.request.method).toBe('POST'); // Check method is POST
    expect(req.request.body).toEqual(mockReview); // Ensure request body matches the review being posted
    req.flush(mockReview); // Simulate returning the newly added review
  });

  it('should update the review status', () => {
    const reviewId = 1;
    const newStatus: Status = Status.DENIED;

    service.updateReviewStatus(reviewId, newStatus).subscribe(() => {
      // Expect no response body
    });

    const req = httpMock.expectOne(`${baseApiUrl}/${reviewId}`);
    expect(req.request.method).toBe('PUT'); // Check method is PUT
    expect(req.request.body).toEqual({ status: newStatus }); // Check request body
    req.flush(null); // Simulate empty response on a successful update
  });

  it('should add or update a comment for a review', () => {
    const reviewId = 1;
    const comment = 'This is a test comment';

    service.addComment(reviewId, comment).subscribe(() => {
      // Expect no response body
    });

    const req = httpMock.expectOne(`${baseApiUrl}/comment/${reviewId}`);
    expect(req.request.method).toBe('PUT'); // Check method is PUT
    expect(req.request.body).toEqual(comment); // Check request body
    req.flush(null); // Simulate empty response
  });

  it('should delete a review', () => {
    const reviewId = 1;

    service.deleteReview(reviewId).subscribe(() => {
      // Expect no response body
    });

    const req = httpMock.expectOne(`${baseApiUrl}/${reviewId}`);
    expect(req.request.method).toBe('DELETE'); // Check method is DELETE
    req.flush(null); // Simulate empty response
  });
});
