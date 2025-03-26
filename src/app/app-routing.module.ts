import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'signup', component: SignupComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent, pathMatch: 'full' },

  // Cargar módulos de rutas
  { path: 'products', loadChildren: () => import('./pages/products/products-routing.module').then(m => m.ProductsRoutingModule) },
  { path: 'admin', loadChildren: () => import('./pages/admin/admin-routing.module').then(m => m.AdminRoutingModule) },
  { path: 'user', loadChildren: () => import('./pages/user/user-routing.module').then(m => m.UserRoutingModule) },

  { path: '**', redirectTo: '' } // Redirigir rutas no encontradas al home
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
