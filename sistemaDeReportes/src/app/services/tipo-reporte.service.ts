import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TipoReporte } from '../Interfaces/ITipoReporte';

@Injectable({
  providedIn: 'root'
})
export class TipoReporteService {
  url = 'http://localhost:50255/api/TipoReporte';

  constructor(private http: HttpClient) { }

  obtenerTiposReporte(){
    return this.http.get<TipoReporte[]>(this.url + '/GetTipoReporte');
  }
}
