import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogVerEditarNuevoUsuarioComponent } from '../dialog-ver-editar-nuevo-usuario/dialog-ver-editar-nuevo-usuario.component';
import { FormGroup, FormBuilder} from '@angular/forms';
import { UsuarioService } from '../../../services/usuario.service';
import { TipoUsuarioService } from '../../../services/tipo-usuario.service';



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

  constructor( public dialog: MatDialog, private formBuilder: FormBuilder,
               private usuarioService: UsuarioService,
               private tipoService: TipoUsuarioService) {
    this.buildForm();
   }

  ngOnInit(): void {
    this.actualizarTabla();
    this.tipoService.obtenerListaTipoU().subscribe( tipos => {
        this.tiposUsuario = tipos;
      });
    this.inicializarTabla();
    
  }

   // Inicializa el formulario reactivo, aquí es donde se crean los controladores de los inputs
   private buildForm(){
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

  inicializarTabla(){
    this.headersTabla = ['Clave', 'Tipo usuario', 'Nombre', 'Procesos'];
  }

  actualizarTabla(parametro?: string){
    this.usuarioService.obtenerListaUsuarios(parametro).subscribe( datos => {
      this.usuarios = datos;
    });
  }


  // Métodos get para obtener acceso a los campos del formulario
  get campoBusqueda(){
    return this.form.get('busqueda');
  }
  get campoTipoUsuario(){
    return this.form.get('tipoUsuario');
  }
  get campoEstado(){
    return this.form.get('estado');
  }
  get campoReportesActivos(){
    return this.form.get('reportesActivos');
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
  abrirDialogVerEditarNuevo(accion: string, usuario?: any): void{
    const DIALOG_REF = this.dialog.open(DialogVerEditarNuevoUsuarioComponent, {
      width: '900px',
      height: '600px',
      disableClose: true,
      data: {accion, usuario}
    });

    DIALOG_REF.afterClosed().subscribe(result => {
        this.actualizarTabla();
    });
  }

  // Metodo que se llama cuando se da click al botón nuevo
// Abre el dialogo con las configuraciones para crear un nuevo registro
  nuevoUsuario(): void{
    this.abrirDialogVerEditarNuevo('nuevo');
  }

  // Método para editar un usuario de la tabla
  editarUsuario(usuario: any){
    this.abrirDialogVerEditarNuevo('editar', usuario);
  }

  // Método para ver un usuario de la tabla
  verUsuario(usuario: any){
    this.abrirDialogVerEditarNuevo('ver', usuario);
  }

  // Método que se llama, al recibir de la tabla la acción de eliminar, al haber 
  // hecho click en el botón eliminar. Emite un mensaje de confirmación al usuario
  // Al ser respuesta "true" continúa la eliminación, y "false" no lo elimina
 eliminarUsuario(usuario: any): void{
  let result = confirm('¿Seguro que desea eliminar el usuario?');
  if (result) {
    this.usuarioService.eliminarUsuario(usuario.ID_usuario).subscribe(res => {
      console.log('eliminar Usuario', res);
    });
    this.actualizarTabla();
    alert('El usuario se ha eliminado.');
  }else{
    console.log('no se elimina');
  }
}

    // Método que se llama con el botón buscar 
  // Aquí se recuperan los criterios de búsqueda establecidos por 
  // el usuario para después utilizarlos en una búsqueda 
  // en la base de datos. 
  buscar(): void{
    this.actualizarTabla(this.campoBusqueda.value);
    console.log('Click en buscar', this.form.value);
  }


}
