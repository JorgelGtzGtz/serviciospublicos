import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogAsignacionTicketsComponent } from '../dialog-asignacion-tickets/dialog-asignacion-tickets.component';
import { FormGroup, FormBuilder} from '@angular/forms';

interface Reporte{
  num: number;
  fechaInicio: string;
  numTickets: number;
  estado: string;
  sector: string;
  direccion: string;
}

@Component({
  selector: 'app-asignacion-de-tickets',
  templateUrl: './asignacion-de-tickets.component.html',
  styleUrls: ['./asignacion-de-tickets.component.css']
})
export class AsignacionDeTicketsComponent implements OnInit {
  nombreSeccion = 'Asignación de tickets a cuadrilla';
  datosAsignacionTickets: any;
  headersTabla: string [];
  datosTabla: object [];
  form: FormGroup;
  datos: Reporte[] = [
    {num: 1, fechaInicio: '12-09-2020', numTickets: 12, estado: 'Abierto', sector: 'Sur', direccion: 'Tamaulipas y guerrero #126'},
    {num: 3, fechaInicio: '12-09-2020', numTickets: 12, estado: 'Abierto', sector: 'Norte', direccion: 'Tamaulipas y guerrero #126'},
    {num: 5, fechaInicio: '12-09-2020', numTickets: 12, estado: 'Abierto', sector: 'Noroeste', direccion: 'Tamaulipas y guerrero #126'},
    {num: 6, fechaInicio: '12-09-2020', numTickets: 12, estado: 'Abierto', sector: 'Sureste', direccion: 'Tamaulipas y guerrero #126'},
    {num: 7, fechaInicio: '12-09-2020', numTickets: 12, estado: 'Abierto', sector: 'Este', direccion: 'Tamaulipas y guerrero #126'},
    {num: 8, fechaInicio: '12-09-2020', numTickets: 12, estado: 'Abierto', sector: 'principal', direccion: 'Tamaulipas y guerrero #126'},
  ];

  constructor( public dialog: MatDialog, private formBuilder: FormBuilder) {
    this.buildForm();
  }

  ngOnInit(): void {
    this.inicializarTabla();
  }

   // Inicializa el formulario reactivo, aquí es donde se crean los controladores de los inputs
   private buildForm(){
    this.form = this.formBuilder.group({
      sector: ['Todos'],
      estado: ['Todos'],
      tipoReporte: ['Todos'],
      fechaInicio: [''],
      fechaFinal: ['']
    });
    this.form.valueChanges.subscribe(value => {
      console.log('se interactuo:', value);
    });
  }

  // Método para inicializar las variables que contienen los datos que se
  //  mostrarán en la tabla
  inicializarTabla(){
    this.datosTabla = [];
    this.datos.forEach(element => {
      this.datosTabla.push(Object.values(element));
    });
    this.headersTabla = ['No. Reporte', 'Fecha inicio', 'No. tickets', 'Estado', 'Sector', 'Dirección', 'Seleccionar'];
    console.log('datos tabla:', this.datosTabla);
    console.log('datos:', this.datos);
  }

  // Métodos get para obtener acceso a los campos del formulario
  get campoSector(){
    return this.form.get('sector');
  }

  get campoEstado(){
    return this.form.get('estado');
  }
  
  get campoTipoReporte(){
    return this.form.get('tipoReporte');
  }

  get campoFechaInicio(){
    return this.form.get('fechaInicio');
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
      'boton-seleccionar-col': encabezado === 'Seleccionar',
      'general-col': encabezado
    };
  }

 // Método que abre el dialog. Recibe la acción (ver, nuevo, editar o seleccionar, según la sección),
  // además recibe el dato de tipo Reporte, con la información que se muestra en el formulario
  // También contiene el método que se ejecuta cuando el diálogo se cierra.
  abrirDialogSeleccionar(accion: string, registro: object): void{
    const DIALOG_REF = this.dialog.open( DialogAsignacionTicketsComponent, {
      width: '900px',
      height: '600px',
      disableClose: true,
      data: {accion, registro}
    });
  }

  seleccionarReporte(event: string, registro: object): void{
    this.abrirDialogSeleccionar(event, registro);
  }

  buscar(): void{
    console.log('click buscar asignacion de tickets a cuadrillas', this.form.value);
  }

}
