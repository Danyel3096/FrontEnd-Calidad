import { Routes } from '@angular/router'; //OK
// CON LAZY LOADING
// Ruta por defecto
import { HomeComponent } from './pages/home/home.component';
// Rutas de la aplicación
import { SignupComponent } from './pages/signup/signup.component';
import { LoginComponent } from './pages/login/login.component';
import CartListComponent from './pages/cart/cart.component';
import { UserRecoverPasswordComponent } from './pages/recover-password/user-recover-password.component';
// DEPENDEN DE UN PADRE
// Rutas protegidas
import { NormalGuard } from './services/normal.guard';
import { AdminGuard } from './services/admin.guard';
// Rutas del dashboard de administrador
import { MetricsAdminDashboardComponent } from './pages/admin/dashboard/dashboard.component';
import { OrdersAdminDashboardComponent } from './pages/user/user-dashboard/orders-dashboard/orders-dashboard.component';
import { ProductsAdminDashboardComponent } from './pages/admin/dashboard/products-dashboard/dashboard.component';
import { UsersAdminDashboardComponent } from './pages/user/user-dashboard/user-dashboard.component';

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
  //ESPERAR { path: 'home', redirectTo: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'admin-dashboard', title: 'Admin Dashboard component', component: DashboardComponent, 
    children: [
      {
        path: 'metrics',
        component: MetricsComponent, // another child route component that the router renders
      },
      {
        path: 'products', // child route path
        component: ProductsDashboardComponent, // child route component that the router renders
        pathMatch: 'full', canActivate: [NormalGuard]
      },
      {
        path: 'orders', // child route path
        component: OrdersDashboardComponent, // child route component that the router renders
        pathMatch: 'full', canActivate: [NormalGuard]
      },
      {
        path: 'users', // child route path
        component: UsersDashboardComponent, // child route component that the router renders
        pathMatch: 'full', canActivate: [NormalGuard]
      }
    ],
    pathMatch: 'full', canActivate: [AdminGuard] },
  // Paginas de la aplicacion
  { path: 'cart', component: CartListComponent, pathMatch: 'full' },
  { path: 'login', component: LoginComponent, pathMatch: 'full' },
  {
    path: 'products',
    loadChildren: () =>
      import('./pages/products/product.route'),
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
        path: 'products', // child route path
        component: ProductsDashboardComponent, // child route component that the router renders
        pathMatch: 'full', canActivate: [NormalGuard]
      },
      {
        path: 'orders', // child route path
        component: OrdersDashboardComponent, // child route component that the router renders
        pathMatch: 'full', canActivate: [NormalGuard]
      },
      /* {
        path: 'users', // child route path
        component: UsersDashboardComponent, // child route component that the router renders
        pathMatch: 'full', canActivate: [NormalGuard]
      },
      {
        path: 'metrics',
        component: MetricsComponent, // another child route component that the router renders
      }, */
    ],
    pathMatch: 'full', canActivate: [NormalGuard] },
  // Páginas del dashboard
  //{ path: "user/:userId", component: OtherComponent },
  { path: 'unauthorized', component: UnauthorizedComponent }, // ruta no autorizada
  { path: '**', component: MissingComponent }, // ruta no encontrada
];
