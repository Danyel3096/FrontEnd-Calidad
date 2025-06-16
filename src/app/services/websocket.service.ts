import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class WebsocketService {
  private socket!: WebSocket;
  private messagesSubject = new Subject<string>();

  constructor() { }

  public connect(url: string): Observable<string> {
    this.socket = new WebSocket(url);

    this.socket.onopen = () => {
      console.log('✅ Conectado al WebSocket:', url);
    };

    this.socket.onmessage = (event) => {
      console.log('📨 Mensaje del WebSocket:', event.data);
      this.messagesSubject.next(event.data);
    };

    this.socket.onerror = (error) => {
      console.error('❌ Error en el WebSocket:', error);
      console.error('WebSocket error:', error);
    };

    this.socket.onclose = () => {
      console.warn('🔌 Conexión WebSocket cerrada.');
      console.warn('WebSocket connection closed');
    };

    return this.messagesSubject.asObservable();
  }

  public close(): void {
    if (this.socket) {
      this.socket.close();
    }
  }
}
