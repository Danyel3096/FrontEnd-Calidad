import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemeSectionFormComponent } from './theme-section-form.component';

describe('ThemeSectionFormComponent', () => {
  let component: ThemeSectionFormComponent;
  let fixture: ComponentFixture<ThemeSectionFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemeSectionFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThemeSectionFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
