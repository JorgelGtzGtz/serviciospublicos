import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TipoUsuario } from '../Interfaces/ITipoUsuario';
import { TipoUsuarioM } from '../Models/TipoUsuarioM';
import { ProcesoPermiso } from '../Interfaces/IProcesoPermiso';
import { map } from 'rxjs/operators';
import { Permiso } from '../Interfaces/IPermiso';
import { PermisoM } from '../Models/PermisoM';

@Injectable({
  providedIn: 'root'
})
export class TipoUsuarioService {
  url = 'http://localhost:50255/api/TipoUsuario';



  constructor(private http: HttpClient) { }

  obtenerListaTipoU(textoB?: string, estadoValor?: string){
    console.log('Se recibió en servicio:', textoB, estadoValor);
    if (textoB === undefined){
      textoB = '';
   }
    if (estadoValor === undefined || estadoValor === 'Todos'){
      estadoValor = '';
   }
    let params = new HttpParams();
    params = params.append('textoB', textoB);
    params = params.append('estado', estadoValor);
    return this.http.get<TipoUsuario[]>(this.url + '/ListaBusqueda', {
      params
    }).pipe(
      map(tipoU => {
        return tipoU.map(user => TipoUsuarioM.tipoDesdeJson(user));
      })
    );
  }

  obtenerTipoUsuario(idTipo: number){
    return this.http.get<TipoUsuario>(this.url + '/GetTipoUsuario/' + idTipo).pipe(
      map( tipoU =>
        TipoUsuarioM.tipoDesdeJson(tipoU)
        ));
  }

  obtenerIDRegistro(){
    return this.http.get(this.url + '/ObtenerID');
  }

  insertarTipoUsuario(tipoUsuario: TipoUsuario, permisosT: ProcesoPermiso[]){
    return this.http.post(this.url + '/Insertar', {
      'tipo': tipoUsuario,
      'permisos': permisosT
    });
  }

  actualizarTipoUsuario(tipoUsuario: TipoUsuario, permisosT: ProcesoPermiso[]){
    return this.http.put(this.url + '/Actualizar', {
      'tipo': tipoUsuario,
      'permisos': permisosT
    });
  }

  eliminarTipoUsuario(idTipo: number){
    console.log('tipo recibido para eliminar:' + idTipo);
    return this.http.delete(this.url + '/Eliminar/' + idTipo);
  }

  
}
