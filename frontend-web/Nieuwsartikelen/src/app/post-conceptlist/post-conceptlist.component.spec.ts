import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostConceptListComponent } from './post-conceptlist.component';
import { PostService } from '../shared/services/post.service';
import { of } from 'rxjs';
import { Post } from '../shared/models/post.model';
import { PostFilter } from '../shared/models/filter.model';
import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('PostConceptListComponent', () => {
  let component: PostConceptListComponent;
  let fixture: ComponentFixture<PostConceptListComponent>;
  let mockPostService: jasmine.SpyObj<PostService>;

  const mockPosts: Post[] = [
    { id: 1, title: 'Concept 1', text: 'Content 1', author: 'Author 1', category: 'Category 1', isConcept: true },
    { id: 2, title: 'Concept 2', text: 'Content 2', author: 'Author 2', category: 'Category 2', isConcept: true },
  ];

  beforeEach(() => {
    mockPostService = jasmine.createSpyObj('PostService', ['getAllConcepts', 'filterConceptPosts']);

    TestBed.configureTestingModule({
      imports: [PostConceptListComponent], // Add the standalone component directly
      providers: [
        { provide: PostService, useValue: mockPostService },
        {
          // Mock ActivatedRoute in case it is required by child components
          provide: ActivatedRoute,
          useValue: { snapshot: { params: { id: '1' } } },
        },
      ],
    });

    fixture = TestBed.createComponent(PostConceptListComponent);
    component = fixture.componentInstance;
  });

  it('should initialize the component correctly', () => {
    expect(component).toBeTruthy();
    expect(component.posts).toEqual([]);
  });

  it('should load all concept posts on initialization', () => {
    mockPostService.getAllConcepts.and.returnValue(of(mockPosts));

    fixture.detectChanges(); // Trigger ngOnInit lifecycle

    expect(mockPostService.getAllConcepts).toHaveBeenCalled();
    expect(component.posts).toEqual(mockPosts);
  });

  it('should filter posts correctly with handleFilter', () => {
    const mockFilter: PostFilter = { title: 'Concept', text: '', author: '', category: '' };
    const filteredPosts: Post[] = [
      { id: 1, title: 'Concept 1', text: 'Filtered Content', author: 'Author 1', category: 'Category 1', isConcept: true },
    ];

    mockPostService.filterConceptPosts.and.returnValue(of(filteredPosts));

    component.handleFilter(mockFilter);

    expect(mockPostService.filterConceptPosts).toHaveBeenCalledWith(mockFilter);
    expect(component.posts).toEqual(filteredPosts);
  });

  it('should render a list of posts in the template', () => {
    mockPostService.getAllConcepts.and.returnValue(of(mockPosts));

    fixture.detectChanges(); // Run change detection to apply template bindings

    const postItems = fixture.debugElement.queryAll(By.css('app-post-item'));
    expect(postItems.length).toBe(mockPosts.length); // Check number of rendered PostItemComponents
  });
});
