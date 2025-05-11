import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment.development'; // Asegúrate que esta ruta sea correcta

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = environment.API_URL_USUARIO_REGISTRO;

  constructor(private httpClient: HttpClient) { }

  public añadirUsuario(user: any) {
    return this.httpClient.post(`${this.apiUrl}`, user);
  }

}
