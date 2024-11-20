package be.pxl.services.services;

import be.pxl.services.domain.Comment;
import be.pxl.services.domain.dto.CommentRequest;
import be.pxl.services.domain.dto.CommentResponse;

import java.util.List;

public interface ICommentService {
    List<CommentResponse> findCommentByPostId(Long postId);
    void add(CommentRequest commentRequest);
    void update(Long id, CommentRequest commentRequest) throws Exception;
    void delete(Long id);
}
