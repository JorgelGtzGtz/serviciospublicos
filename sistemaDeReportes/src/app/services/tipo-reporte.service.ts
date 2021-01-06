import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TipoReporte } from '../Interfaces/ITipoReporte';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoReporteService {
  url = 'http://localhost:50255/api/TipoReporte';

  constructor(private http: HttpClient) { }

  // Entrada: Ninguna
  // Salida: Observable de tipo lista Tipo de Reporte con respuesta de petición.
  // Descripción: Función para realizar petición Http de tipo GET para obtener
  // una lista de los tipos de reporte existentes.
  obtenerTiposReporte(): Observable<TipoReporte[]>{
    return this.http.get<TipoReporte[]>(this.url + '/GetTipoReporte');
  }
}
