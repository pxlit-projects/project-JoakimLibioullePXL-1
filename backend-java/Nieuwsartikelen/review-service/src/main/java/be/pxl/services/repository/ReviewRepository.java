package be.pxl.services.repository;

import be.pxl.services.domain.Review;
import be.pxl.services.domain.dto.ReviewResponse;
import feign.Param;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    @Query("SELECT new be.pxl.services.domain.dto.ReviewResponse(r.id, r.postId, r.status, r.comment) " +
            "FROM Review r WHERE r.postId = :id")
    ReviewResponse getReviewResponseByPostId(@Param("id") Long id);
}
