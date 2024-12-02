package be.pxl.services.services;

import be.pxl.services.domain.Review;
import be.pxl.services.domain.dto.ReviewRequest;
import be.pxl.services.domain.dto.ReviewResponse;
import be.pxl.services.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewService implements IReviewService{
    private final ReviewRepository reviewRepository;

    @Override
    public List<ReviewResponse> getAllReviews() {
        List<Review> reviews = reviewRepository.findAll();
        return reviews.stream().map(this::mapToReviewResponse).toList();
    }

    @Override
    public ReviewResponse getReviewResponseByPostId(Long id) {
        return reviewRepository.getReviewResponseByPostId(id);
    }


    @Override
    public void setPostStatus(Long id, ReviewRequest reviewRequest) throws Exception {
        Review review = reviewRepository.findById(id).orElseThrow(() -> new Exception("Review with ID: " + id + " doesn't exist."));

        review.setStatus(reviewRequest.getStatus());
        reviewRepository.save(review);
    }

    @Override
    public void addReview(ReviewRequest reviewRequest) {
        reviewRepository.save(mapToReview(reviewRequest));
    }

    @Override
    public void addComment(Long id, String comment) throws Exception {
        Review review = reviewRepository.findById(id).orElseThrow(() -> new Exception("Review with ID: " + id + " doesn't exist."));

        review.setComment(comment);
        reviewRepository.save(review);
    }


    @Override
    public void deleteComment(Long id) {
        reviewRepository.deleteById(id);
    }

    private Review mapToReview(ReviewRequest reviewRequest){
        return Review.builder()
                .postId(reviewRequest.getPostId())
                .status(reviewRequest.getStatus())
                .comment(reviewRequest.getComment())
                .build();
    }

    private ReviewResponse mapToReviewResponse(Review review){
        return ReviewResponse.builder()
                .postId(review.getPostId())
                .status(review.getStatus())
                .id(review.getId())
                .comment(review.getComment())
                .build();

    }
}
