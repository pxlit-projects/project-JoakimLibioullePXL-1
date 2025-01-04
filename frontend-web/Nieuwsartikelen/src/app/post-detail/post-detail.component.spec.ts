import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PostDetailComponent } from './post-detail.component';
import { PostService } from '../shared/services/post.service';
import { CommentService } from '../shared/services/comment.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { of } from 'rxjs';
import { By } from '@angular/platform-browser';

describe('PostDetailComponent', () => {
  let component: PostDetailComponent;
  let fixture: ComponentFixture<PostDetailComponent>;
  let mockPostService: jasmine.SpyObj<PostService>;
  let mockCommentService: jasmine.SpyObj<CommentService>;
  let mockActivatedRoute: any;

  const mockPost = { id: 1, title: 'Test Post', content: 'This is a test post.', isConcept: false, text: '', author: '', category: '' };
  const mockComments = [
    { id: 1, postId: 1, username: 'User1', comment: 'Great post!' },
    { id: 2, postId: 1, username: 'User2', comment: 'Thanks for sharing.' },
  ];

  beforeEach(() => {
    // Mock services
    mockPostService = jasmine.createSpyObj('PostService', ['getPost']);
    mockCommentService = jasmine.createSpyObj('CommentService', [
      'getCommentByPostId',
      'addComment',
      'deleteComment',
    ]);
    // Provide mock ActivatedRoute
    mockActivatedRoute = { snapshot: { params: { id: 1 } } };

    TestBed.configureTestingModule({
      imports: [
        PostDetailComponent,
        ReactiveFormsModule,
        HttpClientModule
      ],
      providers: [
        { provide: PostService, useValue: mockPostService },
        { provide: CommentService, useValue: mockCommentService },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        FormBuilder,
      ],
    });

    fixture = TestBed.createComponent(PostDetailComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });



  it('should render correct number of comments in the template', () => {
    mockCommentService.getCommentByPostId.and.returnValue(of(mockComments));
    fixture.detectChanges(); // Trigger ngOnInit

    const commentElements = fixture.debugElement.queryAll(By.css('.comment-item')); // Adjust selector if necessary
    expect(commentElements.length).toBe(mockComments.length + 2); // Ensure rendered comments match mock data
  });

  it('should submit a new comment when the form is valid', () => {
    mockCommentService.addComment.and.returnValue(of({ postId: 1, username: 'NewUser', comment: 'New comment!' }));

    // Set valid form values
    const comment = { postId: 1, username: 'NewUser', comment: 'New comment!' };
    component.addCommentForm.setValue(comment);

    // Submit form
    component.onSubmit();

    // Verify service call and form reset
    expect(mockCommentService.addComment).toHaveBeenCalledWith(comment);
    expect(component.addCommentForm.valid).toBeFalse();
    expect(component.addCommentForm.pristine).toBeTrue(); // After form reset
  });

  it('should not submit a new comment when the form is invalid', () => {
    // Set invalid form values (empty required fields)
    const invalidComment = { postId: 1, username: '', comment: '' };
    component.addCommentForm.setValue(invalidComment);

    // Submit form
    component.onSubmit();

    // Verify that addComment is not called due to invalid form
    expect(component.addCommentForm.invalid).toBeTrue();
    expect(mockCommentService.addComment).not.toHaveBeenCalled();
  });

  it('should delete a comment', () => {
    mockCommentService.deleteComment.and.returnValue(of(void 0));
    const commentId = 1;

    component.deleteComment(commentId);

    // Verify deleteComment service call
    expect(mockCommentService.deleteComment).toHaveBeenCalledWith(commentId);
  });

  it('should unsubscribe on destroy', () => {
    // Mock subscription
    const subscriptionSpy = jasmine.createSpyObj('Subscription', ['unsubscribe']);
    component.sub = subscriptionSpy;

    // Trigger ngOnDestroy
    component.ngOnDestroy();

    // Verify unsubscribe was called
    expect(subscriptionSpy.unsubscribe).toHaveBeenCalled();
  });
});
