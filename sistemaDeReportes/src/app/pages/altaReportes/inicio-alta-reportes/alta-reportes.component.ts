import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder} from '@angular/forms';
import { DialogVerEditarNuevoAltaReportesComponent } from '../dialog-ver-editar-nuevo-alta-reportes/dialog-ver-editar-nuevo-alta-reportes.component';

interface Reporte{
  num: number;
  fechaInicio: string;
  numTickets: number;
  estado: string;
  sector: string;
  direccion: string;
}

@Component({
  selector: 'app-inicio-alta-reportes',
  templateUrl: './alta-reportes.component.html',
  styleUrls: ['./alta-reportes.component.css']
})
export class AltaReportesComponent implements OnInit {
 @Output() seccion = new EventEmitter<string> ();
 form: FormGroup;
  nombreSeccion = 'Alta de reportes';
  datosAltaReportes: any;
  datos: Reporte[] = [
    {num: 0, fechaInicio: '12/09/2020', numTickets: 12, estado: 'Activo', sector: 'principal', direccion: 'Tamaulipas y guerrero #126'},
    {num: 0, fechaInicio: '12/09/2020', numTickets: 12, estado: 'Activo', sector: 'principal', direccion: 'Tamaulipas y guerrero #126'},
    {num: 0, fechaInicio: '12/09/2020', numTickets: 12, estado: 'Activo', sector: 'principal', direccion: 'Tamaulipas y guerrero #126'},
    {num: 0, fechaInicio: '12/09/2020', numTickets: 12, estado: 'Activo', sector: 'principal', direccion: 'Tamaulipas y guerrero #126'},
    {num: 0, fechaInicio: '12/09/2020', numTickets: 12, estado: 'Activo', sector: 'principal', direccion: 'Tamaulipas y guerrero #126'},
    {num: 0, fechaInicio: '12/09/2020', numTickets: 12, estado: 'Activo', sector: 'principal', direccion: 'Tamaulipas y guerrero #126'},
  ];

  constructor(public dialog: MatDialog, private formBuilder: FormBuilder) {
    this.buildForm();
   }

  ngOnInit(): void {
    this.seccion.emit('Alta de reportes');
    let dataArray = [];
    console.log('datos:', this.datos);
    this.datos.forEach(element => {
      dataArray.push(Object.values(element));
    });
    console.log('dataArray:', dataArray);
    this.datosAltaReportes = {
      pagina: 'altaReportes',
      headers: ['No. Reporte', 'Fecha inicio', 'Fecha cierre', 'Estado', 'Sector', 'Dirección', 'Proceso'],
      data: dataArray
    };
  }

  // Inicializa el formulario reactivo, aquí es donde se crean los controladores de los inputs
  private buildForm(){
    this.form = this.formBuilder.group({
      tipoReporte: [''],
      cuadrilla: [''],
      estado: [''],
      sector: [''],
      origen: [''],
      fechaInicio: [''],
      fechaFinal: ['']
    });
    this.form.valueChanges.subscribe(value => {
      console.log('se interactuo:', value);
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

  // Método que abre el dialog. Recibe la acción (ver, nuevo, editar o seleccionar, según la sección),
  // además recibe el dato de tipo Reporte, con la información que se muestra en el formulario
  // También contiene el método que se ejecuta cuando el diálogo se cierra.
  abrirDialogSeleccionar(accion: string, elemento: Reporte): void{
    const DIALOG_REF = this.dialog.open( DialogVerEditarNuevoAltaReportesComponent, {
      width: '900px',
      height: '600px',
      disableClose: true,
      data: {accion, elemento}
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

  // Acción que se recibe según el botón que se seleccionó en la tabla
  //  Se manda llamar al método que abre el dialog y se le manda esta acción
  recibirAccion(event: any): void{
    let elemento: Reporte;
    this.abrirDialogSeleccionar(event, elemento);
  }

  // Método que se llama con el botón buscar 
  // Aquí se recuperan los criterios de búsqueda establecidos por 
  // el usuario para después utilizarlos en una búsqueda 
  // en la base de datos. 
  buscar(): void{
    console.log('click buscar Alta reportes', this.form.value);
  }

}
