import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ImageUtilService {
  constructor(private http: HttpClient) {}

  async convertImageToBase64(imagePath: string): Promise<string> {
    try {
      const blob = await firstValueFrom(this.http.get(imagePath, { responseType: 'blob' }));
      return await this.blobToBase64(blob);
    } catch (error) {
      console.error('Error cargando imagen:', error);
      return '';
    }
  }

  private blobToBase64(blob: Blob): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
}
