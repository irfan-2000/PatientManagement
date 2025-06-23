import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopStripComponent } from './top-strip.component';

describe('TopStripComponent', () => {
  let component: TopStripComponent;
  let fixture: ComponentFixture<TopStripComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TopStripComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TopStripComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
