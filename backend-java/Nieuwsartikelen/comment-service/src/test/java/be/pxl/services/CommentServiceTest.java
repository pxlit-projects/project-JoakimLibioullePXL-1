package be.pxl.services;

import be.pxl.services.domain.Comment;
import be.pxl.services.domain.dto.CommentRequest;
import be.pxl.services.domain.dto.CommentResponse;
import be.pxl.services.repository.CommentRepository;
import be.pxl.services.repository.PostRepository;
import be.pxl.services.services.CommentService;
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
class CommentServiceTest {

    @Mock
    private CommentRepository commentRepository;

    @Mock
    private PostRepository postRepository;

    @InjectMocks
    private CommentService commentService;

    private Comment testComment;
    private CommentRequest testCommentRequest;

    @BeforeEach
    void setUp() {
        testComment = Comment.builder()
                .id(1L)
                .postId(1L)
                .comment("Test comment")
                .username("TestUser")
                .build();

        testCommentRequest = new CommentRequest();
        testCommentRequest.setPostId(1L);
        testCommentRequest.setComment("New comment");
        testCommentRequest.setUsername("NewUser");
    }

    @Test
    void findCommentByPostId_ShouldReturnComments() {
        when(commentRepository.findCommentByPostId(1L)).thenReturn(List.of(testComment));

        List<CommentResponse> responses = commentService.findCommentByPostId(1L);

        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals("Test comment", responses.get(0).getComment());
        verify(commentRepository, times(1)).findCommentByPostId(1L);
    }

    @Test
    void add_ShouldSaveComment() {
        commentService.add(testCommentRequest);

        verify(commentRepository, times(1)).save(any(Comment.class));
    }

    @Test
    void update_ShouldUpdateComment_WhenCommentExists() throws Exception {
        when(commentRepository.findById(1L)).thenReturn(Optional.of(testComment));

        testCommentRequest.setComment("Updated comment");
        commentService.update(1L, testCommentRequest);

        assertEquals("Updated comment", testComment.getComment());
        assertEquals("NewUser", testComment.getUsername());
        verify(commentRepository, times(1)).save(testComment);
    }

    @Test
    void update_ShouldThrowException_WhenCommentDoesNotExist() {
        when(commentRepository.findById(1L)).thenReturn(Optional.empty());

        Exception exception = assertThrows(Exception.class, () -> commentService.update(1L, testCommentRequest));
        assertEquals("Comment with ID: 1 doesn't exist.", exception.getMessage());
    }

    @Test
    void delete_ShouldDeleteComment() {
        doNothing().when(commentRepository).deleteById(1L);

        commentService.delete(1L);

        verify(commentRepository, times(1)).deleteById(1L);
    }

    @Test
    void getAllComments_ShouldReturnAllComments() {
        when(commentRepository.findAll()).thenReturn(List.of(testComment));

        List<CommentResponse> responses = commentService.getAllComments();

        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals("Test comment", responses.get(0).getComment());
        verify(commentRepository, times(1)).findAll();
    }
}
