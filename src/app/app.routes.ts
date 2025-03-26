import { Routes } from '@angular/router';
// Ruta por defecto
import { HomeComponent } from './pages/home/home.component';
// Rutas de la aplicación
import { SignupComponent } from './pages/signup/signup.component';
import { LoginComponent } from './pages/login/login.component';
import { SettingsComponent } from './pages/settings/settings.component';
import ProductsListComponent from './pages/products/features/product-list/product-list.component';
import CartListComponent from './pages/products/cart/cart.component';
// Rutas protegidas
import { NormalGuard } from './services/normal.guard';
import { AdminGuard } from './services/admin.guard';
// Rutas del dashboard
import { UserDashboardComponent } from './pages/user/user-dashboard/user-dashboard.component';
import { DashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { OrdersDashboardComponent } from './pages/orders/orders.component';
import { ProductsDashboardComponent } from './pages/products/dashboard/dashboard.component';
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { MissingComponent } from './pages/missing/missing.component';

// Arreglo con las rutas de la aplicación
export const routes: Routes = [
  // Por defecto
  { path: '', component: HomeComponent, pathMatch: 'full' },
  // Paginas de la aplicacion
  { path: 'signup', component: SignupComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  { path: 'settings', component: SettingsComponent, pathMatch: 'full' },
  { path: 'products', component: ProductsListComponent, pathMatch: 'full' },
  { path: 'cart', component: CartListComponent, pathMatch: 'full' },
  // Páginas protegidas
  { path: 'user-dashboard', component: UserDashboardComponent, pathMatch: 'full', canActivate: [NormalGuard] },
  { path: 'admin-dashboard', component: DashboardComponent, pathMatch: 'full', canActivate: [AdminGuard] },
  // Páginas del dashboard
  { path: 'dashboard-orders', component: OrdersDashboardComponent, pathMatch: 'full', canActivate: [NormalGuard] },
  { path: 'dashboard-products', component: ProductsDashboardComponent, pathMatch: 'full' },
  //{ path: 'admin-dashboard-product', component: DashboardComponentProduct, pathMatch: 'full', canActivate: [AdminGuard] },
  //{ path: 'admin-dashboard-user', component: DashboardComponentUser, pathMatch: 'full', canActivate: [AdminGuard] },
  { path: 'unauthorized', component: UnauthorizedComponent }, // ruta no autorizada
  { path: '**', component: MissingComponent }, // ruta no encontrada
];
