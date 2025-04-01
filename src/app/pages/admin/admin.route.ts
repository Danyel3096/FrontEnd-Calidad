import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminDashboardComponent } from './admin-dashboard/admin-dashboard.component';
import { AdminGuard } from '../../services/admin.guard';

const routes: Routes = [
  { path: 'admin-dashboard', component: AdminDashboardComponent, canActivate: [AdminGuard] }, // /admin/dashboard
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
