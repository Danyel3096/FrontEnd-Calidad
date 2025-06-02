import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notification } from '../interfaces/notification.interface';
import { environment } from '../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private baseUrl = `${environment.API_URL_NOTIFICACIONES}`; 

  constructor(private http: HttpClient) {}
  /**
   * Obtiene todas las notificaciones
   * @returns Observable<Notification[]>
   */
  getNotificationsByUser(userId: number): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${this.baseUrl}/user/${userId}`);
  }
  /**
   * Marca una notificación como leída
   * @param notificationId - ID de la notificación a marcar como leída
   * @returns Observable<Notification>
   */
  markAllAsRead(userId: number): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/mark-all-read/${userId}`, {});
  }


}
