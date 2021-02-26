import { Component, OnInit, OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DialogVerEditarNuevoSectoresComponent } from '../dialog-ver-editar-nuevo-sectores/dialog-ver-editar-nuevo-sectores.component';
import { AbstractControl, FormControl } from '@angular/forms';
import { SectorService } from '../../../services/sector.service';
import { Sector } from '../../../Interfaces/ISector';
import { HttpErrorResponse } from '@angular/common/http';
import { PermisoService } from '../../../services/permiso.service';

@Component({
  selector: 'app-sectores',
  templateUrl: './sectores.component.html',
  styleUrls: ['./sectores.component.css']
})
export class SectoresComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  busquedaForm: FormControl;
  estadoForm: FormControl;
  nombreSeccion = 'Sectores';
  headersTabla: string [];
  sectores: Sector[] = [];
  sectoresListos: boolean;

  constructor(public dialog: MatDialog,
              private sectorService: SectorService,
              private permisoService: PermisoService) {
    this.formBuilder();
   }

  ngOnInit(): void {
    this.inicializarTabla();
  }

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción: Inicializa los controladores del formulario
  formBuilder(): void{
      this.busquedaForm = new FormControl('');
      this.estadoForm = new FormControl('1');
    }

  // Entrada: Ninguna
  // Salida: control de tipo AbstractControl.
  // Descripción: Métodos get para obtener acceso a los campos del formulario
   get campoBusqueda(): AbstractControl{
    return this.busquedaForm;
  }
  get campoEstado(): AbstractControl{
    return this.estadoForm;
  }

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción: Método para inicializar la vista y datos de la tabla.
  inicializarTabla(): void{
    this.headersTabla = ['Clave', 'Nombre del sector', 'Procesos'];
    this.actualizarTabla();
  }

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción: Método para obtener la lista de sectores
  // de acuerdo a determinados parámetros
  actualizarTabla(): void{
    this.sectorService.obtenerSectoresFiltro(this.campoBusqueda.value, this.campoEstado.value)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe( sectores => {
      this.sectores = sectores;
      this.sectoresListos = true;
    }, (error: HttpErrorResponse) => {
      alert('Se generó un problema al cargar datos de página. Recargue página o solicite asistencia.');
      console.log('Error al cargar datos de tabla sectores: ' +  error.message);
    });
  }


  // Entrada: valor de tipo string con el nombre del encabezado.
  // Salida: objeto con clase CSS
  // Descripción: método para agregar estilo a los encabezados de la tabla
  // mediante clases de CSS.
  tamanoColumna( encabezado: string): any{
    return {
      'id-col': encabezado === 'ID',
      'botones-procesos-col': encabezado === 'Procesos',
      'general-col': encabezado
    };
  }

  // Entrada: valor de tipo string con la acción a ejecutar, y sector de tipo Sector sobre
  //          el cual se ejecutarán cambios o acciones.
  // Salida: vacío.
  // Descripción: Método que abre el dialog. Recibe la acción (ver, nuevo, editar o seleccionar, según la sección),
  // además recibe el dato de tipo Reporte, con la información que se muestra en el formulario
  // También contiene el método que se ejecuta cuando el diálogo se cierra.
  abrirDialogVerEditarNuevo(accion: string, sector?: Sector): void{
    const DIALOG_REF = this.dialog.open(DialogVerEditarNuevoSectoresComponent, {
      width: '900px',
      height: '400px',
      autoFocus: false,
      disableClose: true,
      data: {accion, sector}
    });

    DIALOG_REF.afterClosed()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe( result => {
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
  nuevoSector(): void{
    if (this.tienePermiso(16)){
      this.abrirDialogVerEditarNuevo('nuevo');
    }else{
      alert('No tiene permiso para ejecutar este proceso.');
    }
  }

  // Entrada: objeto de tipo Sector
  // Salida: vacío.
  // Descripción: Método para editar un sector de la tabla
  editarSector(sector: Sector): void{
    if (this.tienePermiso(18)){
      this.abrirDialogVerEditarNuevo('editar', sector);
    }else{
      alert('No tiene permiso para ejecutar este proceso.');
    }
  }

  // Entrada: objeto de tipo Sector
  // Salida: vacío.
  // Descripción: Método para ver un sector de la tabla
  verSector(sector: Sector): void{
    if (this.tienePermiso(17)){
      this.abrirDialogVerEditarNuevo('ver', sector);
    }else{
      alert('No tiene permiso para ejecutar este proceso.');
    }
  }

  // Entrada: objeto de tipo Sector
  // Salida: vacío.
  // Descripción: Método para eliminar sector. Lanza un mensaje de confirmación, que según
  // la respuesta, continúa o no con la eliminación
  eliminarSector(sector: Sector): void{
    if (this.tienePermiso(19)){
      const result = confirm('¿Seguro que desea eliminar el sector?');
      if (result) {
        this.sectorService.eliminarSector(sector)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe( res => {
          this.actualizarTabla();
          alert(res);
        }, (error: HttpErrorResponse) => {
          alert('El sector ' + sector.Descripcion_sector + ' no pudo ser eliminado. Intente de nuevo o solicite asistencia.');
          console.log('Error al eliminar sector: ' + error.message);
        });
      }
    }else{
      alert('No tiene permiso para ejecutar este proceso.');
    }

  }

  // Entrada: Ninguna.
  // Salida: vacío.
  // Descripción: Método para buscar en la base de datos los registros que coincidan con los
  // valores que se establescan en los campos
  buscar(): void{
    this.actualizarTabla();
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
