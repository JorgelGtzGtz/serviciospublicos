import { Component, OnInit, Output } from '@angular/core';
import { MatDialog} from '@angular/material/dialog';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { DialogVerEditarNuevoAltaReportesComponent } from '../dialog-ver-editar-nuevo-alta-reportes/dialog-ver-editar-nuevo-alta-reportes.component';
import { ReporteService } from '../../../services/reporte.service';
import { CuadrillaService } from '../../../services/cuadrilla.service';
import { TipoReporteService } from '../../../services/tipo-reporte.service';
import { SectorService } from '../../../services/sector.service';
import { Reporte } from '../../../Interfaces/IReporte';
import { Sector } from '../../../Interfaces/ISector';

@Component({
  selector: 'app-inicio-alta-reportes',
  templateUrl: './alta-reportes.component.html',
  styleUrls: ['./alta-reportes.component.css']
})
export class AltaReportesComponent implements OnInit {
  form: FormGroup;
  nombreSeccion = 'Alta de reportes';
  headersTabla: string [];
  listaReportes: any = [];
  listaCuadrillas: any = [];
  listaTiposR: any = [];
  listaSectores: Sector[] = [];
  ReportesCargados: boolean;
  sectoresCargados: boolean;
  tiposCargados: boolean;
  cuadrillasCargadas: boolean;

  constructor(public dialog: MatDialog, private formBuilder: FormBuilder,
              private reporteService: ReporteService,
              private cuadrillaService: CuadrillaService,
              private tipoRService: TipoReporteService,
              private sectorService: SectorService) {
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
      tipoReporte: ['Todos'],
      cuadrilla: ['Todos'],
      estado: ['Todos'],
      sector: ['Todos'],
      origen: ['Todos'],
      fechaInicio: [''],
      fechaFinal: ['']
    });
    this.form.valueChanges.subscribe(value => {
      console.log('se interactuo:', value);
    });
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
    const tipoR: number =  this.campoTipoReporte.value;
    const cuadrilla: number =  this.campoCuadrilla.value;
    const estado: number =  this.campoEstado.value;
    const sector: number =  this.campoSector.value;
    const origen: number =  this.campoOrigen.value;
    const fecha: string =  this.campoFechaInicial.value;
    const fechaAl: string =  this.campoFechaFinal.value;
    this.reporteService.buscarReportes(
      tipoR.toString(),
      cuadrilla.toString(),
      estado.toString(),
      sector.toString(),
      origen.toString(),
      fecha,
      fechaAl).subscribe(reportes => {
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
    this.tipoRService.obtenerTiposReporte().subscribe( tipos => {
      this.listaTiposR = tipos;
      this.tiposCargados = true;
    }, error => {
        console.log('No fue posible obtener los tipos de reportes existentes. ' + error );
    });
    this.sectorService.obtenerSectores().subscribe(sectores => {
      this.listaSectores = sectores;
      this.sectoresCargados = true;
    }, error => {
      console.log('No fue posible obtener los sectores existentes. ' + error );
    });
    this.cuadrillaService.obtenerCuadrillasConJefe().subscribe( cuadrillas => {
      this.listaCuadrillas = cuadrillas;
      this.cuadrillasCargadas = true;
    }, error => {
      console.log('No fue posible obtener las cuadrillas existentes. ' + error );
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

    DIALOG_REF.afterClosed().subscribe(() => {
      this.actualizarTabla();
    });
  }
// Entrada: Ninguna
// Salida: vacío.
// Descripción: Método que se llama cuando se da click al botón nuevo.
// Llama al método que abre el dialog para crear un nuevo registro.
  nuevoReporte(): void{
    this.abrirDialogSeleccionar('nuevo');

  }

// Entrada: Ninguna
// Salida: vacío.
// Descripción: Método que se llama cuando se da click al botón editar.
// Llama al método que abre el dialog para editar un reporte de la tabla
   editarReporte(reporte: object): void{
    this.abrirDialogSeleccionar('editar', reporte);
  }

// Entrada: Ninguna
// Salida: vacío.
// Descripción: Método que se llama cuando se da click al botón nuevo.
// Llama al método que abre el dialog para ver un reporte de la tabla
  verReporte(reporte: object): void{
    this.abrirDialogSeleccionar('ver', reporte);
  }

// Entrada: Ninguna
// Salida: vacío.
// Descripción: Método que se llama con el botón buscar para ejecutar una búsqueda
// de registros mediante el método actualizarTabla()
  buscar(): void{
    this.actualizarTabla();
  }

    // Entrada: ninguna.
  // Salida: vacío.
  // Descripción: Método que se llama con el botón limpiar búsqueda.
  // limpia los parámetros de búsqueda para que se vuelva a mostrar la información general.
  limpiarBusqueda(): void{
    this.campoSector.setValue('Todos');
    this.campoCuadrilla.setValue('Todos');
    this.campoOrigen.setValue('Todos');
    this.campoEstado.setValue('Todos');
    this.campoTipoReporte.setValue('Todos');
    this.campoFechaInicial.setValue('');
    this.campoFechaFinal.setValue('');
    this.actualizarTabla();
   }

}
