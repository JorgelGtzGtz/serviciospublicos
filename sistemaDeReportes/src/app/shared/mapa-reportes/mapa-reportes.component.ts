import { Component, Input, OnInit } from '@angular/core';
import { ReporteM } from '../../Models/ReporteM';

@Component({
  selector: 'app-mapa-reportes',
  templateUrl: './mapa-reportes.component.html',
  styleUrls: ['./mapa-reportes.component.css']
})
export class MapaReportesComponent implements OnInit {
  @Input() reporteDatos: ReporteM;
  lat: number;
  lng: number;
  zoom: number;
  disponibilidad: boolean;


  constructor() { }

  ngOnInit(): void {
    this.inicializarLatLng();
  }

  inicializarLatLng(): void{
    const latAux = this.reporteDatos.Latitud_reporte;
    const lngAux = this.reporteDatos.Longitud_reporte;
    if (latAux !== null && lngAux !== null){
      this.lat = this.reporteDatos.Latitud_reporte;
      this.lng = this.reporteDatos.Longitud_reporte;
      this.zoom = 17;
      this.disponibilidad = true;
    }else{
      this.disponibilidad = false;
    }
  }

}
