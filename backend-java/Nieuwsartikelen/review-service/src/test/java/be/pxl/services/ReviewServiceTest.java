package be.pxl.services;

import be.pxl.services.domain.Review;
import be.pxl.services.domain.Status;
import be.pxl.services.domain.dto.ReviewRequest;
import be.pxl.services.domain.dto.ReviewResponse;
import be.pxl.services.repository.ReviewRepository;
import be.pxl.services.services.ReviewService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ReviewServiceTest {

    @Mock
    private ReviewRepository reviewRepository;

    @InjectMocks
    private ReviewService reviewService;

    private Review testReview;
    private ReviewRequest testReviewRequest;

    @BeforeEach
    void setUp() {
        testReview = Review.builder()
                .id(1L)
                .postId(101L)
                .status(Status.ACCEPTED)
                .comment("Test comment")
                .build();

        testReviewRequest = new ReviewRequest();
        testReviewRequest.setPostId(101L);
        testReviewRequest.setStatus(Status.ACCEPTED);
        testReviewRequest.setComment("New comment");
    }

    @Test
    void getAllReviews_ShouldReturnAllReviews() {
        when(reviewRepository.findAll()).thenReturn(List.of(testReview));

        List<ReviewResponse> responses = reviewService.getAllReviews();

        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals(Status.ACCEPTED, responses.get(0).getStatus());
        verify(reviewRepository, times(1)).findAll();
    }

    @Test
    void getReviewResponseByPostId_ShouldReturnReviewResponse() {
        when(reviewRepository.getReviewResponseByPostId(101L)).thenReturn(
                ReviewResponse.builder()
                        .id(1L)
                        .postId(101L)
                        .status(Status.ACCEPTED)
                        .comment("Test comment")
                        .build()
        );

        ReviewResponse response = reviewService.getReviewResponseByPostId(101L);

        assertNotNull(response);
        assertEquals(Status.ACCEPTED, response.getStatus());
        assertEquals("Test comment", response.getComment());
        verify(reviewRepository, times(1)).getReviewResponseByPostId(101L);
    }

    @Test
    void setPostStatus_ShouldUpdateStatus_WhenReviewExists() throws Exception {
        when(reviewRepository.findById(1L)).thenReturn(Optional.of(testReview));

        testReviewRequest.setStatus(Status.DENIED);
        reviewService.setPostStatus(1L, testReviewRequest);

        assertEquals(Status.DENIED, testReview.getStatus());
        verify(reviewRepository, times(1)).save(testReview);
    }

    @Test
    void setPostStatus_ShouldThrowException_WhenReviewDoesNotExist() {
        when(reviewRepository.findById(1L)).thenReturn(Optional.empty());

        Exception exception = assertThrows(Exception.class, () -> reviewService.setPostStatus(1L, testReviewRequest));
        assertEquals("Review with ID: 1 doesn't exist.", exception.getMessage());
    }

    @Test
    void addReview_ShouldSaveReview() {
        reviewService.addReview(testReviewRequest);

        verify(reviewRepository, times(1)).save(any(Review.class));
    }

    @Test
    void addComment_ShouldUpdateComment_WhenReviewExists() throws Exception {
        when(reviewRepository.findById(1L)).thenReturn(Optional.of(testReview));

        reviewService.addComment(1L, "Updated comment");

        assertEquals("Updated comment", testReview.getComment());
        verify(reviewRepository, times(1)).save(testReview);
    }

    @Test
    void addComment_ShouldThrowException_WhenReviewDoesNotExist() {
        when(reviewRepository.findById(1L)).thenReturn(Optional.empty());

        Exception exception = assertThrows(Exception.class, () -> reviewService.addComment(1L, "Updated comment"));
        assertEquals("Review with ID: 1 doesn't exist.", exception.getMessage());
    }

    @Test
    void deleteComment_ShouldDeleteReview() {
        doNothing().when(reviewRepository).deleteById(1L);

        reviewService.deleteComment(1L);

        verify(reviewRepository, times(1)).deleteById(1L);
    }
}
