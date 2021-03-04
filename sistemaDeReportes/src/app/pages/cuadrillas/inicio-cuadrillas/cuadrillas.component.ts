import { Component, OnInit, OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogVerEditarNuevoCuadrillasComponent } from '../dialog-ver-editar-nuevo-cuadrillas/dialog-ver-editar-nuevo-cuadrillas.component';
import { FormControl, AbstractControl } from '@angular/forms';
import { Cuadrilla } from '../../../Interfaces/ICuadrilla';
import { CuadrillaService } from '../../../services/cuadrilla.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Usuario } from '../../../Interfaces/IUsuario';
import { UsuarioService } from '../../../services/usuario.service';
import { PermisoService } from '../../../services/permiso.service';


@Component({
  selector: 'app-cuadrillas',
  templateUrl: './cuadrillas.component.html',
  styleUrls: ['./cuadrillas.component.css']
})
export class CuadrillasComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  nombreSeccion = 'Cuadrillas';
  busquedaForm: FormControl;
  estadoForm: FormControl;
  headersTabla: string [];
  listaCuadrillas: any[] = [];
  listaJefes: Object[] = [];
  cuadrillasListas: boolean;
  jefesLista: boolean;

  constructor(public dialog: MatDialog,
              private cuadrillaService: CuadrillaService,
              private usuarioService: UsuarioService,
              private permisoService: PermisoService) {
    this.formBuilder();
    // this.actualizarTabla();
  }

  ngOnInit(): void {
    this.obtenerJefes();
    this.inicializarTabla();
  }

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción: Inicializa los controladores del formulario
  formBuilder(): void{
    this.busquedaForm = new FormControl('');
    this.estadoForm = new FormControl('1');
  }

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción: Método para inicializar las variables que contienen los datos que se
  //  mostrarán en la tabla
  inicializarTabla(): void{
    this.headersTabla = ['Clave', 'Cuadrilla', 'Responsable', 'Procesos'];
    this.actualizarTabla();
  }

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción: Método para obtener los jefes de cuadrillas.
  obtenerJefes(): void{
    this.usuarioService.obtenerListaUsuarios()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe( jefes => {
      this.listaJefes = jefes;
      this.jefesLista = true;
    }, (error: HttpErrorResponse) => {
      alert('Surgió un problema al cargar datos de página. Vuelva a cargar o solicite asistencia.');
      console.log('Error al obtener lista de cuadrillas disponibles. Error:' + error.message);
    });
  }

  actualizarTabla(): void{
    this.cuadrillaService.obtenerCuadrillasFiltro(this.campoBusqueda.value, this.campoEstado.value)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe( cuadrillas => {
      this.listaCuadrillas = cuadrillas;
      this.cuadrillasListas = true;
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
    DIALOG_REF.afterClosed()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(result => {
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
  // Descripción: Método que se llama al hacer click en botón nuevo. Este llama al
  // método "abrirDialogVerEditarNuevo".
  nuevaCuadrilla(): void{
    if (this.tienePermiso(11)){
      this.abrirDialogVerEditarNuevo('nuevo');
    }else{
      alert('No tiene permiso para ejecutar este proceso.');
    }
  }

  // Entrada: Objeto con los datos de la cuadrilla.
  // Salida: vacío.
  // Descripción: Método para editar una cuadrilla de la tabla. Este llama al
  // método "abrirDialogVerEditarNuevo".
  editarCuadrilla(cuadrilla: any): void{
    if (this.tienePermiso(13)){
      this.abrirDialogVerEditarNuevo('editar', cuadrilla);
    }else{
      alert('No tiene permiso para ejecutar este proceso.');
    }
  }

  // Entrada: Objeto con los datos de la cuadrilla.
  // Salida: vacío.
  // Descripción: Método para ver una cuadrilla de la tabla. Este llama al
  // método "abrirDialogVerEditarNuevo".
  verCuadrilla(cuadrilla: any): void{
    if (this.tienePermiso(12)){
      this.abrirDialogVerEditarNuevo('ver', cuadrilla);
    }else{
      alert('No tiene permiso para ejecutar este proceso.');
    }
  }

  // Entrada: Objeto con los datos de la cuadrilla.
  // Salida: vacío.
  // Descripción: Método para eliminar cuadrilla. Lanza un mensaje de confirmación, que según
  // la respuesta, continúa o no con la eliminación
  eliminarCuadrilla( cuadrilla: Cuadrilla): void{
    if (this.tienePermiso(15)){
      const result = confirm('¿Seguro que desea eliminar la cuadrilla?');
      if (result) {
        this.cuadrillaService.eliminarCuadrilla(cuadrilla)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe( res => {
          alert(res);
          this.actualizarTabla();
        }, (error: HttpErrorResponse) => {
          alert('Se generó un problema al eliminar cuadrilla ' + cuadrilla.Nombre_cuadrilla + ' intente de nuevo o solicite asistencia.');
          console.log('Error al eliminar cuadrilla:' + error.message);
        });
      }
    }else{
      alert('No tiene permiso para ejecutar este proceso.');
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
    this.campoEstado.setValue('1');
    this.actualizarTabla();
   }

   ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
