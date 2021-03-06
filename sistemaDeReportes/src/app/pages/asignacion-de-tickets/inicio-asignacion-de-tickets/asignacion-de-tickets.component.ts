import { Component, OnInit, OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogAsignacionTicketsComponent } from '../dialog-asignacion-tickets/dialog-asignacion-tickets.component';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { ReporteService } from '../../../services/reporte.service';
import { Sector } from '../../../Interfaces/ISector';
import { TipoReporteService } from '../../../services/tipo-reporte.service';
import { SectorService } from '../../../services/sector.service';
import { TipoReporte } from '../../../Interfaces/ITipoReporte';
import { PermisoService } from '../../../services/permiso.service';

@Component({
  selector: 'app-asignacion-de-tickets',
  templateUrl: './asignacion-de-tickets.component.html',
  styleUrls: ['./asignacion-de-tickets.component.css']
})
export class AsignacionDeTicketsComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  nombreSeccion = 'Asignación de tickets a cuadrilla';
  form: FormGroup;
  ReportesCargados: boolean;
  sectoresCargados: boolean;
  tiposCargados: boolean;
  headersTabla: string [];
  listaReportes: any[] = [];
  listaTiposR: TipoReporte[] = [];
  listaSectores: Sector[] = [];

  constructor( public dialog: MatDialog,
               private formBuilder: FormBuilder,
               private reporteService: ReporteService,
               private tipoRService: TipoReporteService,
               private sectorService: SectorService,
               private permisoService: PermisoService
               ) {
    this.buildForm();
  }

  ngOnInit(): void {
    this.inicializarListas();
    this.inicializarTabla();
  }

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción: Inicializa el formulario reactivo, aquí es donde se crean los controladores de los inputs
   private buildForm(): void{
    this.form = this.formBuilder.group({
      sector: [0],
      estado: [1],
      tipoReporte: [0],
      fechaInicio: [''],
      fechaFinal: [''],
      tipoFecha: ['']
    });
  }

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción: Métodos get para obtener acceso a los controladores de los campos del formulario
  get campoSector(): AbstractControl{
    return this.form.get('sector');
  }

  get campoEstado(): AbstractControl{
    return this.form.get('estado');
  }

  get campoTipoReporte(): AbstractControl{
    return this.form.get('tipoReporte');
  }

  get campoFechaInicio(): AbstractControl{
    return this.form.get('fechaInicio');
  }

  get campoFechaFinal(): AbstractControl{
    return this.form.get('fechaFinal');
  }

  get campoTipoFecha(): AbstractControl{
    return this.form.get('tipoFecha');
  }

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción: Inicializa la tabla. Coloca sus encabezados y llama al método que
  // obtiene los registros de reportes a mostrar.
  inicializarTabla(): void{
    this.actualizarTabla();
    this.headersTabla = [
      'No. Reporte',
      'Fecha inicio',
      'No. Tickets',
      'Estado',
      'Sector',
      'Dirección',
      'Seleccionar'];
  }

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción:Método para llenar la tabla mediante una petición del servicio de reporte,
  // con los registros de reportes existentes. Puede ser según
  // filtros que se especifican con el valor de cada control del formulario.
  actualizarTabla(): void{
    const tipoR: string =  (this.campoTipoReporte.value).toString();
    const cuadrilla =  '';
    const estado: string =  (this.campoEstado.value).toString();
    const sector: string =  (this.campoSector.value).toString();
    const origen =  '';
    const fecha: string =  this.campoFechaInicio.value;
    const fechaAl: string =  this.campoFechaFinal.value;
    const tipoFecha: string = this.campoTipoFecha.value;
    this.reporteService.filtroReportes(
      tipoR, cuadrilla, estado, sector,  origen, fecha, fechaAl, tipoFecha)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(reportes => {
        this.listaReportes = reportes;
        this.ReportesCargados = true;
    });
  }

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción:Método para obtener los registros de tipos de reporte, sectores y cuadrillas
  // para mostrarlos en sus respectivos select.
  inicializarListas(): void{
    this.tipoRService.obtenerTiposReporte()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe( tipos => {
      this.listaTiposR = tipos;
      this.tiposCargados = true;
    }, error => {
        console.log('No fue posible obtener los tipos de reportes existentes. ' + error );
    });
    this.sectorService.obtenerSectores()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(sectores => {
      this.listaSectores = sectores;
      this.sectoresCargados = true;
    }, error => {
      console.log('No fue posible obtener los sectores existentes. ' + error );
    });
  }

  // Entrada: Ninguna
  // Salida: valor booleano.
  // Descripción: Método que verifica que los datos se encuentren cargados, con el fin de 
  // determinar en que momento mostrar el formulario o la animación de cargando.
  datosCargados(): boolean{
    let cargado: boolean;
    if (this.ReportesCargados && this.sectoresCargados && this.tiposCargados){
        cargado = true;
    }else{
        cargado = false;
    }
    return cargado;
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

  // Entrada: objeto con la información del reporte.
  // Salida: vacío.
  // Descripción: Método para establecer las caracteristicas del dialog y abrirlo.
  // También contiene el método que ejecuta acciones al cerrar el dialog.
  abrirDialogSeleccionar(reporte: object): void{
    const DIALOG_REF = this.dialog.open( DialogAsignacionTicketsComponent, {
      width: '900px',
      height: '600px',
      disableClose: true,
      autoFocus: false,
      data: {reporte}
    });

    DIALOG_REF.afterClosed()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(() => {
      this.actualizarTabla();
    });
  }

  // Entrada: number para número de permiso
  // Salida: boolean
  // Descripción: Verifica si el usuario que entró al sistema tiene
  // permiso para el proceso que se pide.
  tienePermiso(proceso: number): boolean{
    const permiso: boolean = this.permisoService.verificarPermiso(proceso);
    return permiso;
  }

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción: Función que se llama al dar click en botón seleccionar.
  // manda a llamar a la función que abre el dialog y envía los datos del reporte
  // contenidos en reporte: object
  seleccionarReporte(reporte: object): void{
    if (this.tienePermiso(24)){
      this.abrirDialogSeleccionar(reporte);
    }else{
      alert('No tiene permiso para ejecutar este proceso.');
    }
  }

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción: Ejecuta la función que obtiene los registros de reporte
  // que coinciden con los parámetros de búsqueda (filtros).
  buscar(): void{
    if (this.reporteService.verificarFechas(this.campoFechaInicio.value, this.campoFechaFinal.value, this.campoTipoFecha.value)){
      this.actualizarTabla();
    }else{
      alert('Verifique que los rangos de fecha y el tipo de fecha estén correctos.');
    }
  }

  // Entrada: ninguna.
  // Salida: vacío.
  // Descripción: Método que se llama con el botón limpiar búsqueda.
  // limpia los parámetros de búsqueda para que se vuelva a mostrar la información general.
  limpiarBusqueda(): void{
    this.campoSector.setValue(0);
    this.campoEstado.setValue(1);
    this.campoTipoReporte.setValue(0);
    this.campoFechaInicio.setValue('');
    this.campoFechaFinal.setValue('');
    this.campoTipoFecha.setValue('');
    this.actualizarTabla();
   }

   ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
