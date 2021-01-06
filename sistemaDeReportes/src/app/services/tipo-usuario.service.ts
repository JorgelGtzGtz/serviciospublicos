import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { TipoUsuario } from '../Interfaces/ITipoUsuario';
import { TipoUsuarioM } from '../Models/TipoUsuarioM';
import { ProcesoPermiso } from '../Interfaces/IProcesoPermiso';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TipoUsuarioService {
  url = 'http://localhost:50255/api/TipoUsuario';

  constructor(private http: HttpClient) { }

  // Entrada: valor tipo string con texto de búsqueda y valor string con estado de tipo de usuario.
  // Salida: Observable de tipo lista de tipos de usuario.
  // Descripción: Función para realizar petición Http de tipo GET para obtener
  // una lista de los tipos de usuario que cumplen con los parámetros de búsqueda.
  obtenerListaTipoU(textoB?: string, estadoValor?: string): Observable<TipoUsuario[]>{
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

  // Entrada: valor tipo number con ID del Tipo de usuario a buscar.
  // Salida: Observable de tipo Tipo de Usuario con respuesta de petición.
  // Descripción: Función para realizar petición Http de tipo GET para obtener
  // un Tipo de usuario.
  obtenerTipoUsuario(idTipo: number): Observable<TipoUsuario>{
    return this.http.get<TipoUsuario>(this.url + '/GetTipoUsuario/' + idTipo).pipe(
      map( tipoU =>
        TipoUsuarioM.tipoDesdeJson(tipoU)
        ));
  }

  // Entrada: ninguna.
  // Salida: Observable de tipo number con respuesta de petición.
  // Descripción: Función para realizar petición Http de tipo GET para obtener
  // el ID del nuevo tipo de usuario.
  obtenerIDRegistro(): Observable<number>{
    return this.http.get<number>(this.url + '/ObtenerID');
  }

  // Entrada: objeto de tipo TipoUsuario y lista de tipo ProcesosPermiso.
  // Salida: Observable con respuesta de la petición.
  // Descripción: Función para realizar petición Http de tipo POST para insertar nuevo
  // tipo de usuario y sus permisos.
  insertarTipoUsuario(tipoUsuario: TipoUsuario, permisosT: ProcesoPermiso[]): Observable<object>{
    return this.http.post(this.url + '/Insertar', {
      'tipo': tipoUsuario,
      'permisos': permisosT
    });
  }

  // Entrada: objeto de tipo TipoUsuario y lista de tipo ProcesosPermiso.
  // Salida: Observable con respuesta de la petición.
  // Descripción: Función para realizar petición Http de tipo PUT para actualizar
  // tipo de usuario y sus permisos.
  actualizarTipoUsuario(tipoUsuario: TipoUsuario, permisosT: ProcesoPermiso[]): Observable<object>{
    return this.http.put(this.url + '/Actualizar', {
      'tipo': tipoUsuario,
      'permisos': permisosT
    });
  }

  // Entrada: valor tipo number con ID del tipo de usuario.
  // Salida: Observable con respuesta de la petición.
  // Descripción: Función para realizar petición Http de tipo DELETE para efectuar
  // eliminación lógica de tipo de usuario.
  eliminarTipoUsuario(tipoUsuario: TipoUsuario): Observable<object>{
    return this.http.put(this.url + '/EliminarTipoUsuario', tipoUsuario);
  }

}
