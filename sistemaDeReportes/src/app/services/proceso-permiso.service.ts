import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ProcesoPermiso } from '../Interfaces/IProcesoPermiso';
import { Permiso } from '../Interfaces/IPermiso';
import { ProcesoPermisoM } from '../Models/ProcesoPermisoM';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProcesoPermisoService {
  url = 'http://localhost:50255/api/ProcesosPermisos';

  constructor( private http: HttpClient) { }

  obtenerProcesosLista(){
    return this.http.get<ProcesoPermiso[]>(this.url + '/GetProcesosPermisos').pipe(
      map(procesos => {
        return procesos.map(proceso =>
          ProcesoPermisoM.procesoPDesdeJson(proceso));
    }));
  }


  //Obtener descripcion de permiso
  descripcionPermiso(procesosSistema: ProcesoPermiso[], permisos: Permiso[]): ProcesoPermiso[]{
    let proc:number [] = [];
    let perm: number [] = [];
    let aux: number [] = [];
    let procesosTipo: ProcesoPermiso[] = [];

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

  // Busca el proceso por el nombre
  obtenerProceso(texto: string, procesos: ProcesoPermiso[]): ProcesoPermiso{
    console.log('SE RECIBE EN OBTENER_PROCESO:', texto, procesos);
    let proc: ProcesoPermiso ;
    procesos.forEach(proceso => {
      if (proceso.Descripcion_procesoPermiso === texto){
        proc = proceso;
      }
    });
    return proc;
  }


  // Obtener los procesos que estan disponible a asignar
  // Regresa los procesos que el tipo de usuario no tiene asignados
  procesosDisponibles(procesosSistema: ProcesoPermiso[], permisos: ProcesoPermiso[]): ProcesoPermiso[]{
    let disponibles: ProcesoPermiso[] = [];

    procesosSistema.forEach(proceso => {
      if (!permisos.includes(proceso)){
          disponibles.push(proceso);
      }
    });
    return disponibles;
}
}
