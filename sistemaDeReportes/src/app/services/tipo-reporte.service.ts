import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TipoReporteService {
  url = 'http://localhost:50255/api/TipoReporte';

  constructor(private http: HttpClient) { }

  obtenerTiposReporte(){
    return this.http.get(this.url + '/GetTipoReporte');
  }
}
