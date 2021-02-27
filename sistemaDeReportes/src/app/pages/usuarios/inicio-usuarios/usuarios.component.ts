import { Component, OnInit, OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogVerEditarNuevoUsuarioComponent } from '../dialog-ver-editar-nuevo-usuario/dialog-ver-editar-nuevo-usuario.component';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario.service';
import { TipoUsuarioService } from '../../../services/tipo-usuario.service';
import { HttpErrorResponse } from '@angular/common/http';
import { TipoUsuario } from '../../../Interfaces/ITipoUsuario';
import { PermisoService } from '../../../services/permiso.service';

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  form: FormGroup;
  nombreSeccion = 'Usuarios';
  headersTabla: string [];
  usuarios: any[] = [];
  tiposUsuario: TipoUsuario[] = [];
  tiposListos: boolean;
  usuariosListos: boolean;


  constructor( public dialog: MatDialog, private formBuilder: FormBuilder,
               private usuarioService: UsuarioService,
               private permisoService: PermisoService,
               private tipoService: TipoUsuarioService) {
    this.buildForm();
   }

  ngOnInit(): void {
    this.inicializarTabla();
    this.obtenerTiposUsuario();
  }

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción: Inicializa el formulario reactivo, aquí es donde se crean los controladores de los inputs
   private buildForm(): void{
    this.form = this.formBuilder.group({
      busqueda: [''],
      tipoUsuario: [0],
      estado: ['1'],
      reportesActivos: ['']
    });
  }

  // Entrada: Ninguna
  // Salida: control del formulario que pertenece al form group de tipo AbstractControl.
  // Descripción: Método para tener acceso a los controles del formulario
  // y poder mandar y obtener información de los inputs.
  get campoBusqueda(): AbstractControl{
    return this.form.get('busqueda');
  }
  get campoTipoUsuario(): AbstractControl{
    return this.form.get('tipoUsuario');
  }
  get campoEstado(): AbstractControl{
    return this.form.get('estado');
  }
  get campoReportesActivos(): AbstractControl{
    return this.form.get('reportesActivos');
  }

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción: Método para inicializar la tabla de registros de usuarios.
  // Determina los títulos de los headers y carga los registros en la tabla.
  inicializarTabla(): void{
    this.headersTabla = ['Clave', 'Tipo usuario', 'Nombre', 'Procesos'];
    this.actualizarTabla();
  }

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción: Método para obtener los registros de usuarios ya sea con
  // determinadas condiciones o en general, para ser mostrados en la tabla.
  actualizarTabla(): void{
    const textoB = this.campoBusqueda.value;
    const estado = this.campoEstado.value;
    const tipoU = (this.campoTipoUsuario.value).toString();
    const conReportes = this.campoReportesActivos.value;
    this.usuarioService.obtenerListaUsuarios(textoB, estado, tipoU, conReportes)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe( datos => {
        this.usuarios = datos;
        this.usuariosListos = true;
    }, (error: HttpErrorResponse) => {
      alert('Se generó un problema al cargar datos de esta sección. Recargue la página ó solicite asistencia.');
      console.log('Error al cargar datos de tabla usuarios: ' +  error.message);
    });
  }

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción: Método para obtener los registros de tipos de usuario para ser
  // cargados en una lista para ser mostrados en un select.
  obtenerTiposUsuario(): void{
    this.tipoService.filtroTiposUsuario()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe( tipos => {
      this.tiposUsuario = tipos;
      this.tiposListos = true;
    }, (error: HttpErrorResponse) => {
      alert('Se generó un problema al cargar datos de esta sección. Recargue la página ó solicite asistencia..');
      console.log('Se generó un error al cargar los tipos de usuario. Error:' + error.message);
    });
  }

  // Entrada: Ninguna
  // Salida: control del formulario que pertenece al form group de tipo AbstractControl.
  // Descripción: Método para tener acceso a los controles del formulario
  // y poder mandar y obtener información de los inputs.
  tamanoColumna( encabezado: string): any{
    return {
      'id-col': encabezado === 'ID',
      'botones-procesos-col': encabezado === 'Procesos',
      'general-col': encabezado
    };
  }

  // Entrada: valor string con la acción a realizar (nuevo, ver, editar)
  //          y valor con la información del usuario (opcional).
  // Salida: vacío.
  // Descripción: Método donde se encuentran las acciones correspondientes a la inicialización del dialog
  // y acciones posteriores al cierre del dialog.
  abrirDialogVerEditarNuevo(accion: string, usuario?: object): void{
    const DIALOG_REF = this.dialog.open(DialogVerEditarNuevoUsuarioComponent, {
      width: '900px',
      height: '600px',
      autoFocus: false,
      disableClose: true,
      data: {accion, usuario}
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

  // Entrada: ninguna.
  // Salida: vacío.
  // Descripción: Método que se llama cuando se da click al botón nuevo
  // Abre el dialogo con las configuraciones para crear un nuevo registro
  nuevoUsuario(): void{
    if (this.tienePermiso(7)){
      this.abrirDialogVerEditarNuevo('nuevo');
    }else{
      alert('No tiene permiso para ejecutar este proceso.');
    }
  }

  // Entrada: ninguna.
  // Salida: vacío.
  // Descripción:  Método para editar un usuario de la tabla. Abre el dialog con la acción "editar"
  editarUsuario(usuario: object): void{
    if (this.tienePermiso(9)){
      this.abrirDialogVerEditarNuevo('editar', usuario);
    }else{
      alert('No tiene permiso para ejecutar este proceso.');
    }
  }

  // Entrada: ninguna.
  // Salida: vacío.
  // Descripción:  Método para ver la información de un usuario de la tabla.
  // Abre el dialog con la acción "ver"
  verUsuario(usuario: object): void{
    if (this.tienePermiso(8)){
      this.abrirDialogVerEditarNuevo('ver', usuario);
    }else{
      alert('No tiene permiso para ejecutar este proceso.');
    }
  }

  // Entrada: ninguna.
  // Salida: vacío.
  // Descripción: Método que se llama, al hacer click en botón "eliminar" en la tabla.
  // Emite un mensaje de confirmación al usuario
  // Al ser respuesta "true" continúa la eliminación, y "false" no lo elimina
 eliminarUsuario(usuario: any): void{
  if (this.tienePermiso(10)){
    const result = confirm('¿Seguro que desea eliminar el usuario?');
    if (result) {
      this.usuarioService.eliminarUsuario(usuario)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        alert(res);
        this.actualizarTabla();
      }, (error: HttpErrorResponse) => {
        alert('No se ha podido eliminar el usuario. Vuelva a intentarlo ó solicite asistencia.');
        console.log('Error al eliminar usuario. Mensaje error: ', error.message);
      });
    }
  }else{
    alert('No tiene permiso para ejecutar este proceso.');
  }

}

  // Entrada: ninguna.
  // Salida: vacío.
  // Descripción: Método que se llama con el botón buscar.
  // Aquí se llama al método actualizarTabla donde se ejecutará una búsqueda,
  // de usuarios de acuerdo a los filtros de los inputs.
  buscar(): void{
    this.actualizarTabla();
  }

  // Entrada: ninguna.
  // Salida: vacío.
  // Descripción: Método que se llama con el botón limpiar búsqueda.
  // limpia los parámetros de búsqueda para que se vuelva a mostrar la información general.
  limpiarBusqueda(): void{
   this.campoBusqueda.setValue('');
   this.campoTipoUsuario.setValue(0);
   this.campoEstado.setValue('1');
   this.campoReportesActivos.setValue(false);
   this.actualizarTabla();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

}
