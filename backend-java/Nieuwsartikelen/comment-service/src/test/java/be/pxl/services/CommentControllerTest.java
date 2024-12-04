package be.pxl.services;

import be.pxl.services.controller.CommentController;
import be.pxl.services.domain.dto.CommentRequest;
import be.pxl.services.domain.dto.CommentResponse;
import be.pxl.services.services.ICommentService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(CommentController.class)
class CommentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private ICommentService commentService;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void add_ShouldReturnCreatedStatus() throws Exception {
        CommentRequest commentRequest = new CommentRequest();
        commentRequest.setPostId(1L);
        commentRequest.setComment("New comment");
        commentRequest.setUsername("TestUser");

        mockMvc.perform(post("/api/comment")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(commentRequest)))
                .andExpect(status().isCreated());

        verify(commentService, times(1)).add(any(CommentRequest.class));
    }

    @Test
    void update_ShouldReturnNoContentStatus() throws Exception {
        CommentRequest commentRequest = new CommentRequest();
        commentRequest.setPostId(1L);
        commentRequest.setComment("Updated comment");
        commentRequest.setUsername("TestUser");

        doNothing().when(commentService).update(eq(1L), any(CommentRequest.class));

        mockMvc.perform(put("/api/comment/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(commentRequest)))
                .andExpect(status().isNoContent());

        verify(commentService, times(1)).update(eq(1L), any(CommentRequest.class));
    }

    @Test
    void delete_ShouldReturnNoContentStatus() throws Exception {
        doNothing().when(commentService).delete(1L);

        mockMvc.perform(delete("/api/comment/1"))
                .andExpect(status().isNoContent());

        verify(commentService, times(1)).delete(1L);
    }

    @Test
    void findCommentByPostId_ShouldReturnComments() throws Exception {
        CommentResponse commentResponse = CommentResponse.builder()
                .id(1L)
                .postId(1L)
                .comment("Test comment")
                .username("TestUser")
                .build();

        when(commentService.findCommentByPostId(1L)).thenReturn(List.of(commentResponse));

        mockMvc.perform(get("/api/comment/1")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].comment").value("Test comment"));

        verify(commentService, times(1)).findCommentByPostId(1L);
    }

    @Test
    void getAll_ShouldReturnAllComments() throws Exception {
        CommentResponse commentResponse = CommentResponse.builder()
                .id(1L)
                .postId(1L)
                .comment("Test comment")
                .username("TestUser")
                .build();

        when(commentService.getAllComments()).thenReturn(List.of(commentResponse));

        mockMvc.perform(get("/api/comment")
                        .accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].comment").value("Test comment"));

        verify(commentService, times(1)).getAllComments();
    }
}
