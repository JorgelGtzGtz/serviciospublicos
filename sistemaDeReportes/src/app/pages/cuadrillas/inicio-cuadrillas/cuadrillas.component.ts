import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogVerEditarNuevoCuadrillasComponent } from '../dialog-ver-editar-nuevo-cuadrillas/dialog-ver-editar-nuevo-cuadrillas.component';
import { FormControl } from '@angular/forms';
import { Cuadrilla } from '../../../Interfaces/ICuadrilla';
import { CuadrillaService } from '../../../services/cuadrilla.service';
import { HttpErrorResponse } from '@angular/common/http';


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
  listaCuadrillas: any = [];
  cuadrillasListas: boolean;

  constructor(public dialog: MatDialog, private cuadrillaService: CuadrillaService) {
    this.formBuilder();
    this.actualizarListaCuadrillas();
  }

  ngOnInit(): void {
    this.inicializarTabla();
  }

  // Inicializa los controladores del formulario
  formBuilder(){
    this.busquedaForm = new FormControl('');
    this.estadoForm = new FormControl('Todos');
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
    this.headersTabla = ['Clave', 'Cuadrilla', 'Responsable', 'Procesos'];
  }

  actualizarListaCuadrillas(){
    return this.cuadrillaService.obtenerCuadrillasFiltro(this.campoBusqueda.value, this.campoEstado.value).subscribe( cuadrillas => {
      this.listaCuadrillas = cuadrillas;
      this.cuadrillasListas = true;
      console.log('Cuadrillas lista:', cuadrillas);
    }, (error: HttpErrorResponse) => {
      alert('Error al obtener lista de cuadrillas disponibles. Error:' + error.message);
    });
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
  abrirDialogVerEditarNuevo(accion: string, cuadrilla?: any): void{
    const DIALOG_REF = this.dialog.open(DialogVerEditarNuevoCuadrillasComponent, {
      width: '900px',
      height: '400px',
      disableClose: true,
      data: {accion, cuadrilla}
    });
    DIALOG_REF.afterClosed().subscribe(result => {
      this.actualizarListaCuadrillas();
    });
  }

  // Método que se llama al hacer click en botón nuevo. Este llama al método
  // " openDialogVerEditarNuevo" y le envía un parámetro
  // para indicar al dialog el tipo de actividad que se realizará
  nuevaCuadrilla(): void{
    this.abrirDialogVerEditarNuevo('nuevo');
  }

  // Método para editar una cuadrilla de la tabla
  editarCuadrilla(cuadrilla: any){
    this.abrirDialogVerEditarNuevo('editar', cuadrilla);
  }

  // Método para ver una cuadrilla de la tabla
  verCuadrilla(cuadrilla: any){
    this.abrirDialogVerEditarNuevo('ver', cuadrilla);
  }
 
  // Método para eliminar sector. Lanza un mensaje de confirmación, que según
  // la respuesta, continúa o no con la eliminación
  eliminarCuadrilla( cuadrilla: Cuadrilla): void{
    let result = confirm('¿Seguro que desea eliminar la cuadrilla?');
    if (result) {
      this.cuadrillaService.eliminarCuadrilla(cuadrilla.ID_cuadrilla).subscribe( res => {
        alert('La cuadrilla se ha eliminado.');
        this.actualizarListaCuadrillas();
      }, (error: HttpErrorResponse) => {
        alert('Existió un problema al eliminar cuadrilla ' + cuadrilla.Nombre_cuadrilla +
              '.Error:' + error.message);
      });
      console.log('Se elimina');
    }else{
      console.log('no se elimina');
    }
  }

  // Método para buscar en la base de datos los registros que coincidan con los
  // valores que se establescan en los campos
 buscar(): void{
   this.actualizarListaCuadrillas();
   console.log('Click en buscar desde cuadrillas', this.campoBusqueda.value, this.campoEstado.value);
 }

}
