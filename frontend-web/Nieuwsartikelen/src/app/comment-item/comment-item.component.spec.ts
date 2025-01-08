import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { CommentItemComponent } from './comment-item.component';
import { CommentService } from '../shared/services/comment.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser'; // Om DOM-elementen te selecteren
describe('CommentItemComponent', () => {
  let component: CommentItemComponent;
  let fixture: ComponentFixture<CommentItemComponent>;
  let mockCommentService: jasmine.SpyObj<CommentService>;
  let mockActivatedRoute: any;

  beforeEach(() => {
    // Mock van ActivatedRoute
    mockActivatedRoute = { snapshot: { params: { id: 1 } } };

    // Mock van CommentService
    mockCommentService = jasmine.createSpyObj('CommentService', ['updateComment', 'deleteComment']);

    TestBed.configureTestingModule({
      imports: [FormsModule, CommentItemComponent],
      providers: [
        { provide: CommentService, useValue: mockCommentService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    });

    fixture = TestBed.createComponent(CommentItemComponent);
    component = fixture.componentInstance;
  });

  it('moet de component correct initialiseren', () => {
    // Stel de input-property in
    component.comment = {
      id: 1,
      comment: 'Test comment',
      postId: 5,
      username: 'TestUser',
    };

    fixture.detectChanges(); // Voer Angular detectie uit

    expect(component).toBeTruthy();
    expect(component.editing).toBeFalse();
    expect(component.id).toBe(1); // ID uit mockActivatedRoute
  });

  it('moet de bewerkmodus starten', () => {
    component.comment = {
      id: 1,
      comment: 'Oude comment',
      postId: 5,
      username: 'TestUser',
    };

    component.startEditing();

    expect(component.editing).toBeTrue();
    expect(component.editedComment).toEqual('Oude comment'); // Ingevuld met bestaande waarde
  });

  it('moet een comment opslaan', fakeAsync(() => {
    component.comment = {
      id: 1,
      comment: 'Oude comment',
      postId: 5,
      username: 'TestUser',
    };

    component.startEditing();
    component.editedComment = 'Nieuwe comment';

    mockCommentService.updateComment.and.returnValue(of(void 0)); // Mock API call

    component.saveComment();
    tick(); // Handel observables af

    expect(mockCommentService.updateComment).toHaveBeenCalledWith(1, {
      id: 1,
      comment: 'Nieuwe comment',
      postId: 5,
      username: 'TestUser',
    });
    expect(component.comment.comment).toBe('Nieuwe comment');
    expect(component.editing).toBeFalse(); // Moet weer false zijn
  }));

  it('mag geen lege of spatie-only comment opslaan', () => {
    component.comment = {
      id: 1,
      comment: 'Oude comment',
      postId: 5,
      username: 'TestUser',
    };

    component.startEditing();
    component.editedComment = '   '; // Alleen spaties

    component.saveComment();

    expect(mockCommentService.updateComment).not.toHaveBeenCalled();
    expect(component.editing).toBeTrue(); // Blijft bewerken
  });

  it('moet een comment verwijderen', fakeAsync(() => {
    component.comment = {
      id: 1,
      comment: 'Test comment',
      postId: 5,
      username: 'TestUser',
    };

    mockCommentService.deleteComment.and.returnValue(of(void 0)); // Mock API call

    component.deleteComment();
    tick(); // Handel observables af

    expect(mockCommentService.deleteComment).toHaveBeenCalledWith(1);
  }));

  it('moet geen originele comment updaten bij annuleren', () => {
    component.comment = {
      id: 1,
      comment: 'Originele comment',
      postId: 5,
      username: 'TestUser',
    };

    component.startEditing();
    component.editedComment = 'Gewijzigde comment';

    // Annuleren door niet op slaan
    component.editing = false;

    expect(component.comment.comment).toEqual('Originele comment'); // Originele comment moet intact zijn
  });
});

describe('CommentItemComponent DOM Tests', () => {
  let component: CommentItemComponent;
  let fixture: ComponentFixture<CommentItemComponent>;
  let mockCommentService: jasmine.SpyObj<CommentService>;
  let mockActivatedRoute: any;

  beforeEach(() => {
    mockActivatedRoute = { snapshot: { params: { id: 1 } } };
    mockCommentService = jasmine.createSpyObj('CommentService', ['updateComment', 'deleteComment']);

    TestBed.configureTestingModule({
      declarations: [CommentItemComponent],
      imports: [FormsModule],
      providers: [
        { provide: CommentService, useValue: mockCommentService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
      ],
    });

    fixture = TestBed.createComponent(CommentItemComponent);
    component = fixture.componentInstance;
    component.comment = {
      id: 1,
      comment: 'Test comment',
      postId: 5,
      username: 'TestUser',
    };

    fixture.detectChanges();
  });

  it('moet de comment weergeven in de DOM', () => {
    const commentText = fixture.debugElement.query(By.css('.comment-text')).nativeElement;
    expect(commentText.textContent).toContain('Test comment');
  });

  it('moet een input veld tonen wanneer de bewerkmodus start', fakeAsync(() => {
    const editButton = fixture.debugElement.query(By.css('.edit-button')).nativeElement;
    editButton.click();

    fixture.detectChanges();
    tick();

    const inputField = fixture.debugElement.query(By.css('.comment-input')).nativeElement;
    expect(inputField).toBeTruthy();
    expect(inputField.value).toBe('Test comment');
  }));

  it('moet een gewijzigde comment opslaan en tonen in de DOM', fakeAsync(() => {
    const editButton = fixture.debugElement.query(By.css('.edit-button')).nativeElement;
    editButton.click();

    fixture.detectChanges();
    tick();

    const inputField = fixture.debugElement.query(By.css('.comment-input')).nativeElement;
    inputField.value = 'Gewijzigde comment';
    inputField.dispatchEvent(new Event('input'));

    const saveButton = fixture.debugElement.query(By.css('.save-button')).nativeElement;
    mockCommentService.updateComment.and.returnValue(of(void 0));
    saveButton.click();

    fixture.detectChanges();
    tick();

    expect(mockCommentService.updateComment).toHaveBeenCalledWith(1, jasmine.objectContaining({ comment: 'Gewijzigde comment' }));
    const commentText = fixture.debugElement.query(By.css('.comment-text')).nativeElement;
    expect(commentText.textContent).toContain('Gewijzigde comment');
  }));

  it('moet de originele waarde herstellen bij annuleren', fakeAsync(() => {
    const editButton = fixture.debugElement.query(By.css('.edit-button')).nativeElement;
    editButton.click();

    fixture.detectChanges();
    tick();

    const inputField = fixture.debugElement.query(By.css('.comment-input')).nativeElement;
    inputField.value = 'Gewijzigde comment';
    inputField.dispatchEvent(new Event('input'));

    const cancelButton = fixture.debugElement.query(By.css('.cancel-button')).nativeElement;
    cancelButton.click();

    fixture.detectChanges();
    tick();

    const commentText = fixture.debugElement.query(By.css('.comment-text')).nativeElement;
    expect(commentText.textContent).toContain('Test comment');
  }));

  it('moet een comment verwijderen uit de DOM', fakeAsync(() => {
    mockCommentService.deleteComment.and.returnValue(of(void 0));

    const deleteButton = fixture.debugElement.query(By.css('.delete-button')).nativeElement;
    deleteButton.click();

    fixture.detectChanges();
    tick();

    const componentElement = fixture.debugElement.query(By.css('app-comment-item'));
    expect(componentElement).toBeFalsy();
    expect(mockCommentService.deleteComment).toHaveBeenCalledWith(1);
  }));
});
