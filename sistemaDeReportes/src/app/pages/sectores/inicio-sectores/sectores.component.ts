import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogVerEditarNuevoSectoresComponent } from '../dialog-ver-editar-nuevo-sectores/dialog-ver-editar-nuevo-sectores.component';
import { FormControl } from '@angular/forms';
import { SectorService } from '../../../services/sector.service';
import { Sector } from '../../../Interfaces/ISector';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-sectores',
  templateUrl: './sectores.component.html',
  styleUrls: ['./sectores.component.css']
})
export class SectoresComponent implements OnInit {
  busquedaForm: FormControl;
  estadoForm: FormControl;
  nombreSeccion = 'Sectores';
  headersTabla: string [];
  sectores: Sector[] = [];

  constructor(public dialog: MatDialog, private sectorService: SectorService) {
    this.formBuilder();
    this.obtenerListaSect();
   }

  ngOnInit(): void {
   this.inicializarTabla();
  }

    // Inicializa los controladores del formulario
    formBuilder(){
      this.busquedaForm = new FormControl('');
      this.estadoForm = new FormControl('Todos');
      this.busquedaForm.valueChanges.subscribe(value => {
        console.log('se interactuo busqueda:', value);
      });
      this.estadoForm.valueChanges.subscribe(value => {
        console.log('se interactuo estado:', value);
      });
    }

  // Método para inicializar las variables que contienen los datos que se
  //  mostrarán en la tabla
  inicializarTabla(){
    this.headersTabla = ['Clave', 'Nombre del sector', 'Procesos'];
  }

  obtenerListaSect(){
    this.sectorService.obtenerSectores().subscribe( sectores => {
      this.sectores = sectores;
      console.log(this.sectores);
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
  abrirDialogVerEditarNuevo(accion: string, sector?: Sector): void{
    const DIALOG_REF = this.dialog.open(DialogVerEditarNuevoSectoresComponent, {
      width: '900px',
      height: '400px',
      disableClose: true,
      data: {accion, sector}
    });
  }

    // Método que se llama al hacer click en botón nuevo. Este llama al método 
  // "abrirDialogVerEditarNuevo" y le manda una acción o referencia de lo que
  //  se espera hacer en el formulario
  nuevoSector(): void{
    console.log('Nuevo');
    this.abrirDialogVerEditarNuevo('nuevo');
  }

  // Método para editar un sector de la tabla
  editarSector(sector: Sector){
    this.abrirDialogVerEditarNuevo('editar', sector);
  }

  // Método para ver un sector de la tabla
  verSector(sector: Sector){
    this.abrirDialogVerEditarNuevo('ver', sector);
  }

  // Método para eliminar sector. Lanza un mensaje de confirmación, que según
  // la respuesta, continúa o no con la eliminación
  eliminarSector(sector: Sector): void{
    let result = confirm('¿Seguro que desea eliminar el sector?');
    if (result) {
      this.sectorService.eliminarSector(sector.ID_sector).subscribe( res => {
        this.obtenerListaSect();
        alert('El sector' + sector.Descripcion_sector + ' se ha eliminado.');
      }, (error: HttpErrorResponse) => {
        alert('El sector ' + sector.Descripcion_sector + ' no pudo ser eliminado. Error: ' + error.message);
      });
    }else{
      console.log('no se elimina');
    }
  }

    // Método para buscar en la base de datos los registros que coincidan con los
  // valores que se establescan en los campos
  buscar(): void{
    console.log('Click en buscar desde sectores', this.busquedaForm.value, this.estadoForm.value);
  }

}
