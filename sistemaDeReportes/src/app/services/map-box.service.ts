import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Features } from '../Interfaces/Features';
import { MapBoxOutput } from '../Interfaces/MapBoxOutput';
import * as Mapboxgl from 'mapbox-gl';

@Injectable({
  providedIn: 'root'
})
export class MapBoxService {
  URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
  ciudad = 'Ciudad Obregón';
  estado = 'Sonora';

  constructor(private http: HttpClient) { }

  iniciarMapa(posicion: number[]): void{
    Mapboxgl.accessToken = environment.mapboxKey;
    const mapa = new Mapboxgl.Map({
    container: 'mapa-mapBox', // container id
    style: 'mapbox://styles/mapbox/streets-v11',
    center: posicion, // starting position LNG  LAT
    zoom: 16, // starting zoom
      });
    this.crearMarcador(posicion, mapa);
  }

  crearMarcador(posicion: number[], mapa: Mapboxgl.Map): void{
    const marker = new Mapboxgl.Marker()
    .setLngLat(posicion)
    .addTo(mapa);
  }

  obtenerCoordenadasDireccion(query: string){
    console.log('query recibido:', query);
    return this.http.get(this.URL + query + '.json?types=address&country=mx&access_token=' + environment.mapboxKey)
    .pipe(map((res: MapBoxOutput) => {
      return res.features;
    }));
  }

  obtenerDireccionCoordenadas(query: number[]){
    this.URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
    return this.http.get(this.URL + query[0] + ',' + query[1] + '.json?types=address&access_token=' + environment.mapboxKey)
    .pipe(map((res: MapBoxOutput) => {
        return res.features;
    }));
  }

  generarQueryCoordenadas(calleNumero: string, colonia: string): string{
    // Expresión regular para checar formatos como #1249 no.2398 no234 etc.
    const expRegNumeroDomicilio = /(^[\#])?[0-9]+$/;
    const expRegNumeros = /[0-9]+/;
    // Para obtener el nombre de la calle. Acepta calle que tengan nombre de número como "Calle 200"
    const expRegNombreCalle = /([a-zA-Z]+[\s]?([0-9]?)+[\s]?)+/;

    const auxNumero = calleNumero.match(expRegNumeroDomicilio)[0];
    const numeroDireccion = auxNumero.match(expRegNumeros) !== null ? auxNumero.match(expRegNumeros)[0] : '';
    const nombreCalle = calleNumero.match(expRegNombreCalle) !== null ? calleNumero.match(expRegNombreCalle)[0] : '' ;
     // Estructura query =  {Calle} {numero de casa} {Colonia} {Ciudad}
    const query = nombreCalle + ' ' +
                  numeroDireccion + ' ' +
                  colonia + ' ' +
                  this.ciudad + ' ' +
                  this.estado;
    console.log('query', query);
    return query;
  }

  // setLatLng(latLng: number[]) {
  //   console.log('RECIBE:', latLng);
  //   this.latLng = latLng;
  // }

  // getLatLng() {
  //   console.log('REGRESA:', this.latLng);
  //   return this.latLng;
  // }
}
