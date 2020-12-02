import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Cuadrilla } from '../Interfaces/ICuadrilla';

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

  obtenerCuadrillas(){
    return this.http.get(this.url + '/GetCuadrillaList');
  }

  eliminarCuadrilla(idCuadrilla: number){
    return this.http.delete(this.url + '/Eliminar/' + idCuadrilla);
  }
}
