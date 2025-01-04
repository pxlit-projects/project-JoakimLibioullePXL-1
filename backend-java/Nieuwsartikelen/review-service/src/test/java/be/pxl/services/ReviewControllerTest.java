package be.pxl.services;

import be.pxl.services.controller.ReviewController;
import be.pxl.services.domain.dto.ReviewRequest;
import be.pxl.services.domain.dto.ReviewResponse;
import be.pxl.services.services.IReviewService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.ResponseEntity;
import be.pxl.services.domain.Status;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

class ReviewControllerTest {

    @Mock
    private IReviewService reviewService;

    @InjectMocks
    private ReviewController reviewController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetAll() {
        // Maak een mock-lijst van ReviewResponse
        List<ReviewResponse> mockReviews = List.of(
                ReviewResponse.builder()
                        .id(1L)
                        .postId(101L)
                        .status(Status.ACCEPTED)
                        .comment("Great post!")
                        .build(),
                ReviewResponse.builder()
                        .id(2L)
                        .postId(102L)
                        .status(Status.DENIED)
                        .comment("Needs improvement.")
                        .build()
        );

        // Mock het gedrag van de service
        when(reviewService.getAllReviews()).thenReturn(mockReviews);

        // Roep de controller aan
        ResponseEntity<List<ReviewResponse>> response = reviewController.getAll();

        // Controleer de HTTP-status en de response body
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(mockReviews, response.getBody());

        // Verifieer dat de service correct werd aangeroepen
        verify(reviewService, times(1)).getAllReviews();
    }

    @Test
    void testFindReviewByPostId() {
        // Maak een mock ReviewResponse object
        Long postId = 101L;
        ReviewResponse mockReview = ReviewResponse.builder()
                .id(1L)
                .postId(postId)
                .status(Status.ACCEPTED)
                .comment("Great post!")
                .build();

        // Mock het gedrag van de service
        when(reviewService.getReviewResponseByPostId(postId)).thenReturn(mockReview);

        // Roep de controller aan
        ResponseEntity<ReviewResponse> response = reviewController.findReviewByPostId(postId);

        // Controleer de HTTP-status en de response body
        assertEquals(200, response.getStatusCodeValue());
        assertEquals(mockReview, response.getBody());

        // Verifieer dat de service correct werd aangeroepen
        verify(reviewService, times(1)).getReviewResponseByPostId(postId);
    }

    @Test
    void testSetPostStatus() throws Exception {
        Long postId = 1L;
        ReviewRequest reviewRequest = new ReviewRequest();

        reviewController.setPostStatus(postId, reviewRequest);

        verify(reviewService, times(1)).setPostStatus(eq(postId), eq(reviewRequest));
    }

    @Test
    void testAddComment() throws Exception {
        Long postId = 1L;
        String comment = "Nice post!";

        reviewController.addComment(postId, comment);

        verify(reviewService, times(1)).addComment(postId, comment);
    }

    @Test
    void testAddReview() {
        ReviewRequest reviewRequest = new ReviewRequest();

        reviewController.addReview(reviewRequest);

        verify(reviewService, times(1)).addReview(eq(reviewRequest));
    }

    @Test
    void testDeleteReview() {
        Long postId = 1L;

        reviewController.deleteReview(postId);

        verify(reviewService, times(1)).deleteComment(postId);
    }
}
