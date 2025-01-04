import {ComponentFixture, TestBed, tick} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { EditPostComponent } from './edit-post.component';
import { PostService } from '../shared/services/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('EditPostComponent', () => {
  let component: EditPostComponent;
  let fixture: ComponentFixture<EditPostComponent>;
  let mockPostService: jasmine.SpyObj<PostService>;
  let mockRouter: jasmine.SpyObj<Router>;
  let activatedRouteSpy: jasmine.SpyObj<ActivatedRoute>;

  beforeEach(() => {
    // Mock services
    mockPostService = jasmine.createSpyObj('PostService', ['getPost', 'updatePost']);
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    activatedRouteSpy = jasmine.createSpyObj('ActivatedRoute', [], { snapshot: { params: { id: 1 } } }); // Mock ID
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        EditPostComponent, // Voeg de standalone component toe
      ],
      providers: [
        { provide: PostService, useValue: mockPostService },
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: activatedRouteSpy },
      ],
    });

    fixture = TestBed.createComponent(EditPostComponent);
    component = fixture.componentInstance;
  });

  function fillForm(data: Partial<{ title: string; text: string; author: string; category: string; isConcept: boolean }>): void {
    component.editPostForm.patchValue(data);
  }

  describe('Initialisatie', () => {
    it('moet correct initialiseren', () => {
      expect(component).toBeTruthy();
      expect(component.editPostForm).toBeDefined();
    });

    it('moet de post data laden en het formulier aanvullen', () => {
      const postMock = {
        title: 'Test Title',
        text: 'Test Text',
        author: 'Test Author',
        category: 'Test Category',
        isConcept: false,
      };

      mockPostService.getPost.and.returnValue(of(postMock));

      component.ngOnInit();
      tick();

      expect(mockPostService.getPost).toHaveBeenCalledWith(1); // De ID van de activatedRoute
      expect(component.editPostForm.value).toEqual(postMock);
    });
  });

  describe('Formulier validatie', () => {
    it('moet ongeldig zijn wanneer het formulier leeg is', () => {
      expect(component.editPostForm.valid).toBeFalse();
    });

    it('moet geldig zijn wanneer het formulier correct is ingevuld', () => {
      fillForm({
        title: 'Valid Title',
        text: 'Valid Text',
        author: 'Valid Author',
        category: 'Valid Category',
        isConcept: true,
      });

      expect(component.editPostForm.valid).toBeTrue();
    });
  });

  describe('onSubmit', () => {
    it('mag niets doen als het formulier ongeldig is', () => {
      component.onSubmit();
      expect(mockPostService.updatePost).not.toHaveBeenCalled();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    });

    it('moet de post updaten en navigeren als het formulier geldig is', () => {
      const updatedPost = {
        title: 'Updated Title',
        text: 'Updated Text',
        author: 'Updated Author',
        category: 'Updated Category',
        isConcept: true,
      };

      fillForm(updatedPost); // Vul het formulier

      mockPostService.updatePost.and.returnValue(of(void 0)); // Geef een lege observable terug

      component.onSubmit(); // Roep de onSubmit functie aan

      expect(mockPostService.updatePost).toHaveBeenCalledWith(1, updatedPost); // Controleer of updatePost correct is aangeroepen
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/published']); // Controleer navigatie
    });
  });

  describe('toggleIsConcept', () => {
    it('moet de waarde van isConcept omdraaien', () => {
      // Zet een initiële waarde
      component.editPostForm.get('isConcept')?.setValue(true);

      component.toggleIsConcept();

      // Controleer of de waarde correct is veranderd
      expect(component.editPostForm.get('isConcept')?.value).toBeFalse();

      component.toggleIsConcept();
      expect(component.editPostForm.get('isConcept')?.value).toBeTrue();
    });
  });

  describe('onReset', () => {
    it('moet het formulier resetten naar de standaardwaarden', () => {
      fillForm({
        title: 'Filled Title',
        text: 'Some Text',
        author: 'Author Name',
        category: 'Test Category',
        isConcept: true,
      });

      component.onReset();

      expect(component.editPostForm.value).toEqual({
        title: '',
        text: '',
        author: '',
        category: '',
        isConcept: false,
      });
    });
  });
});
