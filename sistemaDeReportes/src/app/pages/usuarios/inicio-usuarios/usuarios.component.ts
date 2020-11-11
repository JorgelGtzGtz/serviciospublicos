import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogVerEditarNuevoUsuarioComponent } from '../dialog-ver-editar-nuevo-usuario/dialog-ver-editar-nuevo-usuario.component';
import { FormGroup, FormBuilder} from '@angular/forms';

interface Usuario{
  id: number;
  tipoUsuario: string;
  nombre: string;
}

@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.component.html',
  styleUrls: ['./usuarios.component.css']
})
export class UsuariosComponent implements OnInit {
  form: FormGroup;
  nombreSeccion = 'Usuarios';
  datosUsuario: any;
  datos: Usuario[] = [
    {id: 0, tipoUsuario: 'prueba', nombre: 'Damaris'},
    {id: 0, tipoUsuario: 'prueba', nombre: 'Jason'},
    {id: 0, tipoUsuario: 'prueba', nombre: 'Elsia'},
    {id: 0, tipoUsuario: 'prueba', nombre: 'Diana'},
    {id: 0, tipoUsuario: 'prueba', nombre: 'Elena'},
    {id: 0, tipoUsuario: 'prueba', nombre: 'Alberto'},
    {id: 0, tipoUsuario: 'prueba', nombre: 'Jorge'},
    {id: 0, tipoUsuario: 'prueba', nombre: 'Ana'},
    {id: 0, tipoUsuario: 'prueba', nombre: 'Claudia'},
  ];

  constructor( public dialog: MatDialog, private formBuilder: FormBuilder) {
    this.buildForm();
   }

  ngOnInit(): void {
    let dataArr = [];
    this.datos.forEach(element => {
      dataArr.push(Object.values(element));
    });
    this.datosUsuario = {
      pagina: 'usuarios',
      headers: ['ID', 'Tipo usuario', 'Nombre', 'Procesos'],
      data: dataArr
    };
    console.log('dataArr: ', dataArr);
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

  // Método que se llama, al recibir de la tabla la acción de eliminar, al haber 
  // hecho click en el botón eliminar. Emite un mensaje de confirmación al usuario
  // Al ser respuesta "true" continúa la eliminación, y "false" no lo elimina
  eliminarUsuario(): void{
    let result = confirm('Seguro que desea eliminar el usuario?');
    if (result) {
      console.log('Se elimina');
    }else{
      console.log('no se elimina');
    }
  }

    // Acción que se recibe según el botón que se seleccionó en la tabla
  //  Se manda llamar al método que abre el dialog y se le manda esta acción
  recibirAccion(event: string): void {
    if (event === 'ver' || event === 'editar'){
      this.abrirDialogVerEditarNuevo(event);
    }else{
      this.eliminarUsuario();
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
