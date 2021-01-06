import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Permiso } from '../Interfaces/IPermiso';
import { PermisoM } from '../Models/PermisoM';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PermisoService {
  url ='http://localhost:50255/api/Permisos';

  constructor(private http: HttpClient) { }

  // Entrada: valor tipo number con el ID del tipo de usuario.
  // Salida: Observable de tipo Lista de Permisos con respuesta de petición..
  // Descripción: Función que ejecuta una petición de Http tipo GET para obtener
  // los permisos relacionados a un tipo de usuario.
  obtenerPermisosTipo(idTipo: number): Observable<Permiso[]>{
    return this.http.get<Permiso[]>(this.url + '/GetPermisos/' + idTipo).pipe(
      map(permisos => {
        return permisos.map(permiso => PermisoM.permisoDesdeJson(permiso));
      }));
  }
}
