import { TestBed } from '@angular/core/testing';
import { CommentService } from './comment.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

interface Comment {
  postId: number;
  username: string;
  comment: string;
}

describe('CommentService', () => {
  let service: CommentService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CommentService],
    });
    service = TestBed.inject(CommentService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verifieer dat er geen openstaande HTTP-verzoeken zijn
    httpMock.verify();
  });

  it('should fetch comments for a post', () => {
    const mockComments: Comment[] = [
      { postId: 1, username: 'user1', comment: 'Nice post!' },
      { postId: 1, username: 'user2', comment: 'Great work!' },
    ];

    service.getCommentByPostId(1).subscribe((comments) => {
      expect(comments).toEqual(mockComments);
    });

    // Controleer dat de juiste URL wordt aangeroepen
    const req = httpMock.expectOne('http://localhost:8083/comment/api/comment/1'); // Correcte endpoint
    expect(req.request.method).toBe('GET');
    req.flush(mockComments); // Fake de respons
  });

  it('should post a new comment', () => {
    const newComment: Comment = { postId: 1, username: 'user3', comment: 'Interesting!' };

    service.addComment(newComment).subscribe((comment) => {
      expect(comment).toEqual(newComment);
    });

    // Controleer dat de juiste URL wordt aangeroepen
    const req = httpMock.expectOne('http://localhost:8083/comment/api/comment'); // Verdere controle kan hier nodig zijn
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newComment);
    req.flush(newComment); // Fake de respons
  });
});
