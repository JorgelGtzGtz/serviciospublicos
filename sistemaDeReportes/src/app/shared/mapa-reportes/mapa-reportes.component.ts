import { Component, Input, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';
import { MapService } from '../../services/map.service';
import * as Mapboxgl from 'mapbox-gl';

@Component({
  selector: 'app-mapa-reportes',
  templateUrl: './mapa-reportes.component.html',
  styleUrls: ['./mapa-reportes.component.css']
})
export class MapaReportesComponent implements OnInit {
  @Input() datos: any;
  datosReporte: any;
  lat: number;
  lng: number;
  zoom: number;
  // mapa: Mapboxgl.Map;


  constructor( private mapboxService: MapService) { }

  ngOnInit(): void {
    this.datosReporte = this.datos.reporte;
    // this.mapboxService.iniciarMapa(this.datos.posicion);
    this.lat = 40;
    this.lng = -3;
    this.zoom = 16;
  }

  // crearMarcador(posicion: number[], mapa: Mapboxgl.Map): void{
  //   const marker = new Mapboxgl.Marker()
  //   .setLngLat(posicion)
  //   .addTo(mapa);
  // }

}
