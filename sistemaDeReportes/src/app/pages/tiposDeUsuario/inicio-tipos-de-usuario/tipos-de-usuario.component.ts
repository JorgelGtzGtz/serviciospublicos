import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogVerEditarNuevoComponent } from '../dialog-ver-editar-nuevo/dialog-ver-editar-nuevo.component';
import { FormControl} from '@angular/forms';

interface TipoUsuario{
  id: number;
  tipoUsuario: string;
}

@Component({
  selector: 'app-tipos-de-usuario',
  templateUrl: './tipos-de-usuario.component.html',
  styleUrls: ['./tipos-de-usuario.component.css']
})
export class TiposDeUsuarioComponent implements OnInit {
  nombreSeccion = 'Tipos de Usuario';
  busquedaForm: FormControl;
  estadoForm: FormControl;
  datosTipoUsuario: any;
  datos: TipoUsuario[] = [
    {id: 0, tipoUsuario: 'prueba'},
    {id: 0, tipoUsuario: 'prueba'},
    {id: 0, tipoUsuario: 'prueba'},
    {id: 0, tipoUsuario: 'prueba'},
    {id: 0, tipoUsuario: 'prueba'},
    {id: 0, tipoUsuario: 'prueba'},
    {id: 0, tipoUsuario: 'prueba'},
    {id: 0, tipoUsuario: 'prueba'},
    {id: 0, tipoUsuario: 'prueba'},
  ];


  constructor(public dialog: MatDialog) {
    this.buildForm();
   }

  ngOnInit(): void {
    let dataArray = [];
    this.datos.forEach(element => {
      dataArray.push(Object.values(element));
    });
    this.datosTipoUsuario = {pagina: 'tiposDeUsuario', headers: ['ID', 'Tipo', 'Procesos'], data: dataArray};
  }

  // Inicializa el formulario reactivo, aquí es donde se crean los controladores de los inputs
  private buildForm(){
    this.busquedaForm = new FormControl('');
    this.estadoForm = new FormControl('');
    this.busquedaForm.valueChanges.subscribe(value => {
      console.log('se interactuo busqueda:', value);
    });
    this.estadoForm.valueChanges.subscribe(value => {
      console.log('se interactuo estado:', value);
    });
  }

  // Métodos get para obtener acceso a los campos del formulario
 get campoBusqueda(){
  return this.busquedaForm;
}
get campoEstado(){
  return this.estadoForm;
}

  // Método que abre el dialog. Recibe la acción (ver, nuevo, editar o seleccionar, según la sección),
  // además recibe el dato de tipo Reporte, con la información que se muestra en el formulario
  // También contiene el método que se ejecuta cuando el diálogo se cierra.
  openDialogVerEditarNuevo(accion: string): void{
    const DIALOG_REF = this.dialog.open(DialogVerEditarNuevoComponent, {
      width: '900px',
      height: '600px',
      disableClose: true,
      closeOnNavigation: false,
      data: {accion}
    });
  }

  // Método que se llama al hacer click en botón nuevo. Este llama al método
  // " openDialogVerEditarNuevo" y le envía un parámetro
  // para indicar al dialog el tipo de actividad que se realizará
  nuevoTipoUsuario(): void{
    console.log('Nuevo');
    this.openDialogVerEditarNuevo('nuevo');
  }

// Método para eliminar un tipo de usuario. Lanza un mensaje de confirmación 
  eliminarTipoUsuario(): void{
    let result = confirm('¿Seguro que desea eliminar el tipo de usuario?');
    if (result) {
      console.log('Se elimina');
      alert('El tipo de usuario se ha eliminado.');
    }else{
      console.log('no se elimina');
    }
  }

    // Método que se recibe de la tabla, el tipo de acción que se hará en el formulario del dialog
  recibirAccion(event: string): void {
    if (event === 'ver' || event === 'editar'){
      this.openDialogVerEditarNuevo(event);
    }else{
      this.eliminarTipoUsuario();
    }
  }

    // Método para buscar en la base de datos los registros que coincidan con los
  // valores que se establescan en los campos
  buscar(): void{
    console.log('Se dio click en buscar tipos de usuario', this.busquedaForm.value, this.estadoForm.value);
  }

}
