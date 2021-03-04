import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Permiso } from '../Interfaces/IPermiso';
import { PermisoM } from '../Models/PermisoM';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TipoUsuario } from '../Interfaces/ITipoUsuario';

@Injectable({
  providedIn: 'root'
})
export class PermisoService {
  url = 'http://localhost:50255/api/Permisos';

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

  // Entrada: permisos de tipo Permiso[]
  // Salida: ninguna.
  // Descripción: Guarda en session storage los permisos de manera encriptada
  guardarPermisos(permisos: Permiso[]): void{
    const permisosAstring = JSON.stringify(permisos);
    const encriptarPermisos = btoa(permisosAstring);
    sessionStorage.setItem('procesoP', encriptarPermisos);
  }

  // Entrada: Ninguna
  // Salida: permisos de tio Permiso[]
  // Descripción: obtiene del session storage los permisos.
  recuperarPermisos(): Permiso[]{
    const desencriptar = atob(sessionStorage.getItem('procesoP'));
    return JSON.parse(desencriptar);
  }

  // Entrada: lista de permisos de tipo Permiso y valor de proceso tipo number
  // Salida: booleano
  // Descripción: Verificar si el proceso se encuentra entre los permisos del tipo de usuario.
   verificarPermiso(proceso: number): boolean{
     const permisos = this.recuperarPermisos();
     let permitido: boolean;
     permisos.forEach(permiso => {
      if (permiso.ID_procesoPermisos === proceso){
        permitido = true;
      }
      });
     return permitido;
  }
}
