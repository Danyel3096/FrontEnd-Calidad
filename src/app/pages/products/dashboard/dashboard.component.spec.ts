import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsDashboardComponent } from './dashboard.component';

describe('DashboardComponent', () => {
  let component: ProductsDashboardComponent;
  let fixture: ComponentFixture<ProductsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
