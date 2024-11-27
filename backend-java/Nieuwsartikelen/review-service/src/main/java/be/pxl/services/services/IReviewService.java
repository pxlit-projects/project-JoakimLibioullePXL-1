package be.pxl.services.services;

import be.pxl.services.domain.dto.ReviewRequest;
import be.pxl.services.domain.dto.ReviewResponse;

public interface IReviewService {
    ReviewResponse getReviewByPostId(Long id);
    void setPostStatus(Long id, ReviewRequest reviewRequest) throws Exception;
    void addReview(ReviewRequest reviewRequest);
    void addComment(Long id, String comment) throws Exception;
    void deleteComment(Long id);
}
