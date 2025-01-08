import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostPublishedListComponent } from './post-publishedlist.component';
import { PostService } from '../shared/services/post.service'; // Zorg dat het pad correct is
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';
import { Post } from '../shared/models/post.model';
import { PostFilter } from '../shared/models/filter.model';
import { CommonModule } from '@angular/common'; // Vergeet CommonModule niet als onderdeel van imports

describe('PostPublishedListComponent', () => {
  let component: PostPublishedListComponent;
  let fixture: ComponentFixture<PostPublishedListComponent>;
  let mockPostService: jasmine.SpyObj<PostService>;

  beforeEach(() => {
    // Maak een mock van PostService met spies
    mockPostService = jasmine.createSpyObj('PostService', ['getAllPublished', 'filterPublishedPosts']);

    // Mock de standaard gedrag van getAllPublished
    mockPostService.getAllPublished.and.returnValue(of([{ id: 1, title: 'Test Post', text: 'Test Content', author: 'Test Author', category: 'Test Category', isConcept: false } as Post]));

    TestBed.configureTestingModule({
      imports: [PostPublishedListComponent, CommonModule], // Importeer je standalone component
      providers: [
        { provide: PostService, useValue: mockPostService } // Gebruik de gemockte service
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(PostPublishedListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call getAllPublished from PostService and populate posts', () => {
      // Controleer init logs
      expect(mockPostService.getAllPublished).toHaveBeenCalled();

      // Controleer data van posts
      expect(component.posts.length).toBe(1); // Controleer aantal mock posts
      expect(component.posts[0].title).toBe('Test Post'); // Controleer voorbeeld data
    });
  });

  describe('handleFilter', () => {
    it('should call filterPublishedPosts with correct filter and update the posts', () => {
      const mockFilter: PostFilter = { title: 'Angular', text: '', author: '', category: '' }; // Mock filter
      const filteredPosts = [
        { id: 2, title: 'Filtered Post', text: 'Filtered Content', author: 'Filtered Author', category: 'Filtered Category', isConcept: false } as Post
      ];

      // Stel het gedrag van filterPublishedPosts in
      mockPostService.filterPublishedPosts.and.returnValue(of(filteredPosts));

      // Roep handleFilter aan
      component.handleFilter(mockFilter);
      fixture.detectChanges();

      // Controleer de calls met het juiste filter
      expect(mockPostService.filterPublishedPosts).toHaveBeenCalledWith(mockFilter);

      // Controleer de posts updates
      expect(component.posts.length).toBe(1);
      expect(component.posts[0].title).toBe('Filtered Post');
    });
  });

  describe('template interactions', () => {
    it('should render posts in the template', () => {
      // Zorg ervoor dat posts op het scherm verschijnen
      const postElements = fixture.debugElement.queryAll(By.css('.post-item')); // Pas de selector aan op je template
      expect(postElements.length).toBe(1); // Controleer of het aantal overeenkomt
      expect(postElements[0].nativeElement.textContent).toContain('Test Post'); // Controleer dat de post-titel klopt
    });

    it('should call handleFilter when FilterComponent emits a filter', () => {
      spyOn(component, 'handleFilter'); // Spy op de handleFilter functie

      const filterComponent = fixture.debugElement.query(By.css('app-filter')); // Selecteer app-filter
      filterComponent.triggerEventHandler('filter', { title: 'Angular' }); // Simuleer een event
      fixture.detectChanges();

      // Controleer of handleFilter is aangeroepen
      expect(component.handleFilter).toHaveBeenCalledWith({ title: 'Angular', text: '', author: '', category: '' });
    });
  });
});
