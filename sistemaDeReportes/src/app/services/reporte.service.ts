import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Reporte } from '../Interfaces/IReporte';
import { Ticket } from '../Interfaces/ITicket';
import { Imagen } from '../Interfaces/IImagen';
import { ReporteM } from '../Models/ReporteM';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReporteService {
  url = 'http://localhost:50255/api/Reporte';

  constructor(private http: HttpClient) { }

  // Entrada: objeto tipo Ticket y lista de tipo Imagen
  // Salida: Observable con la respuesta de la petición.
  // Descripción: petición tipo POST para registrar un nuevo reporte.
  registrarReporte(ticket: Ticket, imagenes: Imagen[]): Observable<string>{
    return this.http.post<string>(this.url + '/Registrar', {
    'ticket': ticket, 'imagenes': imagenes
    });
  }

  // Entrada: objeto tipo Reporte.
  // Salida: Observable con la respuesta de la petición.
  // Descripción: petición tipo PUT para actualizar un registro de reporte.
  actualizarReporte(reporte: Reporte): Observable<string>{
    return this.http.put<string>(this.url + '/Actualizar', reporte);
  }

  // Entrada: datos de tipo string que corresponden a: tipo de reporte, cuadrilla, estado, sector,
  //          origen, y fechas de rango.
  // Salida: Observable con la respuesta de la petición.
  // Descripción: petición tipo GET para obtener registros de reporte que coincidad
  // con los filtros que se envían como parámetros.
  filtroReportes(tipoR: string, cuadrilla: string, estado: string, sector: string,
                 origen: string, fecha: string, fechaAl: string, tipoFecha: string): Observable<JSON[]>{
    if (tipoR === undefined || tipoR === '0' || tipoR === '00'){
      tipoR = '';
   }
    if (cuadrilla === undefined || cuadrilla === '0' || cuadrilla === '00'){
    cuadrilla = '';
   }
    if (estado === undefined || estado === '00'){
    estado = '';
   }
    if (sector === undefined || sector === '0' || sector === '00'){
    sector = '';
   }
    if (origen === undefined || origen === '0' || origen === '00'){
    origen = '';
   }
    if (fecha === null){
    fecha = '';
   }
    if (fechaAl === null){
    fechaAl = '';
   }
    if (tipoFecha === null){
      tipoFecha = '';
   }
    let params = new HttpParams();
    params = params.append('tipoR', tipoR);
    params = params.append('cuadrilla', cuadrilla);
    params = params.append('estado', estado);
    params = params.append('sector', sector);
    params = params.append('origen', origen);
    params = params.append('fechaIni', fecha);
    params = params.append('fechaF', fechaAl);
    params = params.append('tipoFecha', tipoFecha);
    return this.http.get<JSON[]>(this.url + '/ListaBusqueda', {params});
  }

  // Entrada: ID de cuadrilla de tipo string.
  // Salida: Observable con la respuesta de la petición.
  // Descripción: petición de tipo GET para obtener los reportes que pertenecen a una determinada
  // cuadrilla.
  obtenerReportesCuadrilla(idCuadrilla: string): Observable<Object[]>{
    if (idCuadrilla === '0' || idCuadrilla === '00' || idCuadrilla === undefined ){
        idCuadrilla = '';
    }
    let params = new HttpParams();
    params = params.append('idCuadrilla', idCuadrilla);
    return this.http.get<Object[]>(this.url + '/GetReportesCuadrillasFiltro', {params});
  }

  // Entrada: ID del reporte de tipo number y el tipo de imagen (1: apertura, 2: cierre).
  // Salida: observable con resultado de tipo lista Imagen.
  // Descripción: petición de tipo GET para obtener las imágenes que cumplen con los filtros de entrada.00000
  obtenerImagenesReporte(idReporte: number, tipoImagen: number): Observable<Imagen[]>{
    let params = new HttpParams();
    params = params.append('idReporte', idReporte.toString());
    params = params.append('tipoImagen', tipoImagen.toString());
    return this.http.get<Imagen[]>(this.url + '/GetImagenesReporte', {params});
  }

  // Entrada: objeto Reporte  y lista de tipo Imagen.
  // Salida: Observable con la respuesta de la petición.
  // Descripción: petición de tipo POST para guardar las imágenes que pertenecen a un reporte.
  insertarImgReporte(reporte: Reporte, imagenes: Imagen[]): Observable<object>{
    return this.http.post(this.url + '/InsertarImagenesReporte', {
      'reporte': reporte, 'imagenes': imagenes
      });
  }

  // Entrada: Objeto de tipo object
  // Salida: objeto de tipo ReporteM
  // Descripción: Convierte el objeto en un objeto de tipo ReporteM
  convertirDesdeJSON(obj: object): ReporteM{
    return ReporteM.reporteDesdeJson(obj);
  }

  // Entrada: Ninguna
  // Salida: Observable de tipo number, con la respuesta de la petición.
  // Descripción:petición tipo GET para obtener el siguiente valor de ID
  // de la tabla reportes en la base de datos.
  obtenerIDRegistro(): Observable<number>{
    return this.http.get<number>(this.url + '/ObtenerID');
  }

  // Entrada: valor string con formato calleNombre y calleNombre
  // Salida: Observable con la respuesta de la petición.
  // Descripción: Separa las calles para poder ser mostradas en su respectivo lugar
  // en el formulario del dialog de Alta de reportes.
  separarEntreCalles(entreCalles: string): string[]{
    let calles: string[] = [];
    if (entreCalles !== null || entreCalles !== ''){
      calles = entreCalles.split('y');
    }else{
      calles = ['', ''];
    }
    return calles;
  }

  // Entrada: valor DateTime de tipo string con formato 2020-11-21T00:00:00.
  // Salida: lista tipo string con fecha (2020-11-21) y hora (00:00:00) separados
  // Descripción: Separa los datos de fecha y hora
  separarFechaHora(fechaDateTime: string): string[]{
    // 2020-11-21T00:00:00
    let fechaHora: string[] = [];
    if (fechaDateTime !== null){
      fechaHora = fechaDateTime.split('T');
    }
    return fechaHora;
  }

  // Entrada: valor fecha tipo string y valor hora tipo string.
  // Salida: valor tipo string con fecha y hora (2020-11-21 00:00:00).
  // Descripción: junta los datos de fecha y hora.
  juntarFechaHora(fecha: string, hora: string): string{
    const fechaHora: string[] = [fecha, hora];
    return fechaHora.join(' ');
  }

  // Entrada: Ninguna
  // Salida: valor tipo string con hora ( 00:00:00).
  // Descripción: Obtiene los datos del tiempo actual y les da formato
  formatoHora(): string{
    const date: Date = new Date();
    const hora = date.getHours().toString();
    const minutos = date.getMinutes().toString();
    const segundos = date.getSeconds().toString();
    const fechaHora: string[] = [hora, minutos, segundos];
    return fechaHora.join(':');
  }

  // Entrada: valor string calle 1 y valor string calle 2
  // Salida: valor tipo string con calles juntas o un string vacío.
  // Descripción: Obtiene los datos de las calles y crea un nuevo string que
  // incluya y de formato a las calles proporcionadas.
  formatoEntreCalles(calle1: string, calle2: string): string{
    let entreCalles: string;
    if (!calle1 && !calle2){
      entreCalles = '';
    } else if (calle1 && calle2){ // si se ingresaron las dos calles
      entreCalles = calle1 + ' y ' + calle2;
    } else if (calle1 && !calle2){ // si se ingresó solo la calle 1
      entreCalles = calle1;
    } else if (calle2 && !calle1){ // si se ingresó solo la calle 2
      entreCalles = calle2;
    }
    return entreCalles;
  }

// Entrada: valor string para fecha inicial, valor string para fecha final
// valor string para tipo de fecha
// Salida: valor boolean.
// Descripción: Verifica si se ingresó una fecha, que se hayan ingresado
// las dos fechas de rango y el tipo de fecha.
verificarFechas(fechaInicial: string, fechaFinal: string, tipo: string ): boolean{
  let fechasCorrectas: boolean;
  if (fechaInicial && fechaFinal && tipo){
    fechasCorrectas = true;
  }else if (!fechaInicial && !fechaFinal && !tipo){
    fechasCorrectas = true;
  }else{
    fechasCorrectas = false;
  }
  return fechasCorrectas;
}

}
