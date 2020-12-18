import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Cuadrilla } from '../Interfaces/ICuadrilla';
import { CuadrillaM } from '../Models/CuadrillaM';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CuadrillaService {
  url = 'http://localhost:50255/api/Cuadrilla';

  constructor(private http: HttpClient) { }

  insertarCuadrilla(cuadrilla: Cuadrilla){
    console.log('Se recibe cuadrilla');
    return this.http.post(this.url + '/Insertar', cuadrilla);
  }

  actualizarCuadrilla(cuadrilla: Cuadrilla){
    return this.http.put(this.url + '/Actualizar', cuadrilla);
  }

  obtenerCuadrilla(idCuadrilla: number){
    return this.http.get<Cuadrilla>(this.url + '/GetCuadrilla/' + idCuadrilla);
  }

  obtenerCuadrillasConJefe(){
    return this.http.get(this.url + '/GetCuadrillasConJefe');
  }
  obtenerCuadrillasGeneral(): Observable<Cuadrilla[]>{
    return this.http.get<Cuadrilla[]>(this.url + '/GetCuadrillaList');
  }

  obtenerCuadrillasFiltro(textoB?: string, estado?: string){
    console.log('Se recibió en servicio:', textoB, estado);
    if (textoB === undefined){
      textoB = '';
    }
    if (estado === undefined || estado === 'Todos'){
      estado = '';
    }
    let params = new HttpParams();
    params = params.append('textoB', textoB);
    params = params.append('estado', estado);

    return this.http.get(this.url + '/filtrarCuadrillas', {
      params
    });
  }

  obtenerIDRegistro(){
    return this.http.get(this.url + '/ObtenerID');
  }

  eliminarCuadrilla(idCuadrilla: number){
    return this.http.delete(this.url + '/Eliminar/' + idCuadrilla);
  }

  convertirDesdeJSON(obj: Object){
    return CuadrillaM.cuadrillaDesdeJson(obj);
  }
}
