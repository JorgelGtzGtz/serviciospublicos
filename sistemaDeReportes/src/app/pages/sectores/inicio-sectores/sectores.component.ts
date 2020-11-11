import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogVerEditarNuevoSectoresComponent } from '../dialog-ver-editar-nuevo-sectores/dialog-ver-editar-nuevo-sectores.component';
import { FormControl } from '@angular/forms';

interface Sector{
  id: number;
  nombre: string;
}

@Component({
  selector: 'app-sectores',
  templateUrl: './sectores.component.html',
  styleUrls: ['./sectores.component.css']
})
export class SectoresComponent implements OnInit {
  busquedaForm: FormControl;
  estadoForm: FormControl;
  nombreSeccion = 'Sectores';
  datosSectores: any;
  datos: Sector[] = [
    {id: 0, nombre: 'sector 1'},
    {id: 0, nombre: 'sector 2'},
    {id: 0, nombre: 'sector 3'},
    {id: 0, nombre: 'sector 4'},
    {id: 0, nombre: 'sector 5'},
    {id: 0, nombre: 'sector 6'},
    {id: 0, nombre: 'sector 6'},
    {id: 0, nombre: 'sector 6'},
    {id: 0, nombre: 'sector 6'},
    {id: 0, nombre: 'sector 6'},
    {id: 0, nombre: 'sector 7'}
  ];

  constructor(public dialog: MatDialog) {
    this.formBuilder();
   }

  ngOnInit(): void {
    let datosArray = [];
    this.datos.forEach(element => {
      datosArray.push(Object.values(element));
    });
    this.datosSectores = {pagina: 'sectores', headers: [ 'ID', 'Nombre del sector', 'Procesos'], data: datosArray};
  }

    // Inicializa los controladores del formulario
    formBuilder(){
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
  abrirDialogVerEditarNuevo(accion: string): void{
    const DIALOG_REF = this.dialog.open(DialogVerEditarNuevoSectoresComponent, {
      width: '900px',
      height: '400px',
      disableClose: true,
      data: {accion}
    });
  }

    // Método que se llama al hacer click en botón nuevo. Este llama al método 
  // "abrirDialogVerEditarNuevo" y le manda una acción o referencia de lo que
  //  se espera hacer en el formulario
  nuevoSector(): void{
    console.log('Nuevo');
    this.abrirDialogVerEditarNuevo('nuevo');
  }

  // Método para eliminar sector. Lanza un mensaje de confirmación, que según
  // la respuesta, continúa o no con la eliminación
  eliminarSector(): void{
    let result = confirm('Seguro que desea eliminar el sector?');
    if (result) {
      console.log('Se elimina');
    }else{
      console.log('no se elimina');
    }
  }

  // Método que recibe de la tabla, el tipo de acción que se hará en el formulario del dialog
  recibirAccion(event: string): void {
    if (event === 'ver' || event === 'editar'){
      this.abrirDialogVerEditarNuevo(event);
    }else{
      this.eliminarSector();
    }
  }

    // Método para buscar en la base de datos los registros que coincidan con los
  // valores que se establescan en los campos
  buscar(): void{
    console.log('Click en buscar desde sectores', this.busquedaForm.value, this.estadoForm.value);
  }

}
