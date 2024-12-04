package be.pxl.services;

import be.pxl.services.controller.PostController;
import be.pxl.services.domain.dto.PostRequest;
import be.pxl.services.domain.dto.PostResponse;
import be.pxl.services.services.IPostService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(PostController.class)
class PostControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private IPostService postService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void add_ShouldReturnCreatedStatus() throws Exception {
        PostRequest postRequest = new PostRequest();
        postRequest.setTitle("Test Title");
        postRequest.setText("Test Text");
        postRequest.setAuthor("Author");
        postRequest.setCategory("Category");
        postRequest.setConcept(true);

        mockMvc.perform(post("/api/post")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(postRequest)))
                .andExpect(status().isCreated());

        verify(postService, times(1)).add(any(PostRequest.class));
    }

    @Test
    void update_ShouldReturnNoContentStatus() throws Exception {
        PostRequest postRequest = new PostRequest();
        postRequest.setTitle("Updated Title");
        postRequest.setText("Updated Text");
        postRequest.setAuthor("Author");
        postRequest.setCategory("Category");
        postRequest.setConcept(false);

        doNothing().when(postService).update(eq(1L), any(PostRequest.class));

        mockMvc.perform(put("/api/post/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(postRequest)))
                .andExpect(status().isNoContent());

        verify(postService, times(1)).update(eq(1L), any(PostRequest.class));
    }

    @Test
    void getAll_ShouldReturnListOfPosts() throws Exception {
        PostResponse postResponse = PostResponse.builder()
                .id(1L)
                .title("Test Title")
                .author("Author")
                .category("Category")
                .text("Test Text")
                .isConcept(true)
                .build();

        when(postService.getAll()).thenReturn(List.of(postResponse));

        mockMvc.perform(get("/api/post")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Test Title"));

        verify(postService, times(1)).getAll();
    }

    @Test
    void getById_ShouldReturnPostResponse() throws Exception {
        PostResponse postResponse = PostResponse.builder()
                .id(1L)
                .title("Test Title")
                .author("Author")
                .category("Category")
                .text("Test Text")
                .isConcept(true)
                .build();

        when(postService.getById(1L)).thenReturn(postResponse);

        mockMvc.perform(get("/api/post/1")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title").value("Test Title"));

        verify(postService, times(1)).getById(1L);
    }

    @Test
    void getAllConcepts_ShouldReturnListOfConceptPosts() throws Exception {
        PostResponse postResponse = PostResponse.builder()
                .id(1L)
                .title("Test Concept Post")
                .author("Author")
                .category("Category")
                .text("Concept Text")
                .isConcept(true)
                .build();

        when(postService.getAllConcepts()).thenReturn(List.of(postResponse));

        mockMvc.perform(get("/api/post/isConcept")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Test Concept Post"));

        verify(postService, times(1)).getAllConcepts();
    }

    @Test
    void getAllPublished_ShouldReturnListOfPublishedPosts() throws Exception {
        PostResponse postResponse = PostResponse.builder()
                .id(1L)
                .title("Test Published Post")
                .author("Author")
                .category("Category")
                .text("Published Text")
                .isConcept(false)
                .build();

        when(postService.getAllPublished()).thenReturn(List.of(postResponse));

        mockMvc.perform(get("/api/post/isPublished")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].title").value("Test Published Post"));

        verify(postService, times(1)).getAllPublished();
    }
}
