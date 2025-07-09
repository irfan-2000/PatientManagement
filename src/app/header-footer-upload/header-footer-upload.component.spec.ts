import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderFooterUploadComponent } from './header-footer-upload.component';

describe('HeaderFooterUploadComponent', () => {
  let component: HeaderFooterUploadComponent;
  let fixture: ComponentFixture<HeaderFooterUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderFooterUploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HeaderFooterUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
