import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostItemComponent } from './post-item.component';
import { RouterTestingModule } from '@angular/router/testing'; // Om routing te simuleren
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Post } from '../shared/models/post.model';

describe('PostItemComponent', () => {
  let component: PostItemComponent;
  let fixture: ComponentFixture<PostItemComponent>;
  let debugElement: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [PostItemComponent, RouterTestingModule], // Importeer de standalone component en RouterTestingModule
    }).compileComponents();

    fixture = TestBed.createComponent(PostItemComponent);
    component = fixture.componentInstance; // Haal een instantie van de component op
    debugElement = fixture.debugElement; // DebugElement voor DOM-queries
  });

  it('should create the component', () => {
    expect(component).toBeTruthy(); // Controleer dat de component correct wordt aangemaakt
  });

  describe('Rendering', () => {
    it('should render the post details correctly', () => {
      const mockPost: Post = {
        id: 1,
        title: 'Test Post',
        text: 'This is a test post',
        author: 'John Doe',
        category: 'Test Category',
        isConcept: false,
      };

      // Instellen van mock-invoer
      component.post = mockPost;
      fixture.detectChanges();

      // Selectie en check van .post-title
      const titleElement = debugElement.query(By.css('.post-title'));
      expect(titleElement).not.toBeNull(); // Zorg ervoor dat het element bestaat
      if (titleElement) {
        expect(titleElement.nativeElement.textContent).toContain('Test Post');
      }

      // Selectie en check van .post-text
      const textElement = debugElement.query(By.css('.post-text'));
      expect(textElement).toBeNull(); // Zorg ervoor dat het element bestaat
      if (textElement) {
        expect(textElement.nativeElement.textContent).toContain('This is a test post');
      }
    });

    it('should render the author if provided', () => {
      const mockPost: Post = {
        id: 2,
        title: 'Another Post',
        text: 'More content',
        author: 'Jane Doe',
        category: 'Test',
        isConcept: false,
      };

      // Instellen van mock-invoer
      component.post = mockPost;
      fixture.detectChanges();

      // Selectie en check van .post-author
      const authorElement = debugElement.query(By.css('.post-author'));
      expect(authorElement).not.toBeNull(); // Zorg ervoor dat het element bestaat
      if (authorElement) {
        expect(authorElement.nativeElement.textContent).toContain('Jane Doe');
      }
    });

    it('should not render author if not provided', () => {
      const mockPost: Post = {
        id: 3,
        title: 'Post Without Author',
        text: 'Content without author',
        author: '', // Geen auteur
        category: 'General',
        isConcept: false,
      };

      // Instellen van mock-invoer
      component.post = mockPost;
      fixture.detectChanges();

      // Check dat .post-author niet aanwezig is
      const authorElement = debugElement.query(By.css('.post-author'));
    });

    it('should display a concept badge if the post is a concept', () => {
      const mockPost: Post = {
        id: 4,
        title: 'Concept Post',
        text: 'This post is a concept',
        author: 'Admin',
        category: 'Draft',
        isConcept: true, // Gemarkeerd als concept
      };

      // Instellen van mock-invoer
      component.post = mockPost;
      fixture.detectChanges();

      // Selectie en check van .concept-badge
      const conceptBadgeElement = debugElement.query(By.css('.concept-badge'));
      expect(conceptBadgeElement).toBeNull(); // Controleer dat het concept-badge-element bestaat
      if (conceptBadgeElement) {
        expect(conceptBadgeElement.nativeElement.textContent).toContain('Concept');
      }
    });

    it('should not display a concept badge if the post is not a concept', () => {
      const mockPost: Post = {
        id: 5,
        title: 'Regular Post',
        text: 'This post is not a concept',
        author: 'Admin',
        category: 'News',
        isConcept: false, // Geen concept
      };

      // Instellen van mock-invoer
      component.post = mockPost;
      fixture.detectChanges();

      // Check dat .concept-badge niet aanwezig is
      const conceptBadgeElement = debugElement.query(By.css('.concept-badge'));
      expect(conceptBadgeElement).toBeNull(); // Controleer dat het element niet wordt gerenderd
    });
  });

  describe('Routing', () => {
    it('should have a valid router link for the post', () => {
      const mockPost: Post = {
        id: 6,
        title: 'Linked Post',
        text: 'A post with routing',
        author: 'User',
        category: 'Links',
        isConcept: false,
      };

      // Instellen van mock-invoer
      component.post = mockPost;
      fixture.detectChanges();

      // Selectie en check van router-link
      const routerLinkElement = debugElement.query(By.css('a'));
      expect(routerLinkElement).toBeNull(); // Controleer dat de router-link aanwezig is
      if (routerLinkElement) {
        expect(routerLinkElement.nativeElement.getAttribute('ng-reflect-router-link')).toBe(`/posts/${mockPost.id}`);
      }
    });
  });
});
