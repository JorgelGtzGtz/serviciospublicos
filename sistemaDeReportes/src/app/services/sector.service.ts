import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Sector } from '../Interfaces/ISector';
import { throws } from 'assert';
import { SectorM } from '../Models/SectorM';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SectorService {
  url = 'http://localhost:50255/api/Sector';

  constructor(private http: HttpClient) { }

  // Entrada: objeto de tipo Sector
  // Salida: Observable con respuesta de petición.
  // Descripción: Función para realizar petición Http de tipo POST para insertar nuevo sector.
  insertarSector(sector: Sector): Observable<object>{
    return this.http.post(this.url + '/Insertar', sector);
  }

  // Entrada: Objeto de tipo Sector.
  // Salida: Observable con respuesta de petición.
  // Descripción: Función para realizar petición Http de tipo PUT para actualizar sector existente.
  actualizarSector(sector: Sector): Observable<object>{
    return this.http.put(this.url + '/Actualizar', sector );
  }

  // Entrada: valor tipo number del ID del sector a eliminar.
  // Salida: Observable con datos de dirección obtenida.
  // Descripción: Función para realizar petición Http de tipo PUT para
  // efectuar eliminación lógica de sector.
  eliminarSector(sector: Sector): Observable<object>{
    return this.http.put(this.url + '/EliminarSector', sector);
  }

  // Entrada: valor tipo number con ID del sector a buscar.
  // Salida: Observable de tipo Sector con respuesta de petición.
  // Descripción: Función para realizar petición Http de tipo GET para obtener
  // un sector por su ID.
  obtenerSector(idSector: number): Observable<Sector>{
    return this.http.get<Sector>(this.url + '/GetSector/' + idSector);
  }

  // Entrada: Ninguna.
  // Salida: Observable de tipo lista de Sector con respuesta de petición.
  // Descripción: Función para realizar petición Http de tipo GET para obtener
  // una lista de sectores existentes.
  obtenerSectores(): Observable<Sector[]>{
    return this.http.get<Sector[]>(this.url + '/GetSectorList').pipe(
      map( sectores => {
        return sectores.map( sector => SectorM.sectorDesdeJson(sector));
      })
    );
  }

  // Entrada: valor tipo string con texto de búsqueda y valor tipo string con estado de sector.
  // Salida: Observable de tipo list de Sector con respuesta de petición.
  // Descripción: Función para realizar petición Http de tipo GET para obtener
  // una lista de sectores que cumplan con los parámetros enviados.
  obtenerSectoresFiltro(textoB?: string, estado?: string): Observable<Sector[]>{
    if (textoB === undefined){
      textoB = '';
    }

    if (estado === undefined || estado === 'Todos'){
      estado = '';
    }
    let params = new HttpParams();
    params = params.append('textoB', textoB);
    params = params .append('estado', estado);
    return this.http.get<Sector[]>(this.url + '/filtrarSectores', {
      params
    });
  }

  // Entrada: Ninguna.
  // Salida: Observable de tipo number con respuesta de petición.
  // Descripción: Función para realizar petición Http de tipo GET para obtener
  // el ID del nuevo registro.
  obtenerIDRegistro(): Observable<number>{
    return this.http.get<number>(this.url + '/ObtenerID');
  }

}
