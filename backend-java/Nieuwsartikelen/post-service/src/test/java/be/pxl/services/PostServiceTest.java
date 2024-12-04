package be.pxl.services;

import be.pxl.services.domain.Post;
import be.pxl.services.domain.dto.PostRequest;
import be.pxl.services.domain.dto.PostResponse;
import be.pxl.services.repository.PostRepository;
import be.pxl.services.services.PostService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PostServiceTest {

    @Mock
    private PostRepository postRepository;

    @InjectMocks
    private PostService postService;

    private Post testPost;
    private PostRequest testPostRequest;

    @BeforeEach
    void setUp() {
        testPost = Post.builder()
                .id(1L)
                .title("Test Post")
                .text("This is a test post")
                .author("Author")
                .category("Category")
                .isConcept(true)
                .createdAt(LocalDateTime.now())
                .build();

        testPostRequest = new PostRequest();
        testPostRequest.setTitle("Test Post");
        testPostRequest.setText("This is a test post");
        testPostRequest.setAuthor("Author");
        testPostRequest.setCategory("Category");
        testPostRequest.setConcept(true);
    }

    @Test
    void add_ShouldSavePost() {
        postService.add(testPostRequest);

        verify(postRepository, times(1)).save(any(Post.class));
    }

    @Test
    void update_ShouldUpdatePost_WhenPostExists() throws Exception {
        when(postRepository.findById(1L)).thenReturn(Optional.of(testPost));

        testPostRequest.setTitle("Updated Title");
        postService.update(1L, testPostRequest);

        assertEquals("Updated Title", testPost.getTitle());
        verify(postRepository, times(1)).save(testPost);
    }

    @Test
    void update_ShouldThrowException_WhenPostDoesNotExist() {
        when(postRepository.findById(1L)).thenReturn(Optional.empty());

        Exception exception = assertThrows(Exception.class, () -> postService.update(1L, testPostRequest));
        assertEquals("Post with ID: 1 doesn't exist.", exception.getMessage());
    }

    @Test
    void getById_ShouldReturnPostResponse_WhenPostExists() throws Exception {
        when(postRepository.findById(1L)).thenReturn(Optional.of(testPost));

        PostResponse response = postService.getById(1L);

        assertNotNull(response);
        assertEquals("Test Post", response.getTitle());
    }

    @Test
    void getById_ShouldThrowException_WhenPostDoesNotExist() {
        when(postRepository.findById(1L)).thenReturn(Optional.empty());

        Exception exception = assertThrows(Exception.class, () -> postService.getById(1L));
        assertEquals("Post with ID:1 doesn't exist.", exception.getMessage());
    }

    @Test
    void getAll_ShouldReturnAllPosts() {
        when(postRepository.findAll()).thenReturn(List.of(testPost));

        List<PostResponse> responses = postService.getAll();

        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertEquals("Test Post", responses.get(0).getTitle());
    }

    @Test
    void getAllConcepts_ShouldReturnOnlyConceptPosts() {
        when(postRepository.findByIsConceptTrue()).thenReturn(List.of(testPost));

        List<PostResponse> responses = postService.getAllConcepts();

        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertTrue(responses.get(0).isConcept());
    }

    @Test
    void getAllPublished_ShouldReturnOnlyPublishedPosts() {
        testPost.setConcept(false);
        when(postRepository.findByIsConceptFalse()).thenReturn(List.of(testPost));

        List<PostResponse> responses = postService.getAllPublished();

        assertNotNull(responses);
        assertEquals(1, responses.size());
        assertFalse(responses.get(0).isConcept());
    }
}

