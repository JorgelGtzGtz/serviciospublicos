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
  form: FormGroup;
  datos: Reporte[] = [
    {num: 0, fechaInicio: '12/09/2020', numTickets: 12, estado: 'Activo', sector: 'principal', direccion: 'Tamaulipas y guerrero #126'},
    {num: 0, fechaInicio: '12/09/2020', numTickets: 12, estado: 'Activo', sector: 'principal', direccion: 'Tamaulipas y guerrero #126'},
    {num: 0, fechaInicio: '12/09/2020', numTickets: 12, estado: 'Activo', sector: 'principal', direccion: 'Tamaulipas y guerrero #126'},
    {num: 0, fechaInicio: '12/09/2020', numTickets: 12, estado: 'Activo', sector: 'principal', direccion: 'Tamaulipas y guerrero #126'},
    {num: 0, fechaInicio: '12/09/2020', numTickets: 12, estado: 'Activo', sector: 'principal', direccion: 'Tamaulipas y guerrero #126'},
    {num: 0, fechaInicio: '12/09/2020', numTickets: 12, estado: 'Activo', sector: 'principal', direccion: 'Tamaulipas y guerrero #126'},
  ];

  constructor( public dialog: MatDialog, private formBuilder: FormBuilder) { 
    this.buildForm();
  }

  ngOnInit(): void {
    let dataArray = [];
    this.datos.forEach(element => {
      dataArray.push(Object.values(element));
    });
    this.datosAsignacionTickets = {
      pagina: 'asignacionticketsCuadrilla',
      headers: ['No. Reporte', 'Fecha inicio', 'No. tickets', 'Estado', 'Sector', 'Dirección', 'Seleccionar'],
      data: dataArray
    };
  }

   // Inicializa el formulario reactivo, aquí es donde se crean los controladores de los inputs
   private buildForm(){
    this.form = this.formBuilder.group({
      sector: [''],
      estado: [''],
      tipoReporte: [''],
      fechaInicio: [''],
      fechaFinal: ['']
    });
    this.form.valueChanges.subscribe(value => {
      console.log('se interactuo:', value);
    });
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


 // Método que abre el dialog. Recibe la acción (ver, nuevo, editar o seleccionar, según la sección),
  // además recibe el dato de tipo Reporte, con la información que se muestra en el formulario
  // También contiene el método que se ejecuta cuando el diálogo se cierra.
  abrirDialogSeleccionar(accion: string): void{
    const DIALOG_REF = this.dialog.open( DialogAsignacionTicketsComponent, {
      width: '900px',
      height: '600px',
      disableClose: true,
      data: {accion}
    });
  }

  seleccionarReporte(event: string): void{
    this.abrirDialogSeleccionar(event);
  }

  buscar(): void{
    console.log('click buscar asignacion de tickets a cuadrillas', this.form.value);
  }

}
