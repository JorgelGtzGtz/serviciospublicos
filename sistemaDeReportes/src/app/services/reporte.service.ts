import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Reporte } from '../Interfaces/IReporte';
import { Ticket } from '../Interfaces/ITicket';
import { Imagen } from '../Interfaces/IImagen';
import { ReporteM } from '../Models/ReporteM';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  url = 'http://localhost:50255/api/Reporte';

  constructor(private http: HttpClient) { }

  registrarReporte(ticket: Ticket, imagenes: Imagen[]){
    return this.http.post(this.url + '/Registrar', {
    'ticket': ticket, 'imagenes': imagenes
    });
  }

  actualizarReporte(reporte: Reporte){
    return this.http.put(this.url + '/Actualizar', reporte);
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
    return this.http.post(this.url + '/InsertarImagenesReporte', {
      body: {'reporte': reporte, 'imagenes': imagenes}
    });
  }

  convertirDesdeJSON(obj: Object): ReporteM{
    return ReporteM.reporteDesdeJson(obj);
  }

  obtenerIDRegistro(){
    return this.http.get(this.url + '/ObtenerID');
  }

  // obtenerPathImagen(formData: FormData){
  //   return this.http.post(this.url + '/SubirImagenApi', formData);
  // }

  separarEntreCalles(entreCalles: string): string[]{
    let calles: string[] = [];
    if (entreCalles !== null || entreCalles !== ''){
      calles = entreCalles.split('y');
    }else{
      calles = ['',''];
    }
    return calles;
  }

  formatoFechaMostrar(fechaDateTime: string): string{
    // 2020-11-21T00:00:00
    let fechaConFormato: string = '';
    if (fechaDateTime !== null){
        const auxArray: string[] = fechaDateTime.split('T');
        fechaConFormato = auxArray[0];
    }
    return fechaConFormato;
  }

}
