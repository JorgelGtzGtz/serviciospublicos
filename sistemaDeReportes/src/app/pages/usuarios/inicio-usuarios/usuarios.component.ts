import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogVerEditarNuevoUsuarioComponent } from '../dialog-ver-editar-nuevo-usuario/dialog-ver-editar-nuevo-usuario.component';
import { FormGroup, FormBuilder} from '@angular/forms';
import { Usuario } from '../../../Interfaces/IUsuario';



@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  form: FormGroup;
  nombreSeccion = 'Usuarios';
  headersTabla: string [];
  datosTabla: object [];
  datos: Usuario[] = [
    {ID_usuario: 0,
      Nombre_usuario: 'UsuarioPrueba',
      Correo_usuario: 'prueba123@gmail.com',
      Telefono_usuario: '6441598423',
      Genero_usuario: 'F',
      ID_tipoUsuario: 1,
      Login_usuario: 'uTest',
      Password_usuario: '1234',
      Estatus_usuario: true,
      Jefe_asignado: false
    },
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
      busqueda: [''],
      tipoUsuario: [''],
      estado: [''],
      reportesActivos: ['']
    });
    this.form.valueChanges.subscribe(value => {
      console.log('se interactuo:', value);
    });
  }

  inicializarTabla(){
    this.datosTabla = [];
    this.datos.forEach(element => {
      this.datosTabla.push(Object.values(element));
    });
    this.headersTabla = ['ID', 'Tipo usuario', 'Nombre', 'Procesos'];
    console.log('datos tabla:', this.datosTabla);
    console.log('datos:', this.datos);
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
  abrirDialogVerEditarNuevo(accion: string): void{
    const DIALOG_REF = this.dialog.open(DialogVerEditarNuevoUsuarioComponent, {
      width: '900px',
      height: '600px',
      disableClose: true,
      data: {accion}
    });
  }

  // Metodo que se llama cuando se da click al botón nuevo
// Abre el dialogo con las configuraciones para crear un nuevo registro
  nuevoUsuario(): void{
    this.abrirDialogVerEditarNuevo('nuevo');
  }

  // Método para editar un usuario de la tabla
  editarUsuario(registro: object){
    this.abrirDialogVerEditarNuevo('editar');
  }

  // Método para ver un usuario de la tabla
  verUsuario(registro: object){
    this.abrirDialogVerEditarNuevo('ver');
  }

  // Método que se llama, al recibir de la tabla la acción de eliminar, al haber 
  // hecho click en el botón eliminar. Emite un mensaje de confirmación al usuario
  // Al ser respuesta "true" continúa la eliminación, y "false" no lo elimina
 eliminarUsuario(registro: object): void{
  let result = confirm('¿Seguro que desea eliminar el usuario?');
  if (result) {
    console.log('Se elimina');
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
    console.log('Click en buscar', this.form.value);
  }


}
