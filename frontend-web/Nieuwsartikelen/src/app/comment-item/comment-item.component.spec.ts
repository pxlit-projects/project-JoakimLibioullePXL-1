import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { CommentItemComponent } from './comment-item.component';
import { CommentService } from '../shared/services/comment.service';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';

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
