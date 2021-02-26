import { Component, OnInit, OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatDialog} from '@angular/material/dialog';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { DialogVerEditarNuevoAltaReportesComponent } from '../dialog-ver-editar-nuevo-alta-reportes/dialog-ver-editar-nuevo-alta-reportes.component';
import { ReporteService } from '../../../services/reporte.service';
import { CuadrillaService } from '../../../services/cuadrilla.service';
import { TipoReporteService } from '../../../services/tipo-reporte.service';
import { SectorService } from '../../../services/sector.service';
import { Reporte } from '../../../Interfaces/IReporte';
import { Sector } from '../../../Interfaces/ISector';
import { Cuadrilla } from '../../../Interfaces/ICuadrilla';
import { TipoReporte } from '../../../Interfaces/ITipoReporte';
import { PermisoService } from '../../../services/permiso.service';

@Component({
  selector: 'app-inicio-alta-reportes',
  templateUrl: './alta-reportes.component.html',
  styleUrls: ['./alta-reportes.component.css']
})
export class AltaReportesComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  form: FormGroup;
  nombreSeccion = 'Alta de reportes';
  headersTabla: string [];
  listaReportes: any[] = [];
  listaCuadrillas: Cuadrilla[] = [];
  listaTiposR: TipoReporte[] = [];
  listaSectores: Sector[] = [];
  ReportesCargados: boolean;
  sectoresCargados: boolean;
  tiposCargados: boolean;
  cuadrillasCargadas: boolean;

  constructor(public dialog: MatDialog, private formBuilder: FormBuilder,
              private reporteService: ReporteService,
              private cuadrillaService: CuadrillaService,
              private tipoRService: TipoReporteService,
              private sectorService: SectorService,
              private permisoService: PermisoService) {
    this.buildForm();
   }

  ngOnInit(): void {
    this. inicializarListas();
    this.inicializarTabla();
  }

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción: Inicializa el formulario y el grupo de controles; cada control
  // representa cada entrada del formulario.
  private buildForm(): void{
    this.form = this.formBuilder.group({
      tipoReporte: [0],
      cuadrilla: [0],
      estado: [1],
      sector: [0],
      origen: [0],
      fechaInicio: [''],
      fechaFinal: [''],
      tipoFecha: ['']
    });
  }

    // Entrada: Ninguna
  // Salida: control de tipo abstract control.
  // Descripción: Métodos get para obtener acceso a los campos del formulario
  get campoTipoReporte(): AbstractControl{
    return this.form.get('tipoReporte');
  }

  get campoCuadrilla(): AbstractControl{
    return this.form.get('cuadrilla');
  }

  get campoEstado(): AbstractControl{
    return this.form.get('estado');
  }

  get campoSector(): AbstractControl{
    return this.form.get('sector');
  }

  get campoOrigen(): AbstractControl{
    return this.form.get('origen');
  }

  get campoFechaInicial(): AbstractControl{
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
      'Fecha cierre',
      'Estado',
      'Sector',
      'Dirección',
      'Proceso'];
  }

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción:Método para llenar la tabla mediante una petición del servicio de reporte,
  // con los registros de reportes existentes. Puede ser según
  // filtros que se especifican con el valor de cada control del formulario.
  actualizarTabla(): void{
    const tipoR: string =  (this.campoTipoReporte.value).toString();
    const cuadrilla: string =  (this.campoCuadrilla.value).toString();
    const estado: string =  (this.campoEstado.value).toString();
    const sector: string =  (this.campoSector.value).toString();
    const origen: string =  (this.campoOrigen.value).toString();
    const fecha: string =  this.campoFechaInicial.value;
    const fechaAl: string =  this.campoFechaFinal.value;
    const tipoFecha: string = this.campoTipoFecha.value;
    this.reporteService.filtroReportes(tipoR, cuadrilla, estado, sector, origen, fecha, fechaAl, tipoFecha)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(reportes => {
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
    if (this.ReportesCargados && this.sectoresCargados &&
        this.cuadrillasCargadas && this.tiposCargados){
        cargado = true;
    }else{
        cargado = false;
    }
    return cargado;
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
    this.cuadrillaService.obtenerCuadrillasGeneral()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe( cuadrillas => {
      this.listaCuadrillas = cuadrillas;
      this.cuadrillasCargadas = true;
    }, error => {
      console.log('No fue posible obtener las cuadrillas existentes. ' + error );
    });
  }

  // Entrada: Ninguna
  // Salida: objeto que indica la clase de estilo a aplicar.
  // Descripción:Método para Agregar clases a las columnas 'th' según el contenido
  // que encabecen, para agregar estilos. También se añade un estilo general.
  tamanoColumna( encabezado: string): object{
    return {
      'id-col': encabezado === 'No. Reporte',
      'botones-procesos-col': encabezado === 'Procesos',
      'general-col': encabezado
    };
  }
  // Entrada: un valor string que indica la accion (nuevo, editar o ver) y el registro de
  //          reporte seleccionado.
  // Salida: vacío.
  // Descripción: Método para abrir el dialog para ver, editar o crear un nuevo registro. También
  // contiene las acciones a ejecutar cuando se cierra el dialog.
  abrirDialogSeleccionar(accion: string, reporte?: object): void{
    const DIALOG_REF = this.dialog.open( DialogVerEditarNuevoAltaReportesComponent, {
      width: '900px',
      height: '600px',
      disableClose: true,
      autoFocus: false,
      data: {accion, reporte}
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
// Descripción: Método que se llama cuando se da click al botón nuevo.
// Llama al método que abre el dialog para crear un nuevo registro.
  nuevoReporte(): void{
    if (this.tienePermiso(20)){
      this.abrirDialogSeleccionar('nuevo');
    }else{
      alert('No tiene permiso para ejecutar este proceso.');
    }
  }

// Entrada: Ninguna
// Salida: vacío.
// Descripción: Método que se llama cuando se da click al botón editar.
// Llama al método que abre el dialog para editar un reporte de la tabla
   editarReporte(reporte: object): void{
     if (this.tienePermiso(22)){
      this.abrirDialogSeleccionar('editar', reporte);
    }else{
      alert('No tiene permiso para ejecutar este proceso.');
    }
  }

// Entrada: Ninguna
// Salida: vacío.
// Descripción: Método que se llama cuando se da click al botón nuevo.
// Llama al método que abre el dialog para ver un reporte de la tabla
  verReporte(reporte: object): void{
    if (this.tienePermiso(21)){
      this.abrirDialogSeleccionar('ver', reporte);
    }else{
      alert('No tiene permiso para ejecutar este proceso.');
    }
  }

// Entrada: Ninguna
// Salida: vacío.
// Descripción: Método que se llama con el botón buscar para ejecutar una búsqueda
// de registros mediante el método actualizarTabla()
  buscar(): void{
    if (this.reporteService.verificarFechas(this.campoFechaInicial.value, this.campoFechaFinal.value, this.campoTipoFecha.value)){
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
    this.campoCuadrilla.setValue(0);
    this.campoOrigen.setValue(0);
    this.campoEstado.setValue(1);
    this.campoTipoReporte.setValue(0);
    this.campoFechaInicial.setValue('');
    this.campoFechaFinal.setValue('');
    this.campoTipoFecha.setValue('');
    this.actualizarTabla();
   }

   ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
