package be.pxl.services.services;

import be.pxl.services.domain.Post;
import be.pxl.services.domain.dto.LogRequest;
import be.pxl.services.domain.dto.PostRequest;
import be.pxl.services.domain.dto.PostResponse;
import be.pxl.services.repository.PostRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService implements IPostService{
    private final PostRepository postRepository;

    private final RabbitTemplate rabbitTemplate;
    private final ObjectMapper objectMapper;
    private static final Logger log = LoggerFactory.getLogger(PostService.class);
    @Override
    public void add(PostRequest postRequest) {
        postRepository.save(mapToPost(postRequest));
        log.info("Post added successfully!");
    }

    @Override
    public void update(Long id, PostRequest postRequest) throws Exception {
        Post post = postRepository.findById(id).orElseThrow(() -> new Exception("Post with ID: " + id + " doesn't exist."));

        post.setTitle(postRequest.getTitle());
        post.setText(postRequest.getText());
        post.setText(postRequest.getText());
        post.setCategory(postRequest.getCategory());
        post.setConcept(postRequest.isConcept());
        post.setAuthor(postRequest.getAuthor());

        LogRequest logRequest = new LogRequest();
        logRequest.setUsername(postRequest.getAuthor());
        logRequest.setTimestamp(LocalDateTime.now());
        String action = "Updated: post" + post;
        logRequest.setAction(action);

        try{
            String jsonString = objectMapper.writeValueAsString(logRequest);
            rabbitTemplate.convertAndSend("log-changes-post-queue", jsonString);
            log.info("Post changes sent to queue successfully!");
        } catch (JsonProcessingException e){
            throw new RuntimeException(e);
        }
        postRepository.save(post);
        log.info("Post updates successfully!");
    }

    @Override
    public PostResponse getById(Long id) throws Exception {
        return mapToPostResponse(postRepository.findById(id).orElseThrow(() -> new Exception("Post with ID:" + id + " doesn't exist.")));
    }

    @Override
    public List<PostResponse> getAll() {
        List<Post> posts = postRepository.findAll();
        return posts.stream().map(this::mapToPostResponse).toList();

    }

    @Override
    public List<PostResponse> getAllConcepts() {
        List<Post> posts = postRepository.findByIsConceptTrue();
        return posts.stream().map(this::mapToPostResponse).toList();
    }

    @Override
    public List<PostResponse> getAllPublished() {
        List<Post> posts = postRepository.findByIsConceptFalse();
        return posts.stream().map(this::mapToPostResponse).toList();
    }

    private Post mapToPost(PostRequest postRequest){
        return Post.builder()
                .title(postRequest.getTitle())
                .text(postRequest.getText())
                .author(postRequest.getAuthor())
                .category(postRequest.getCategory())
                .isConcept(postRequest.isConcept())
                .createdAt(LocalDateTime.now())
                .build();
    }

    private PostResponse mapToPostResponse(Post post){
        return PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .author(post.getAuthor())
                .category(post.getCategory())
                .text(post.getText())
                .isConcept(post.isConcept())
                .createdAt(post.getCreatedAt())
                .build();
    }
}
