import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProcesoPermiso } from '../Interfaces/IProcesoPermiso';
import { Permiso } from '../Interfaces/IPermiso';
import { ProcesoPermisoM } from '../Models/ProcesoPermisoM';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProcesoPermisoService {
  url = 'http://localhost:50255/api/ProcesosPermisos';

  constructor( private http: HttpClient) { }

  // Entrada: Ninguna.
  // Salida: Observable de tipo lista de procesos como respuesta de petición.
  // Descripción: Función para obtener los procesos del sistema para asignar
  // a un tipo de usuario.
  obtenerProcesosLista(): Observable<ProcesoPermiso[]>{
    return this.http.get<ProcesoPermiso[]>(this.url + '/GetProcesosPermisos').pipe(
      map(procesos => {
        return procesos.map(proceso =>
          ProcesoPermisoM.procesoPDesdeJson(proceso));
    }));
  }

  // Entrada: valor de tipo lista ProcesoPermiso y lista de tipo Permiso.
  // Salida: Lista de tipo ProcesoPermiso
  // Descripción: Función para obtener descripcion de permiso.
  descripcionPermiso(procesosSistema: ProcesoPermiso[], permisos: Permiso[]): ProcesoPermiso[]{
    const proc: number [] = [];
    const perm: number [] = [];
    const aux: number [] = [];
    const procesosTipo: ProcesoPermiso[] = [];

    // obtener id's de procesoPermiso de los procesosPermisos
    procesosSistema.forEach(proceso => {
      proc.push(proceso.ID_ProcesosPermiso);
    });
    // obtener id's de procesoPermiso de los permisos
    permisos.forEach( permiso => {
        perm.push(permiso.ID_procesoPermisos);
    });
    // Obtener los id's que coinciden
    proc.forEach(id => {
      if (perm.includes(id)){
            aux.push(id);
       }
    });

    procesosSistema.forEach(proceso => {
      if (aux.includes(proceso.ID_ProcesosPermiso)){
        procesosTipo.push(proceso);
      }
    });
    return procesosTipo;
  }

  // Entrada: valor tipo string con el nombre del proceso y lista tipo Procesopermiso.
  // Salida: Objeto de tipo ProcesoPermiso.
  // Descripción: Busca el proceso por el nombre.
  obtenerProceso(texto: string, procesos: ProcesoPermiso[]): ProcesoPermiso{
    let proc: ProcesoPermiso ;
    procesos.forEach(proceso => {
      if (proceso.Descripcion_procesoPermiso === texto){
        proc = proceso;
      }
    });
    return proc;
  }


  // Entrada: lista de tipo ProcesoPermiso y lista de tipo Permiso.
  // Salida: lista de tipo ProcesoPermiso.
  // Descripción: Obtener los procesos que estan disponible a asignar
  // Regresa los procesos que el tipo de usuario no tiene asignados
  procesosDisponibles(procesosSistema: ProcesoPermiso[], permisos: ProcesoPermiso[]): ProcesoPermiso[]{
    const disponibles: ProcesoPermiso[] = [];
    procesosSistema.forEach(proceso => {
      if (!permisos.includes(proceso)){
          disponibles.push(proceso);
      }
    });
    return disponibles;
}
}
