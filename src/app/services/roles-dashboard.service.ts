import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class RolesDashboardService {

  constructor(private http: HttpClient) {}

  getRoles(): Observable<string[]> {
    const url = `${environment.API_URL_ROLES_READALL}`;
    return this.http.get<string[]>(url);
  }
}
