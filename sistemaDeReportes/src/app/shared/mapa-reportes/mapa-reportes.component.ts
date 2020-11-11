import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import * as Mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-mapa-reportes',
  templateUrl: './mapa-reportes.component.html',
  styleUrls: ['./mapa-reportes.component.css']
})
export class MapaReportesComponent implements OnInit {
  lat: number;
  lng: number;
  zoom: number;
  @Input() datos: any;
  datosReporte: any;
  // mapa: Mapboxgl.Map;


  constructor() { }

  ngOnInit(): void {
    this.datosReporte = this.datos.reporte;
    this.lat = this.datos.posicion[0];
    this.lng = this.datos.posicion[1];
    this.zoom = this.datos.posicion[2];
    // Mapboxgl.accessToken = environment.mapboxKey;
    // this.mapa = new Mapboxgl.Map({
    // container: 'mapa-mapBox', // container id
    // style: 'mapbox://styles/mapbox/streets-v11',
    // center: this.datos.posicion, // starting position LNG  LAT
    // zoom: 17 // starting zoom
    //   });
    // this.crearMarcador(this.datos.posicion);
  }

  // crearMarcador(posicion: any): void{
  //   const marker = new Mapboxgl.Marker()
  //   .setLngLat(posicion)
  //   .addTo(this.mapa);
  // }

}
