import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import * as Mapboxgl from 'mapbox-gl';

@Injectable({
  providedIn: 'root'
})
export class MapService {
  URL = 'https://maps.googleapis.com/maps/api/geocode/json';
  ciudad = 'Ciudad Obregón';
  estado = 'Sonora';

  constructor(private http: HttpClient) { }

  iniciarMapa(posicion: number[]): void{
    Mapboxgl.accessToken = environment.mapsKey;
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

  obtenerLatLng(direccion: string){
    console.log('query recibido:', direccion);
    let params = new HttpParams();
    params = params.append('address', direccion);
    params = params.append('key', environment.mapsKey);
    return this.http.get(this.URL,{params}).toPromise();
  }

  obtenerDireccionCoordenadas(query: number[]){
    this.URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/';
    return this.http.get(this.URL + query[0] + ',' + query[1] + '.json?types=address&access_token=' + environment.mapsKey);
  }

  generarDireccionCompleta(direccion: string, colonia: string): string{
    let direccionCompleta: string = '';
    direccionCompleta += direccion + ' ' + colonia + ' ' + this.ciudad + ' ' + this.estado     
    return direccionCompleta;
  }
  // getLatLng(direccion: string) {
  //   return new Promise((resolve, reject) => {
  //     this.geocoder.geocode({ address: direccion }, (result, status) => {
  //       if (status === 'OK') {
  //         result.map((latlng) => {
  //           resolve(latlng.geometry.location);
  //         });
  //       } else {
  //         reject({ message: 'no results found' });
  //       }
  //     });
  //   });
  // }
}
