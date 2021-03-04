import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Cuadrilla } from '../Interfaces/ICuadrilla';
import { CuadrillaM } from '../Models/CuadrillaM';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CuadrillaService {
  url = 'http://localhost:50255/api/Cuadrilla';

  constructor(private http: HttpClient) { }

  // Entrada: valor tipo Cuadrilla
  // Salida: Observable con respuesta de petición.
  // Descripción: Método para hacer una petición Http de tipo POST para insertar nueva cuadrilla.
  insertarCuadrilla(cuadrilla: Cuadrilla): Observable<string>{
    return this.http.post<string>(this.url + '/Insertar', cuadrilla);
  }

  // Entrada: valor tipo cuadrilla.
  // Salida: Observable con respuesta de petición.
  // Descripción: Método para hacer petición Http PUT para actualizar nueva cuadrilla.
  actualizarCuadrilla(cuadrilla: Cuadrilla): Observable<string>{
    return this.http.put<string>(this.url + '/Actualizar', cuadrilla);
  }

  // Entrada: valor tipo number con ID de cuadrilla
  // Salida: Observable de tipo Cuadrilla con respuesta de petición.
  // Descripción: Método para recuperar una cuadrilla por su ID, a través de una
  // petición de tipo Http GET.
  obtenerCuadrilla(idCuadrilla: number): Observable<Cuadrilla>{
    return this.http.get<Cuadrilla>(this.url + '/GetCuadrilla/' + idCuadrilla);
  }

  // Entrada: valor tipo string con nombre de cuadrilla
  // Salida: Observable de tipo Cuadrilla con respuesta de petición.
  // Descripción: Método para recuperar una cuadrilla por su nombre, a través de una
  // petición de tipo Http GET.
  obtenerCuadrillaPorNombre(nombreCuadrilla: string): Observable<Cuadrilla>{
    let params = new HttpParams();
    params = params.append('nombre',nombreCuadrilla);
    return this.http.get<Cuadrilla>(this.url + '/GetCuadrillaPorNombre', {params});
  }
  // Entrada: Ninguna
  // Salida: Observable con lista de cuadrillas con sus jefes de cuadrilla.
  // Descripción: Método para obtener una lista de las cuadrillas con sus
  // respectivos jefes de cuadrilla mediante una petición Http de tipo GET.
  obtenerCuadrillasConJefe(): Observable<object>{
    return this.http.get(this.url + '/GetCuadrillasConJefe');
  }

  // Entrada: Ninguna
  // Salida: Observable de tipo lista de Cuadrilla.
  // Descripción: Método para obtener una lista de las cuadrillas existentes
  // en el sistema mediante una petición Http tipo GET
  obtenerCuadrillasGeneral(): Observable<Cuadrilla[]>{
    return this.http.get<Cuadrilla[]>(this.url + '/GetCuadrillaList');
  }

  // Entrada: valores tipo string (filtros de búsqueda)
  // Salida: Observable con respuesta de petición (lista).
  // Descripción: Método para obtener una lista de las cuadrillas
  // que coincidan con los filtros de búsqueda mediante una petición Http tipo GET.
  obtenerCuadrillasFiltro(textoB?: string, estado?: string): Observable<Object[]>{
    if (textoB === undefined){
      textoB = '';
    }
    if (estado === undefined || estado === '01'){
      estado = '';
    }
    let params = new HttpParams();
    params = params.append('textoB', textoB);
    params = params.append('estado', estado);

    return this.http.get<Object[]>(this.url + '/filtrarCuadrillas', {
      params
    });
  }

  // Entrada: Ninguna
  // Salida: Observable de tipo number con el nuevo ID.
  // Descripción: Petición Http de tipo GET para obtener
  // el ID del nuevo registro de cuadrilla.
  obtenerIDRegistro(): Observable<number>{
    return this.http.get<number>(this.url + '/ObtenerID');
  }

  // Entrada: valor tipo number con ID de cuadrilla
  // Salida: Observablecon respuesta de petición.
  // Descripción: Petición Http de tipo PUT para realizar una eliminación
  // lógica de la cuadrilla mediante el ID.
  eliminarCuadrilla(cuadrilla: Cuadrilla): Observable<string>{
    return this.http.put<string>(this.url + '/EliminarCuadrilla', cuadrilla);
  }

  // Entrada: valor tipo JSON con datos de cuadrilla.
  // Salida: Objecto tipo Cuadrilla
  // Descripción: Método para convertir un JSON con los datos de la cuadrilla
  // en un objeto tipo Cuadrilla.
  convertirDesdeJSON(obj: JSON): Cuadrilla{
    return CuadrillaM.cuadrillaDesdeJson(obj);
  }

  // Entrada: number con ID de cuadrilla.
  // Salida: cuadrilla tipo Cuadrilla.
  // Descripción: Encuentra el objeto cuadrilla con el ID.
  obtenerCuadrillaReporte(cuadrillas: Cuadrilla [], idCuadrilla: number): Cuadrilla{
    let cuadrillaEncontrada: Cuadrilla = null;
    cuadrillas.forEach(cuadrilla => {
      if (cuadrilla.ID_cuadrilla === idCuadrilla){
        cuadrillaEncontrada = cuadrilla;
      }
    });
    return cuadrillaEncontrada;
  }
}
