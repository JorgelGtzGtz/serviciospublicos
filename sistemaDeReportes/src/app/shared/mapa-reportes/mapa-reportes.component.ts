import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { MapBoxService } from '../../services/map-box.service';
import * as Mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-mapa-reportes',
  templateUrl: './mapa-reportes.component.html',
  styleUrls: ['./mapa-reportes.component.css']
})
export class MapaReportesComponent implements OnInit {
  @Input() datos: any;
  datosReporte: any;
  // mapa: Mapboxgl.Map;


  constructor( private mapboxService: MapBoxService) { }

  ngOnInit(): void {
    this.datosReporte = this.datos.reporte;
    this.mapboxService.iniciarMapa(this.datos.posicion);
    // Mapboxgl.accessToken = environment.mapboxKey;
    // const mapa = new Mapboxgl.Map({
    // container: 'mapa-mapBox', // container id
    // style: 'mapbox://styles/mapbox/streets-v11',
    // center: this.datos.posicion, // starting position LNG  LAT
    // zoom: this.datos.zoom, // starting zoom
    //   });
    // this.crearMarcador(this.datos.posicion, mapa);
  }

  // crearMarcador(posicion: number[], mapa: Mapboxgl.Map): void{
  //   const marker = new Mapboxgl.Marker()
  //   .setLngLat(posicion)
  //   .addTo(mapa);
  // }

}
