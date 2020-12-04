import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogVerEditarNuevoComponent } from '../dialog-ver-editar-nuevo/dialog-ver-editar-nuevo.component';
import { FormControl} from '@angular/forms';
import { TipoUsuarioService } from '../../../services/tipo-usuario.service';
import { TipoUsuario } from '../../../Interfaces/ITipoUsuario';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-tipos-de-usuario',
  templateUrl: './tipos-de-usuario.component.html',
  styleUrls: ['./tipos-de-usuario.component.css']
})
export class TiposDeUsuarioComponent implements OnInit {
  nombreSeccion = 'Tipos de Usuario';
  busquedaForm: FormControl;
  estadoForm: FormControl;
  headersTabla: string [];
  tiposUsuario: TipoUsuario[] = [];
  datos: boolean = false;


  constructor(public dialog: MatDialog,
              private tipoService: TipoUsuarioService) {
    this.buildForm();
   }

  ngOnInit(): void {
    this.actualizarTabla();
    this.inicializarTabla();
  }

  // Inicializa el formulario reactivo, aquí es donde se crean los controladores de los inputs
  private buildForm(){
    this.busquedaForm = new FormControl('');
    this.estadoForm = new FormControl('Todos');
    this.busquedaForm.valueChanges.subscribe(value => {
      console.log('se interactuo busqueda:', value);
    });
    this.estadoForm.valueChanges.subscribe(value => {
      console.log('se interactuo estado:', value);
    });
  }

  // Método para inicializar la estructura de la tabla
  inicializarTabla(){
    this.headersTabla = ['Clave', 'Tipo de usuario', 'Procesos'];
  }

  // Metodo para actualizar los datos de la tabla
  actualizarTabla(){
    this.tipoService.obtenerListaTipoU(this.campoBusqueda.value, this.campoEstado.value).subscribe( tipos => {
      this.tiposUsuario = tipos;
      console.log( this.tiposUsuario);
      this.datos = true;
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
  openDialogVerEditarNuevo(accion: string, tipoU?: TipoUsuario): void{
    const DIALOG_REF = this.dialog.open(DialogVerEditarNuevoComponent, {
      width: '900px',
      height: '600px',
      disableClose: true,
      closeOnNavigation: false,
      data: {accion, tipoU}
    });

    DIALOG_REF.afterClosed().subscribe(result => {
      this.actualizarTabla();
  });
  }

  // Método que se llama al hacer click en botón nuevo. Este llama al método
  // " openDialogVerEditarNuevo" y le envía un parámetro
  // para indicar al dialog el tipo de actividad que se realizará
  nuevoTipoUsuario(): void{
    this.openDialogVerEditarNuevo('nuevo');
  }

  // Método para editar un tipo de usuario de la tabla
  editarTipoUsuario(tipoU: TipoUsuario){
    this.openDialogVerEditarNuevo('editar', tipoU);
  }

  // Método para ver un tipo de usuario de la tabla
  verTipoUsuario(tipoU: TipoUsuario){
    console.log('Tipo Usuario:', tipoU);
    this.openDialogVerEditarNuevo('ver', tipoU);
  }

// Método para eliminar un tipo de usuario. Lanza un mensaje de confirmación 
  eliminarTipoUsuario(tipoU: TipoUsuario): void{
    let result = confirm('¿Seguro que desea eliminar el tipo de usuario?');
    if (result) {
      console.log('A eliminar', tipoU);
      this.tipoService.eliminarTipoUsuario(tipoU.ID_tipoUsuario).subscribe( res => {
        console.log('El usuario se eliminó');
      }, (error: HttpErrorResponse) => {
        console.log('Se generó errror: ' + error.message);
      });
      this.actualizarTabla();
      alert('El tipo de usuario se ha eliminado.');
    }else{
      console.log('no se elimina');
    }
  }

    // Método para buscar en la base de datos los registros que coincidan con los
  // valores que se establescan en los campos
  buscar(): void{
    this.tipoService.obtenerListaTipoU(this.campoBusqueda.value, this.campoEstado.value).subscribe( tipos => {
      this.tiposUsuario = tipos;
    }, (error: HttpErrorResponse) => {
      alert('Error al hacer búsqueda:' + error.message);
    });
  }

}
