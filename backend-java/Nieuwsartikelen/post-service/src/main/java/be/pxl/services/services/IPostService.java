package be.pxl.services.services;

import be.pxl.services.domain.dto.PostRequest;
import be.pxl.services.domain.dto.PostResponse;

import java.util.List;

public interface IPostService {
    void add(PostRequest postRequest);
    void update(Long id, PostRequest postRequest) throws Exception;

    PostResponse getById(Long id) throws Exception;
    List<PostResponse> getAll();
    List<PostResponse> getAllConcepts();
    List<PostResponse> getAllPublished();
}
