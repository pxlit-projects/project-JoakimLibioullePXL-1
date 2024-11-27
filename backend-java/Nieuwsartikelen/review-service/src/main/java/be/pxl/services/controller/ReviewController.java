package be.pxl.services.controller;

import be.pxl.services.domain.dto.ReviewRequest;
import be.pxl.services.services.IReviewService;
import jakarta.ws.rs.Path;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/review")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class ReviewController {
    private final IReviewService reviewService;

    @GetMapping("/{id}")
    public ResponseEntity findReviewByPostId(@PathVariable Long id){
        return new ResponseEntity(reviewService.getReviewByPostId(id), HttpStatus.OK);
    }

    @PutMapping("/{id}")
    public void setPostStatus(@PathVariable Long id, @RequestBody ReviewRequest reviewRequest) throws Exception {
        reviewService.setPostStatus(id, reviewRequest);
    }

    @PutMapping("/{id}")
    public void addComment(@PathVariable Long id, @RequestBody String comment) throws Exception {
        reviewService.addComment(id, comment);
    }

    @PostMapping
    public void addReview(@RequestBody ReviewRequest reviewRequest){
        reviewService.addReview(reviewRequest);
    }

    @DeleteMapping("/{id}")
    public void deleteReview(@PathVariable Long id){
        reviewService.deleteComment(id);
    }
}
