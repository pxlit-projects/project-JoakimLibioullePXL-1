package be.pxl.services.controller;

import be.pxl.services.domain.dto.PostRequest;
import be.pxl.services.services.IPostService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/post")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class PostController {
    private final IPostService postService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void add(@RequestBody PostRequest postRequest){
        System.out.println("New post: " + postRequest);
        postService.add(postRequest);
    }

    @PutMapping("{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void update(@PathVariable Long id, @RequestBody PostRequest postRequest) throws Exception {
        System.out.println("Update post: " + id);
        postService.update(id, postRequest);
    }

    @GetMapping
    public ResponseEntity getAll(){
        return new ResponseEntity(postService.getAll(), HttpStatus.OK);
    }

    @GetMapping("/isConcept")
    public ResponseEntity getAllConcepts(){
        return new ResponseEntity(postService.getAllConcepts(), HttpStatus.OK);
    }

    @GetMapping("/isPublished")
    public ResponseEntity getAllPublished(){
        return new ResponseEntity(postService.getAllPublished(), HttpStatus.OK);
    }
}
