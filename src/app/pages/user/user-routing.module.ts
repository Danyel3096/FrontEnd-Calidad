import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserDashboardComponent } from './user-dashboard/user-dashboard.component';
import { NormalGuard } from '../../services/normal.guard';

const routes: Routes = [
  { path: 'dashboard', component: UserDashboardComponent, canActivate: [NormalGuard] }, // /user/dashboard
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
