import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogVerEditarNuevoUsuarioComponent } from '../dialog-ver-editar-nuevo-usuario/dialog-ver-editar-nuevo-usuario.component';
import { FormGroup, FormBuilder, AbstractControl } from '@angular/forms';
import { UsuarioService } from '../../../services/usuario.service';
import { TipoUsuarioService } from '../../../services/tipo-usuario.service';
import { HttpErrorResponse } from '@angular/common/http';



@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  form: FormGroup;
  nombreSeccion = 'Usuarios';
  headersTabla: string [];
  usuarios: any = [];
  tiposUsuario: any = [];
  tiposListos: boolean;
  usuariosListos: boolean;


  constructor( public dialog: MatDialog, private formBuilder: FormBuilder,
               private usuarioService: UsuarioService,
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
      tipoUsuario: ['Todos'],
      estado: ['Todos'],
      reportesActivos: ['']
    });
    this.form.valueChanges.subscribe(value => {
      console.log('se interactuo:', value);
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
    this.usuarioService.obtenerListaUsuarios(this.campoBusqueda.value,
      this.campoEstado.value, this.campoTipoUsuario.value, this.campoReportesActivos.value)
    .subscribe( datos => {
      this.usuarios = datos;
      console.log(datos);
      this.usuariosListos = true;
    }, (error: HttpErrorResponse) => {
      alert('Existió un problema al cargar datos de página. Recargue página o solicite asistencia.');
      console.log('Error al cargar datos de tabla usuarios: ' +  error.message);
    });
  }

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción: Método para obtener los registros de tipos de usuario para ser
  // cargados en una lista para ser mostrados en un select.
  obtenerTiposUsuario(): void{
    this.tipoService.obtenerListaTipoU().subscribe( tipos => {
      this.tiposUsuario = tipos;
      this.tiposListos = true;
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

    DIALOG_REF.afterClosed().subscribe(result => {
        this.actualizarTabla();
    });
  }

  // Entrada: ninguna.
  // Salida: vacío.
  // Descripción: Método que se llama cuando se da click al botón nuevo
  // Abre el dialogo con las configuraciones para crear un nuevo registro
  nuevoUsuario(): void{
    this.abrirDialogVerEditarNuevo('nuevo');
  }

  // Entrada: ninguna.
  // Salida: vacío.
  // Descripción:  Método para editar un usuario de la tabla. Abre el dialog con la acción "editar"
  editarUsuario(usuario: object): void{
    this.abrirDialogVerEditarNuevo('editar', usuario);
  }

  // Entrada: ninguna.
  // Salida: vacío.
  // Descripción:  Método para ver la información de un usuario de la tabla.
  // Abre el dialog con la acción "ver"
  verUsuario(usuario: object): void{
    this.abrirDialogVerEditarNuevo('ver', usuario);
  }

  // Entrada: ninguna.
  // Salida: vacío.
  // Descripción: Método que se llama, al hacer click en botón "eliminar" en la tabla.
  // Emite un mensaje de confirmación al usuario
  // Al ser respuesta "true" continúa la eliminación, y "false" no lo elimina
 eliminarUsuario(usuario: any): void{
  const result = confirm('¿Seguro que desea eliminar el usuario?');
  if (result) {
    this.usuarioService.eliminarUsuario(usuario).subscribe(res => {
      alert(res);
      this.actualizarTabla();
    }, (error: HttpErrorResponse) => {
      alert('No se ha podido eliminar el usuario. Error:' + error.message);
      console.log('Error al eliminar usuario. Mensaje error: ', error.message);
    });
  }else{
    console.log('no se elimina');
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
   this.campoTipoUsuario.setValue('Todos');
   this.campoEstado.setValue('Todos');
   this.campoReportesActivos.setValue(false);
   this.actualizarTabla();
  }


}
