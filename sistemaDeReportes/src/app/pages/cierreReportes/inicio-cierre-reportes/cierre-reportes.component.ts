import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogVerEditarNuevoCierreReportesComponent } from '../dialog-ver-editar-nuevo-cierre-reportes/dialog-ver-editar-nuevo-cierre-reportes.component';
import { FormControl, AbstractControl } from '@angular/forms';
import { Reporte } from '../../../Interfaces/IReporte';
import { ReporteService } from '../../../services/reporte.service';
import { CuadrillaService } from '../../../services/cuadrilla.service';
import { Cuadrilla } from '../../../Interfaces/ICuadrilla';


@Component({
  selector: 'app-inicio-cierre-reportes',
  templateUrl: './cierre-reportes.component.html',
  styleUrls: ['./cierre-reportes.component.css']
})
export class CierreReportesComponent implements OnInit {
  nombreSeccion = 'Cierre de reportes';
  cuadrillaForm: FormControl;
  headersTabla: string [];
  cuadrillasCargadas: boolean;
  ReportesCargados: boolean;
  listaCuadrillas: Cuadrilla[] = [];
  listaReportes: any[] = [];


  constructor(public dialog: MatDialog,
              private reporteService: ReporteService,
              private cuadrillaService: CuadrillaService) {
    this.formBuilder();
  }

  ngOnInit(): void {
    this.inicializarListas();
    this.inicializarTabla();
  }

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción: Inicializa los controladores del formulario
  formBuilder(): void{
    this.cuadrillaForm = new FormControl('Todos');
    this.cuadrillaForm.valueChanges.subscribe(value => {
      console.log('se interactuo:', value);
    });
  }

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción:Método para obtener los registros de tipos de reporte, sectores y cuadrillas
  // para mostrarlos en sus respectivos select.
  inicializarListas(): void{
    this.cuadrillaService.obtenerCuadrillasGeneral().subscribe( cuadrillas => {
      this.listaCuadrillas = cuadrillas;
      this.cuadrillasCargadas = true;
    }, error => {
        console.log('No fue posible obtener las cuadrillas existentes. ' + error );
    });
  }

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción: Inicializa la tabla. Coloca sus encabezados y llama al método que
  // obtiene los registros de reportes a mostrar.
  inicializarTabla(): void{
    this.actualizarTabla();
    this.headersTabla = ['No. Reporte', 'Sector', 'Dirección', 'Seleccionar'];
  }

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción:Método para llenar la tabla mediante una petición del servicio de reporte,
  // con los registros de reportes existentes de acuerdo a una cuadrilla o general.
  actualizarTabla(): void{
    const cuadrilla: string = (this.campoCuadrilla.value).toString();
    this.reporteService.obtenerReportesCuadrilla(cuadrilla).subscribe(reportes => {
      this.listaReportes = reportes;
      this.ReportesCargados = true;
    });
  }

  // Entrada: Ninguna
  // Salida: valor booleano.
  // Descripción: Método que verifica que los datos se encuentren cargados, con el fin de 
  // determinar en que momento mostrar el formulario o la animación de cargando.
  datosCargados(): boolean{
    let cargado: boolean;
    if (this.ReportesCargados && this.cuadrillasCargadas){
        cargado = true;
    }else{
        cargado = false;
    }
    return cargado;
  }

  // Entrada: Titulo de encabezado de tipo string
  // Salida: objeto que indica la clase de estilo a aplicar.
  // Descripción: Métodos get para obtener acceso al campo cuadrilla del formulario.
 get campoCuadrilla(): AbstractControl{
   return this.cuadrillaForm;
 }

  // Entrada: Titulo de encabezado de tipo string
  // Salida: objeto que indica la clase de estilo a aplicar.
  // Descripción:Método para Agregar clases a las columnas 'th' según el contenido
  // que encabecen, para agregar estilos. También se añade un estilo general.
  tamanoColumna( encabezado: string): object{
    return {
      'id-col': encabezado === 'No. Reporte',
      'boton-seleccionar-col': encabezado === 'Seleccionar',
      'general-col': encabezado
    };
  }

  // Entrada: registro de la tabla con la información del reporte.
  // Salida: vacío.
  // Descripción: Método para establecer las caracteristicas del dialog y abrirlo.
  // También contiene el método que ejecuta acciones al cerrar el dialog.
  abrirDialogSeleccionar(reporte: object): void{
    const DIALOG_REF = this.dialog.open( DialogVerEditarNuevoCierreReportesComponent, {
      width: '900px',
      height: '600px',
      disableClose: true,
      autoFocus: false,
      data: {reporte}
    });

    DIALOG_REF.afterClosed().subscribe(() => {
      this.actualizarTabla();
    });
  }

  // Entrada: registro de la tabla con la información del reporte.
  // Salida: vacío.
  // Descripción:Método que se llama al hacer click en botón "seleccionar" de la tabla
  // para posteriormente llamar al método que abre el dialog.
  seleccionarReporte(reporte: object): void{
    this.abrirDialogSeleccionar(reporte);
  }

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción: Método para buscar en la base de datos
  // los registros que coincidan con el filtro.
  buscar(): void{
    this.actualizarTabla();
  }

}
