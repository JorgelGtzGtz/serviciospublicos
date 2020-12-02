import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Permiso } from '../Interfaces/IPermiso';
import { PermisoM } from '../Models/PermisoM';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PermisoService {
  url ='http://localhost:50255/api/Permisos';

  constructor(private http: HttpClient) { }

  obtenerPermisosTipo(idTipo: number){
    return this.http.get<Permiso[]>(this.url + '/GetPermisos/' + idTipo).pipe(
      map(permisos => {
        return permisos.map(permiso => PermisoM.permisoDesdeJson(permiso));
      }));
  }
}
