import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogVerEditarNuevoCuadrillasComponent } from '../dialog-ver-editar-nuevo-cuadrillas/dialog-ver-editar-nuevo-cuadrillas.component';
import { FormControl } from '@angular/forms';


interface Cuadrilla{
  id: number;
  nombre: string;
  responsable: string;
}

@Component({
  selector: 'app-cuadrillas',
  templateUrl: './cuadrillas.component.html',
  styleUrls: ['./cuadrillas.component.css']
})
export class CuadrillasComponent implements OnInit {
  nombreSeccion = 'Cuadrillas';
  busquedaForm: FormControl;
  estadoForm: FormControl;
  headersTabla: string [];
  datosTabla: object [];
  datos: Cuadrilla[] = [
    {id: 0, nombre: 'cuadrilla 1', responsable: 'jefe 1'},
    {id: 0, nombre: 'cuadrilla 2', responsable: 'jefe 2'},
    {id: 0, nombre: 'cuadrilla 3', responsable: 'jefe 3'},
    {id: 0, nombre: 'cuadrilla 4', responsable: 'jefe 4'},
    {id: 0, nombre: 'cuadrilla 5', responsable: 'jefe 5'},
    {id: 0, nombre: 'cuadrilla 6', responsable: 'jefe 6'},
    {id: 0, nombre: 'cuadrilla 7', responsable: 'jefe 7'}
  ];

  constructor(public dialog: MatDialog) {
    this.formBuilder();
  }

  ngOnInit(): void {
    this.inicializarTabla();
  }

  // Inicializa los controladores del formulario
  formBuilder(){
    this.busquedaForm = new FormControl('');
    this.estadoForm = new FormControl('');
    this.busquedaForm.valueChanges.subscribe(value => {
      console.log('se interactuo busqueda:', value);
    });
    this.estadoForm.valueChanges.subscribe(value => {
      console.log('se interactuo estado:', value);
    });
  }

  // Método para inicializar las variables que contienen los datos que se
  //  mostrarán en la tabla
  inicializarTabla(){
    this.datosTabla = [];
    this.datos.forEach(element => {
      this.datosTabla.push(Object.values(element));
    });
    this.headersTabla = ['ID', 'Cuadrilla', 'Responsable', 'Procesos'];
    console.log('datos tabla:', this.datosTabla);
    console.log('datos:', this.datos);
  }
  
 // Métodos get para obtener acceso a los campos del formulario
 get campoBusqueda(){
   return this.busquedaForm;
 }
 get campoEstado(){
   return this.estadoForm;
 }

// Agregar clases a las columnas 'th' según el contenido
  // que encabecen, para agregar estilos
  // También se añade un estilo general.
  tamanoColumna( encabezado: string): any{
    return {
      'id-col': encabezado === 'ID',
      'botones-procesos-col': encabezado === 'Procesos',
      'general-col': encabezado
    };
  }

 // Método que abre el dialog. Recibe la acción (ver, nuevo, editar o seleccionar, según la sección),
  // además recibe el dato de tipo Reporte, con la información que se muestra en el formulario
  // También contiene el método que se ejecuta cuando el diálogo se cierra.
  abrirDialogVerEditarNuevo(accion: string, registro?: object): void{
    const DIALOG_REF = this.dialog.open(DialogVerEditarNuevoCuadrillasComponent, {
      width: '900px',
      height: '400px',
      disableClose: true,
      data: {accion, registro}
    });
  }

  // Método que se llama al hacer click en botón nuevo. Este llama al método
  // " openDialogVerEditarNuevo" y le envía un parámetro
  // para indicar al dialog el tipo de actividad que se realizará
  nuevaCuadrilla(): void{
    console.log('Nuevo');
    this.abrirDialogVerEditarNuevo('nuevo');
  }
 
  // Método para eliminar sector. Lanza un mensaje de confirmación, que según
  // la respuesta, continúa o no con la eliminación
  eliminarCuadrilla( registro: object): void{
    let result = confirm('¿Seguro que desea eliminar la cuadrilla?');
    if (result) {
      console.log('Se elimina');
      alert('La cuadrilla se ha eliminado.');
    }else{
      console.log('no se elimina');
    }
  }

  // Método que se recibe de la tabla, el tipo de acción que se hará en el formulario del dialog
  recibirAccion(event: string, registro: object): void {
    if (event === 'ver' || event === 'editar'){
      this.abrirDialogVerEditarNuevo(event, registro);
    }else{
      this.eliminarCuadrilla(registro);
    }
  }

  // Método para buscar en la base de datos los registros que coincidan con los
  // valores que se establescan en los campos
 buscar(): void{
   console.log('Click en buscar desde cuadrillas', this.campoBusqueda.value, this.campoEstado.value);
 }

}
