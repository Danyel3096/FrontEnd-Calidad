import { Routes } from '@angular/router'; //OK

// Ruta por defecto
import { HomeComponent } from './pages/home/home.component';

// Rutas de la aplicación
import { SignupComponent } from './pages/signup/signup.component';
import { LoginComponent } from './pages/login/login.component';
import CartListComponent from './pages/cart/cart.component';
import { UserRecoverPasswordComponent } from './pages/recover-password/user-recover-password.component';

// Rutas protegidas
import { NormalGuard } from './services/normal.guard';
import { AdminGuard } from './services/admin.guard';

// Rutas del dashboard de administrador
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard.component';
import { CategoriesAdminDashboardComponent } from './pages/admin/admin-dashboard/categories-dashboard/categories-dashboard.component';
import { MetricsAdminDashboardComponent } from './pages/admin/admin-dashboard/metrics-dashboard/metrics-dashboard.component';
import { OrdersAdminDashboardComponent } from './pages/admin/admin-dashboard/orders-dashboard/orders-dashboard.component';
import { ProductsAdminDashboardComponent } from './pages/admin/admin-dashboard/products-dashboard/products-dashboard.component';
import { RolesAdminDashboardComponent } from './pages/admin/admin-dashboard/roles-dashboard/roles-dashboard.component';
import { UsersAdminDashboardComponent } from './pages/admin/admin-dashboard/users-dashboard/users-dashboard.component';

// Rutas del dashboard de usuario
import { UserDashboardComponent } from './pages/user/user-dashboard/user-dashboard.component';
import { OrdersDashboardComponent } from './pages/user/user-dashboard/orders-dashboard/orders-dashboard.component';

// Otras rutas
import { UnauthorizedComponent } from './pages/unauthorized/unauthorized.component';
import { MissingComponent } from './pages/missing/missing.component';

// Arreglo con las rutas de la aplicación
export const routes: Routes = [
  // Por defecto
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'home', redirectTo: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'admin-dashboard', title: 'Admin Dashboard component', component: AdminDashboardComponent, 
    children: [
      {
        path: 'categories', // child admin route path
        component: CategoriesAdminDashboardComponent, // another child route component that the router renders
      },
      {
        path: 'metrics', // child admin route path
        component: MetricsAdminDashboardComponent, // another child route component that the router renders
      },
      {
        path: 'products', // child admin route path
        component: ProductsAdminDashboardComponent, // child route component that the router renders
      },
      {
        path: 'orders', // child admin route path
        component: OrdersAdminDashboardComponent, // child route component that the router renders
      },
      {
        path: 'roles', // child admin route path
        component: RolesAdminDashboardComponent, // child route component that the router renders
      },
      {
        path: 'users', // child admin route path
        component: UsersAdminDashboardComponent, // child route component that the router renders
      }
    ] },
  // Paginas de la aplicacion
  { path: 'cart', component: CartListComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  {
    path: 'products',
    loadChildren: () =>
      import('./pages/products/products-list.route'),
  },
  {
    path: 'product',
    loadChildren: () =>
      import('./pages/products/product-detail.route'),
  },
  { path: 'recover-password', component: UserRecoverPasswordComponent, pathMatch: 'full' },
  { path: 'signup', component: SignupComponent, pathMatch: 'full' },
  {
    path: 'user',
    loadChildren: () =>
      import('./pages/user/user.route'),
  },
  // Páginas protegidas en el dashboard
  { path: 'user-dashboard', title: 'User Dashboard component', component: UserDashboardComponent,
    children: [
      {
        path: 'orders', // child user route path
        component: OrdersDashboardComponent, // child route component that the router renders
        pathMatch: 'full', canActivate: [NormalGuard]
      }
    ],
    canActivate: [NormalGuard] },
  // Otras páginas
  { path: 'unauthorized', component: UnauthorizedComponent }, // ruta no autorizada
  { path: '**', component: MissingComponent }, // ruta no encontrada
];
