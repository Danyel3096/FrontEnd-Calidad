import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Order } from '../interfaces/orders.interface';  // <-- Importa la interface

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  private baseUrl = 'https://tdd-billing-backend.onrender.com/api/sales';

  constructor(private http: HttpClient) { }

  // Obtener todas las ventas de una tienda específica
  getSalesByStore(storeId: number): Observable<Order[]> {   // <-- Aquí usamos Order[]
    return this.http.get<Order[]>(`${this.baseUrl}/store/${storeId}`);
  }
  

createOrder(order: Order): Observable<Order> {
  return this.http.post<Order>(this.baseUrl, order);
}

  
  // Eliminar una venta por su ID
  deleteSale(id: number): Observable<void> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete<void>(url);
  }

 
  
}
