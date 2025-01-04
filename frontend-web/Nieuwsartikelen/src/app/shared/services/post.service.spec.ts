import { TestBed } from '@angular/core/testing';
import { PostService } from './post.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

interface Post {
  title: string;
  text: string;
  author: string;
  category: string;
  published: boolean;
  isConcept: boolean;
  createdAt?: Date;
  id?: number;
}

describe('PostService', () => {
  let service: PostService;
  let httpMock: HttpTestingController;

  const baseApiUrl = 'http://localhost:8083/post/api/post'; // Consistente URL

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PostService],
    });
    service = TestBed.inject(PostService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // Verifieer geen openstaande requests
  });

  it('should fetch all posts', () => {
    const mockPosts: Post[] = [
      { title: 'Title 1', text: 'Text 1', author: 'Author 1', category: 'Category 1', published: false, isConcept: false },
      { title: 'Title 2', text: 'Text 2', author: 'Author 2', category: 'Category 2', published: true, isConcept: true },
    ];

    service.getAllPosts().subscribe((posts) => {
      expect(posts).toEqual(mockPosts);
    });

    const req = httpMock.expectOne(baseApiUrl); // Controleer de werkelijke endpoint
    expect(req.request.method).toBe('GET'); // Controleer de HTTP-methode
    req.flush(mockPosts); // Fake de serverresponse
  });

  it('should create a new post', () => {
    const newPost: Post = { title: 'Title 3', text: 'Text 3', author: 'Author 3', category: 'Category 3', published: false, isConcept: false };

    service.addPost(newPost).subscribe((post) => {
      expect(post).toEqual(newPost);
    });

    const req = httpMock.expectOne(baseApiUrl);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newPost); // Controleer de request body
    req.flush(newPost); // Fake de serverresponse
  });
});
