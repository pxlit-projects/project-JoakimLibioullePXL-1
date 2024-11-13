import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostConceptlistComponent } from './post-conceptlist.component';

describe('PostConceptlistComponent', () => {
  let component: PostConceptlistComponent;
  let fixture: ComponentFixture<PostConceptlistComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostConceptlistComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostConceptlistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
