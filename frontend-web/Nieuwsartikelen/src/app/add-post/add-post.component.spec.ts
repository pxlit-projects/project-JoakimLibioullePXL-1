import { TestBed, ComponentFixture } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { AddPostComponent } from './add-post.component';
import { importProvidersFrom } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { PostService } from '../shared/services/post.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing'

describe('AddPostComponent', () => {
  let component: AddPostComponent;
  let fixture: ComponentFixture<AddPostComponent>;
  let mockPostService: jasmine.SpyObj<PostService>;
  let mockRouter: jasmine.SpyObj<Router>;

  let postServiceSpy: jasmine.SpyObj<PostService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    // Mock services
    postServiceSpy = jasmine.createSpyObj('PostService', ['addPost']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule, // Voeg deze toe in plaats van provideHttpClient
        AddPostComponent,       // Voeg je standalone component toe
      ],
      providers: [
        { provide: PostService, useValue: postServiceSpy },
        { provide: Router, useValue: routerSpy },
      ],
    });

    setupFixture();
    component = fixture.componentInstance;
  });

  function setupFixture(): void {
    fixture = TestBed.createComponent(AddPostComponent);
    component = fixture.componentInstance;
    mockPostService = postServiceSpy;
    mockRouter = routerSpy;
  }

  function fillForm(data: Partial<{ title: string; text: string; author: string; category: string; isConcept: boolean }>): void {
    component.postForm.patchValue(data);
  }
  describe('Initialisatie', () => {
    it('moet de component correct initialiseren', () => {
      expect(component).toBeTruthy();
      expect(component.postForm).toBeDefined();
    });
  });

  describe('Formulier validatie', () => {
    it('moet ongeldig zijn wanneer het formulier leeg is', invalidForm);

    function invalidForm(): void {
      expect(component.postForm.valid).toBeFalse();
    }

    it('moet geldig zijn wanneer het formulier correct is ingevuld', validForm);

    function validForm(): void {
      fillForm({
        title: 'Test Title',
        text: 'Test Text',
        author: 'Test Author',
        category: 'Test Category',
        isConcept: false,
      });
      expect(component.postForm.valid).toBeTrue();
    }
  });

  describe('onSubmit', () => {
    it('mag niets doen als het formulier ongeldig is', doNothingWhenInvalid);

    function doNothingWhenInvalid(): void {
      component.onSubmit();
      expect(mockPostService.addPost).not.toHaveBeenCalled();
      expect(mockRouter.navigate).not.toHaveBeenCalled();
    }

    it('moet de post toevoegen en navigeren als het formulier geldig is', addPostAndNavigate);

    function addPostAndNavigate(): void {
      const newPost = {
        title: 'Test Title',
        text: 'Test Text',
        author: 'Test Author',
        category: 'Test Category',
        isConcept: false,
      };

      mockPostService.addPost.and.returnValue(of(newPost));
      fillForm(newPost);
      component.onSubmit();
      expect(mockPostService.addPost).toHaveBeenCalledWith(newPost);
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/published']);
    }
  });

  describe('toggleIsConcept', () => {
    it('moet de waarde van isConcept omdraaien', () => {
      // Zet een initiële waarde
      component.postForm.get('isConcept')?.setValue(true);

      component.toggleIsConcept();

      // Controleer of de waarde correct is veranderd
      expect(component.postForm.get('isConcept')?.value).toBeFalse();

      component.toggleIsConcept();
      expect(component.postForm.get('isConcept')?.value).toBeTrue();
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

      expect(component.postForm.value).toEqual({
        title: '',
        text: '',
        author: '',
        category: '',
        isConcept: false, // Standaard isConcept waarde
      });
    });
  });
});
