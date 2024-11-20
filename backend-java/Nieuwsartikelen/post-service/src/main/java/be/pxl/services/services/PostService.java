package be.pxl.services.services;

import be.pxl.services.domain.Post;
import be.pxl.services.domain.dto.PostRequest;
import be.pxl.services.domain.dto.PostResponse;
import be.pxl.services.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PostService implements IPostService{
    private final PostRepository postRepository;
    @Override
    public void add(PostRequest postRequest) {
        postRepository.save(mapToPost(postRequest));
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
        postRepository.save(post);
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
