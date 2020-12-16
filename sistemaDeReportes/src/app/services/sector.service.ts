import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Sector } from '../Interfaces/ISector';
import { throws } from 'assert';
import { SectorM } from '../Models/SectorM';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SectorService {
  url = 'http://localhost:50255/api/Sector';

  constructor(private http: HttpClient) { }

  insertarSector(sector: Sector){
    return this.http.post(this.url + '/Insertar', sector);
  }

  actualizarSector(sector: Sector){
    return this.http.put(this.url + '/Actualizar', sector );
  }

  eliminarSector(idSector: number){
    return this.http.delete(this.url + '/Eliminar/' + idSector);
  }

  obtenerSector(idSector: number){
    return this.http.get<Sector>(this.url + '/GetSector/' + idSector);
  }

  obtenerSectores(){
    return this.http.get<Sector[]>(this.url + '/GetSectorList').pipe(
      map( sectores => {
        return sectores.map( sector => SectorM.sectorDesdeJson(sector));
      })
    );
  }

  obtenerSectoresFiltro(textoB?: string, estado?: string){
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

  obtenerIDRegistro(){
    return this.http.get<number>(this.url + '/ObtenerID');
  }

}
