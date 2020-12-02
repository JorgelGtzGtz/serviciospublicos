import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Reporte } from '../Interfaces/IReporte';
import { Imagen } from '../Interfaces/IImagen';
import { map } from 'rxjs/operators';
import { ReporteM } from '../Models/ReporteM';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  url = 'http://localhost:50255/api/Reporte';

  constructor(private http: HttpClient) { }

  registrarReporte(reporte: Reporte, imagenes: Imagen[]){
    const paramReporte = JSON.stringify( reporte);
    const paramImagenes = JSON.stringify(imagenes);
    return this.http.post(this.url + '/Registrar', {
      body: {'ticket': paramReporte, 'imagenes': paramReporte}
    });
  }

  actualizarReporte(reporte: Reporte){
    const reporteModelo = JSON.stringify(reporte);
    const params = new HttpParams().append('reporte', reporteModelo);
    return this.http.put(this.url + '/Actualizar', {
      params
    });
  }

  buscarReportes(filtro?: string){
    if (filtro === undefined){
      filtro = '';
   }
    return this.http.get(this.url + '/lista/' + filtro);
  }

  obtenerReportes(){
    return this.http.get(this.url + '/GetAll');
  }

  obtenerReportesCuadrilla(idReporte: number){
    return this.http.get(this.url + '/GetReportesCuadrillas/' + idReporte);
  }

  obtenerImagenesReporte(idReporte: number){
    return this.http.get(this.url + '/GetImagenesReporte/' + idReporte);
  }

  insertarImgReporte(reporte: Reporte, imagenes: Imagen[]){
    const paramReporte = JSON.stringify( reporte);
    const paramImagenes = JSON.stringify(imagenes);
    return this.http.post(this.url + '/InsertarImagenesReporte', {
      body: {'reporte': paramReporte, 'imagenes': paramReporte}
    });
  }

}
