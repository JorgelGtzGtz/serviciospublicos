import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder} from '@angular/forms';
import { DialogVerEditarNuevoAltaReportesComponent } from '../dialog-ver-editar-nuevo-alta-reportes/dialog-ver-editar-nuevo-alta-reportes.component';
import { ReporteService } from '../../../services/reporte.service';
import { CuadrillaService } from '../../../services/cuadrilla.service';
import { TipoReporteService } from '../../../services/tipo-reporte.service';
import { SectorService } from '../../../services/sector.service';
import { Reporte } from '../../../Interfaces/IReporte';

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
  listaSectores: any = [];
  listaCuadrillas: any = [];
  listaTiposR: any = [];

  constructor(public dialog: MatDialog, private formBuilder: FormBuilder,
              private reporteService: ReporteService,
              private cuadrillaService: CuadrillaService,
              private tipoRService: TipoReporteService,
              private sectorService: SectorService) {
    this.buildForm();
    this. inicializarListas();
   }

  ngOnInit(): void {
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

  // Inicializa el formulario reactivo, aquí es donde se crean los controladores de los inputs
  private buildForm(){
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

  // Método para inicializar las variables que contienen los datos que se
  //  mostrarán en la tabla
  actualizarTabla(){
    this.reporteService.buscarReportes().subscribe(reportes => {
      this.listaReportes = reportes;
      console.log(this.listaReportes);
    });
  }

  inicializarListas(){
    this.tipoRService.obtenerTiposReporte().subscribe( tipos => {
      this.listaTiposR = tipos;
    }, error => {
        console.log('Error al acceder a datos de tipos de reporte. ' + error );
    });
    this.sectorService.obtenerSectores().subscribe(sectores => {
      this.listaSectores = sectores;
    }, error => {
      console.log('Error al acceder a datos de sectores. ' + error );
    });
    this.cuadrillaService.obtenerCuadrillas().subscribe( cuadrillas => {
      this.listaCuadrillas = cuadrillas;
    }, error => {
      console.log('Error al acceder a datos de cuadrillas. ' + error );
    });
  }

  // Métodos get para obtener acceso a los campos del formulario
  get campoTipoReporte(){
    return this.form.get('tipoReporte');
  }

  get campoCuadrilla(){
    return this.form.get('cuadrilla');
  }

  get campoEstado(){
    return this.form.get('estado');
  }

  get campoSector(){
    return this.form.get('sector');
  }

  get campoOrigen(){
    return this.form.get('origen');
  }

  get campoFechaInicial(){
    return this.form.get('fechaInicial');
  }

  get campoFechaFinal(){
    return this.form.get('fechaFinal');
  }

  
  // Agregar clases a las columnas 'th' según el contenido
  // que encabecen, para agregar estilos
  // También se añade un estilo general.
  tamanoColumna( encabezado: string): any{
    return {
      'id-col': encabezado === 'No. Reporte',
      'botones-procesos-col': encabezado === 'Procesos',
      'general-col': encabezado
    };
  }

  // Método que abre el dialog. Recibe la acción (ver, nuevo, editar o seleccionar, según la sección),
  // además recibe el dato de tipo Reporte, con la información que se muestra en el formulario
  // También contiene el método que se ejecuta cuando el diálogo se cierra.
  abrirDialogSeleccionar(accion: string, registro: object): void{
    const DIALOG_REF = this.dialog.open( DialogVerEditarNuevoAltaReportesComponent, {
      width: '900px',
      height: '600px',
      disableClose: true,
      data: {accion, registro}
    });

    DIALOG_REF.afterClosed().subscribe(result => {
      console.log('The dialog was closed result:', result);
    });
  }

// Metodo que se llama cuando se da click al botón nuevo
// Abre el dialogo con las configuraciones para crear un nuevo registro
  nuevoReporte(): void{
    let elemento: Reporte;
    this.abrirDialogSeleccionar('nuevo', elemento);

  }

   // Método para editar un reporte de la tabla
   editarReporte(registro: object){
    this.abrirDialogSeleccionar('editar', registro);
  }

  // Método para ver un reporte de la tabla
  verReporte(registro: object){
    this.abrirDialogSeleccionar('ver', registro);
  }


  // Método que se llama con el botón buscar 
  // Aquí se recuperan los criterios de búsqueda establecidos por 
  // el usuario para después utilizarlos en una búsqueda 
  // en la base de datos. 
  buscar(): void{
    console.log('click buscar Alta reportes', this.form.value);
  }

}
