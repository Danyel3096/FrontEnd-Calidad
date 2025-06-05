import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from '../interfaces/role.interface';

@Injectable({
  providedIn: 'root'
})
export class RolesDashboardService {
   private baseUrl = 'https://tdd-billing-backend.onrender.com/api'; 


  constructor(private http: HttpClient) {}

  // Cambié el tipo de retorno para que devuelva Category[]
  getRoles(): Observable<Role[]> {
    const url = `${this.baseUrl}/roles`;
    return this.http.get<Role[]>(url);
  }

    getRolesByStore(storeId: number): Observable<{ content: Role[] }> {
      const url = `${this.baseUrl}/roles/store/${storeId}`;
      return this.http.get<{ content: Role[] }>(url);
    }
  
}
