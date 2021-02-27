import { Component, OnInit, OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogVerEditarNuevoComponent } from '../dialog-ver-editar-nuevo/dialog-ver-editar-nuevo.component';
import { FormControl, AbstractControl } from '@angular/forms';
import { TipoUsuarioService } from '../../../services/tipo-usuario.service';
import { TipoUsuario } from '../../../Interfaces/ITipoUsuario';
import { HttpErrorResponse } from '@angular/common/http';
import { PermisoService } from '../../../services/permiso.service';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../Interfaces/IUsuario';

@Component({
  selector: 'app-tipos-de-usuario',
  templateUrl: './tipos-de-usuario.component.html',
  styleUrls: ['./tipos-de-usuario.component.css']
})
export class TiposDeUsuarioComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  nombreSeccion = 'Tipos de Usuario';
  busquedaForm: FormControl;
  estadoForm: FormControl;
  headersTabla: string [];
  tiposUsuario: TipoUsuario[] = [];
  datos: boolean = false;


  constructor(public dialog: MatDialog,
              private tipoService: TipoUsuarioService,
              private permisoService: PermisoService) {
    this.buildForm();
   }

  ngOnInit(): void {
    this.inicializarTabla();
  }

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción:Inicializa el formulario reactivo, aquí es donde se crean los controladores de los inputs
  private buildForm(): void{
    this.busquedaForm = new FormControl('');
    this.estadoForm = new FormControl('1');
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

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción: Método para inicializar la estructura de la tabla
  inicializarTabla(): void{
    this.headersTabla = ['Clave', 'Tipo de usuario', 'Procesos'];
    this.actualizarTabla();
  }

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción: Método para obtener los registros existentes de Tipos de Usuario
  // de acuerdo a determinados filtros.
  actualizarTabla(): void{
    this.tipoService.filtroTiposUsuario(this.campoBusqueda.value, this.campoEstado.value)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe( tipos => {
      this.tiposUsuario = tipos;
      this.datos = true;
    }, (error: HttpErrorResponse) => {
      alert('Se generó un problema al cargar los datos de página. Recargue página o solicite asistencia.');
      console.log('Error al cargar datos de tabla Tipos de usuario: ' +  error.message);
    });
  }

  // Entrada: Valor tipo string con el nombre del header
  // Salida: valor con el nombre de la clase a asignar.
  // Descripción: asigna una clase para CSS según el nombre del header.
  tamanoColumna( encabezado: string): any{
    return {
      'id-col': encabezado === 'ID',
      'botones-procesos-col': encabezado === 'Procesos',
      'general-col': encabezado
    };
  }

  // Entrada: valor string con la acción a realizar y valor de Tipo Usuario
  // Salida: vacío.
  // Descripción: Método que abre el dialog. Recibe la acción (ver, nuevo, editar o seleccionar, según la sección),
  // además recibe el dato de tipo Reporte, con la información que se muestra en el formulario
  // También contiene el método que se ejecuta cuando el diálogo se cierra.
  openDialogVerEditarNuevo(accion: string, tipoU?: TipoUsuario): void{
    const DIALOG_REF = this.dialog.open(DialogVerEditarNuevoComponent, {
      width: '900px',
      height: '600px',
      disableClose: true,
      autoFocus: false,
      closeOnNavigation: false,
      data: {accion, tipoU}
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
  // Descripción: Método que se llama al hacer click en botón nuevo.
  nuevoTipoUsuario(): void{
    if (this.tienePermiso(3)){
      this.openDialogVerEditarNuevo('nuevo');
    }else{
      alert('No tiene permiso para ejecutar este proceso.');
    }
  }

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción: Método para editar un tipo de usuario de la tabla
  editarTipoUsuario(tipoU: TipoUsuario): void{
    if (this.tienePermiso(5)){
      this.openDialogVerEditarNuevo('editar', tipoU);
    }else{
      alert('No tiene permiso para ejecutar este proceso.');
    }
  }

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción: Método para ver un tipo de usuario de la tabla
  verTipoUsuario(tipoU: TipoUsuario): void{
    if (this.tienePermiso(4)){
      this.openDialogVerEditarNuevo('ver', tipoU);
    }else{
      alert('No tiene permiso para ejecutar este proceso.');
    }
  }

  // Entrada: valor de tipo TipoUsuario
  // Salida: vacío.
  // Descripción: Método para eliminar un tipo de usuario. Lanza un mensaje de confirmación.
  eliminarTipoUsuario(tipoU: TipoUsuario): void{
    if (this.tienePermiso(6)){
      const result = confirm('¿Seguro que desea eliminar el tipo de usuario?');
      if (result) {
        this.tipoService.eliminarTipoUsuario(tipoU)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe( res => {
        this.actualizarTabla();
        alert(res);
      }, (error: HttpErrorResponse) => {
        alert('No ha sido posible eliminar el tipo de usuario. Verifique que no existan registros relacionados o solicite asistencia.');
      });
    }
    }else{
      alert('No tiene permiso para ejecutar este proceso.');
    }
  }

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción: Método para buscar en la base de datos los registros que coincidan con los
  // valores que se establescan en los campos
  buscar(): void{
    this.tipoService.filtroTiposUsuario(this.campoBusqueda.value, this.campoEstado.value)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe( tipos => {
      this.tiposUsuario = tipos;
    }, (error: HttpErrorResponse) => {
      alert('No ha sido posible completar la búsqueda. Verifique los datos o solicite apoyo.');
      console.log('Error al hacer búsqueda:' + error.message);
    });
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
