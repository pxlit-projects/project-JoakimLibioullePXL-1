package be.pxl.services.controller;

import be.pxl.services.domain.dto.CommentRequest;
import be.pxl.services.services.ICommentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/comment")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class CommentController {
    private final ICommentService commentService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void add(@RequestBody CommentRequest commentRequest){
        System.out.println("Comment added: " + commentRequest);
        commentService.add(commentRequest);
    }

    @PutMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void update(@PathVariable Long id, @RequestBody CommentRequest commentRequest) throws Exception {
        commentService.update(id, commentRequest);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id){
        commentService.delete(id);
    }

    @GetMapping("/{id}")
    public ResponseEntity findCommentByPostId(@PathVariable Long id){
        return new ResponseEntity(commentService.findCommentByPostId(id), HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity getAll(){
        return new ResponseEntity(commentService.getAllComments(), HttpStatus.OK);
    }
}
