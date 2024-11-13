import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostPublishedlistComponent } from './post-publishedlist.component';

describe('PostPublishedlistComponent', () => {
  let component: PostPublishedlistComponent;
  let fixture: ComponentFixture<PostPublishedlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostPublishedlistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostPublishedlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
