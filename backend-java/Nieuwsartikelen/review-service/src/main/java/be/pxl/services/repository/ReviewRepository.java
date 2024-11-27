package be.pxl.services.repository;

import be.pxl.services.domain.Review;
import be.pxl.services.domain.dto.ReviewResponse;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    ReviewResponse getReviewByPostId(Long id);
}
