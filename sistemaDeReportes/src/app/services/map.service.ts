import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  URL = 'https://maps.googleapis.com/maps/api/geocode/json';
  ciudad = 'Ciudad Obregón';
  estado = 'Sonora';

  constructor(private http: HttpClient) { }

  // Entrada: valor tipo string con dirección de lugar.
  // Salida: Observable con resultado de petición.
  // Descripción: Petición Http de tipo GET para obtener datos
  // geográficos de una dirección dada. Entre estos se encuentra latitud y longitud.
  obtenerLatLng(direccion: string): Observable<object>{
    let params = new HttpParams();
    params = params.append('address', direccion);
    params = params.append('key', environment.mapsKey);
    return this.http.get<object>(this.URL, {params});
  }

  // Entrada: valor tipo number de latitud y valor tipo number de longitud.
  // Salida: Observable con datos de dirección obtenida.
  // Descripción: Petición Http de tipo GET para obtener
  // la dirección que pertenece a una longitud y latituda dada.
  obtenerDireccionCoordenadas(latitud: number, longitud: number): string[]{
    const direccion: string[] = [];
    return direccion;
  }

  // Entrada: valor string para dirección y valor string para colonia.
  // Salida: valor tipo string con la nueva dirección.
  // Descripción: Método para unir y agregar datos faltantes a dirección como ciudad
  // y estado.
  generarDireccionCompleta(direccion: string, colonia: string): string{
    let direccionCompleta = '';
    direccionCompleta += direccion + ' ' + colonia + ' ' + this.ciudad + ' ' + this.estado;
    return direccionCompleta;
  }

}
