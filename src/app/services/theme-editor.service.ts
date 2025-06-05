// theme-admin.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ThemeConfig } from '../interfaces/dynamic-colors.interface';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})

export class ThemeEditorService {
  constructor(private http: HttpClient) {}

  saveThemeConfig(themeConfig: ThemeConfig): Observable<any> {
    return this.http.post<any>(`${environment}/save`, themeConfig);
  }
}
