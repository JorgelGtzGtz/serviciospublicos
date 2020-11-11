import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.css']
})
export class TablaComponent implements OnInit {
  @Input() modeloTabla: any;
  @Output() enviarAccion = new EventEmitter<string>();
  constructor() { }

  ngOnInit(): void {
    console.log('PAGINA: ', this.modeloTabla.pagina);
  }

  clickEditar(): void{
    this.enviarAccion.emit('editar');
  }

  clickVer(): void{
    this.enviarAccion.emit('ver');
  }

  clickSeleccionar(): void{
    this.enviarAccion.emit('seleccionar');
  }

  clickEliminar(): void{
    this.enviarAccion.emit('eliminar');
  }

  // Agregar clases a las columnas 'th' según el contenido
  // que encabecen, para agregar estilos
  // También se añade un estilo general.
  tamanoColumna( encabezado: string): any{
    return {
      'id-col': encabezado === 'ID' || encabezado === 'No. Reporte',
      'botones-procesos-col': encabezado === 'Procesos',
      'boton-seleccionar-col': encabezado === 'Seleccionar',
      'general-col': encabezado
    };
  }


}
