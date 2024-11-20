package be.pxl.services.services;

import be.pxl.services.domain.Comment;
import be.pxl.services.domain.Post;
import be.pxl.services.domain.dto.CommentRequest;
import be.pxl.services.domain.dto.CommentResponse;
import be.pxl.services.repository.CommentRepository;
import be.pxl.services.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
@Service
@RequiredArgsConstructor
public class CommentService implements ICommentService{
    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    @Override
    public List<CommentResponse> findCommentByPostId(Long postId) {
        List<Comment> comments = commentRepository.findCommentByPostId(postId);
        return comments.stream().map(this::mapToCommentResponse).toList();
    }

    @Override
    public void add(CommentRequest commentRequest) {
        commentRepository.save(mapToComment(commentRequest));
    }

    @Override
    public void update(Long id, CommentRequest commentRequest) throws Exception {
        Comment comment = commentRepository.findById(id).orElseThrow(() -> new Exception("Comment with ID: " + id + " doesn't exist."));

        comment.setComment(commentRequest.getComment());
        comment.setUsername(commentRequest.getUsername());
        comment.setPostId(commentRequest.getPostId());

        commentRepository.save(comment);
    }

    @Override
    public void delete(Long id) {
        commentRepository.deleteById(id);
    }

    private Comment mapToComment(CommentRequest commentRequest){
        return Comment.builder()
                .postId(commentRequest.getPostId())
                .comment(commentRequest.getComment())
                .username(commentRequest.getUsername())
                .build();
    }

    private CommentResponse mapToCommentResponse(Comment comment){
        return CommentResponse.builder()
                .id(comment.getId())
                .postId(comment.getPostId())
                .comment(comment.getComment())
                .username(comment.getUsername())
                .build();
    }
}
