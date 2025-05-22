import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseSuggestionComponent } from './course-suggestion.component';

describe('CourseSuggestionComponent', () => {
  let component: CourseSuggestionComponent;
  let fixture: ComponentFixture<CourseSuggestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CourseSuggestionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CourseSuggestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
