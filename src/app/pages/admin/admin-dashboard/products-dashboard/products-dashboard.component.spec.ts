import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsAdminDashboardComponent } from './products-dashboard.component';

describe('DashboardComponent', () => {
  let component: ProductsAdminDashboardComponent;
  let fixture: ComponentFixture<ProductsAdminDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProductsAdminDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductsAdminDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
