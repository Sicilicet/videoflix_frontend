import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ErrorToastCtaComponent } from './error-toast-cta.component';

describe('ErrorToastCtaComponent', () => {
  let component: ErrorToastCtaComponent;
  let fixture: ComponentFixture<ErrorToastCtaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorToastCtaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ErrorToastCtaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
