import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs'; // Handig om Observables te mocken
import { ReviewFormComponent } from './review-form.component';
import { ReviewService } from '../shared/services/review.service'; // Zorg dat het pad klopt
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {Review, Status} from "../shared/models/review.model";

describe('ReviewFormComponent', () => {
  let component: ReviewFormComponent;
  let fixture: ComponentFixture<ReviewFormComponent>;
  let mockReviewService: jasmine.SpyObj<ReviewService>; // Spy voor de ReviewService

  beforeEach(async () => {
    // Maak een spy van ReviewService
    mockReviewService = jasmine.createSpyObj('ReviewService', ['getReviewByPostId', 'addComment']);

    // Mock de return value van getReview
    mockReviewService.getReviewByPostId.and.returnValue(of({ id: 1, postId: 1, status: Status.ACCEPTED, comment: 'Test review' })); // Fake Observable

    await TestBed.configureTestingModule({
      imports: [
        ReviewFormComponent,
        FormsModule,
        ReactiveFormsModule,
        HttpClientTestingModule // Zorg ervoor dat HttpClientMock correct is opgenomen
      ],
      providers: [
        { provide: ReviewService, useValue: mockReviewService } // Gebruik de gemockte service
      ],
      schemas: [NO_ERRORS_SCHEMA] // Voorkomt template fouten voor onbekende componenten
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('loadReview', () => {
    it('should call getReview on ReviewService and set the data correctly', () => {
      // Roep de method expliciet aan (als niet via ngOnInit)
      component.loadReview();

      // Controleer of de service gebruikt wordt
      expect(mockReviewService.getReviewByPostId).toHaveBeenCalled();

      // Controleer of data correct staat
      expect(component.review).toEqual({ id: 1, postId: 1, status: Status.ACCEPTED, comment: 'Test review' });
    });

    it('should handle errors from getReview gracefully', () => {
      // Mock een fout voor de service
      mockReviewService.getReviewByPostId.and.returnValue(of(undefined as unknown as Review));

      // Roep expliciet loadReview aan
      component.loadReview();

      // Controleer of het geen ongeldige data heeft ingesteld
      expect(component.review).toBeUndefined();
    });
  });

  describe('form submission', () => {
    it('should not call submitReview() if form is invalid', () => {
      // Zorg dat formulier ongeldig is
      component.reviewForm.patchValue({ review: '', rating: null }); // Ongelidige invoer
      component.submitComment();
      fixture.detectChanges();

      // Controleer dat submitReview niet is aangeroepen
      expect(mockReviewService.addComment).not.toHaveBeenCalled();
    });
  });
});
