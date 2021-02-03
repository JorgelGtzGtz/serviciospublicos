import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogVerEditarNuevoCuadrillasComponent } from '../dialog-ver-editar-nuevo-cuadrillas/dialog-ver-editar-nuevo-cuadrillas.component';
import { FormControl, AbstractControl } from '@angular/forms';
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
  listaCuadrillas: any[] = [];
  cuadrillasListas: boolean;

  constructor(public dialog: MatDialog, private cuadrillaService: CuadrillaService) {
    this.formBuilder();
    // this.actualizarTabla();
  }

  ngOnInit(): void {
    this.inicializarTabla();
  }

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción: Inicializa los controladores del formulario
  formBuilder(): void{
    this.busquedaForm = new FormControl('');
    this.estadoForm = new FormControl('Todos');
  }

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción: Método para inicializar las variables que contienen los datos que se
  //  mostrarán en la tabla
  inicializarTabla(): void{
    this.headersTabla = ['Clave', 'Cuadrilla', 'Responsable', 'Procesos'];
    this.actualizarTabla();
  }

  actualizarTabla(): void{
    this.cuadrillaService.obtenerCuadrillasFiltro(this.campoBusqueda.value, this.campoEstado.value).subscribe( cuadrillas => {
      this.listaCuadrillas = cuadrillas;
      this.cuadrillasListas = true;
      console.log('Cuadrillas lista:', cuadrillas);
    }, (error: HttpErrorResponse) => {
      alert('Surgió un problema al cargar datos de página. Vuelva a cargar o solicite asistencia.');
      console.log('Error al obtener lista de cuadrillas disponibles. Error:' + error.message);
    });
  }

  // Entrada: Ninguna
  // Salida: control de tipo AbstractControl.
  // Descripción:Métodos get para obtener acceso a los campos del formulario
 get campoBusqueda(): AbstractControl{
   return this.busquedaForm;
 }
 get campoEstado(): AbstractControl{
   return this.estadoForm;
 }

  // Entrada: Valor de tipo string con encabezado de tabla
  // Salida: clase de tipo CSS.
  // Descripción: Método para agregar clases de CSS a headers de la tabla.
  tamanoColumna( encabezado: string): any{
    return {
      'id-col': encabezado === 'ID',
      'botones-procesos-col': encabezado === 'Procesos',
      'general-col': encabezado
    };
  }

  // Entrada: Valor de tipo string con acción a ejecutar y cuadrilla sobre la cual
  //          ejecutar acciones (parámetro opcional)
  // Salida: vacío.
  // Descripción: Método que abre el dialog. Recibe la acción (ver, nuevo, editar o seleccionar, según la sección),
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
      this.actualizarTabla();
    });
  }

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción: Método que se llama al hacer click en botón nuevo. Este llama al
  // método "abrirDialogVerEditarNuevo".
  nuevaCuadrilla(): void{
    this.abrirDialogVerEditarNuevo('nuevo');
  }

  // Entrada: Objeto con los datos de la cuadrilla.
  // Salida: vacío.
  // Descripción: Método para editar una cuadrilla de la tabla. Este llama al
  // método "abrirDialogVerEditarNuevo".
  editarCuadrilla(cuadrilla: any): void{
    this.abrirDialogVerEditarNuevo('editar', cuadrilla);
  }

  // Entrada: Objeto con los datos de la cuadrilla.
  // Salida: vacío.
  // Descripción: Método para ver una cuadrilla de la tabla. Este llama al
  // método "abrirDialogVerEditarNuevo".
  verCuadrilla(cuadrilla: any): void{
    this.abrirDialogVerEditarNuevo('ver', cuadrilla);
  }

  // Entrada: Objeto con los datos de la cuadrilla.
  // Salida: vacío.
  // Descripción: Método para eliminar cuadrilla. Lanza un mensaje de confirmación, que según
  // la respuesta, continúa o no con la eliminación
  eliminarCuadrilla( cuadrilla: Cuadrilla): void{
    const result = confirm('¿Seguro que desea eliminar la cuadrilla?');
    if (result) {
      this.cuadrillaService.eliminarCuadrilla(cuadrilla).subscribe( res => {
        alert('La cuadrilla se ha eliminado.');
        this.actualizarTabla();
      }, (error: HttpErrorResponse) => {
        alert('Existió un problema al eliminar cuadrilla ' + cuadrilla.Nombre_cuadrilla + ' intente de nuevo o solicite asistencia.');
        console.log('Error al eliminar cuadrilla:' + error.message);
      });
    }
  }

  // Entrada: ninguna.
  // Salida: vacío.
  // Descripción: Método para buscar en la base de datos los registros que coincidan con los
  // valores que se establescan en los campos
 buscar(): void{
   this.actualizarTabla();
 }

  // Entrada: ninguna.
  // Salida: vacío.
  // Descripción: Método que se llama con el botón limpiar búsqueda.
  // limpia los parámetros de búsqueda para que se vuelva a mostrar la información general.
  limpiarBusqueda(): void{
    this.campoBusqueda.setValue('');
    this.campoEstado.setValue('Todos');
    this.actualizarTabla();
   }

}
