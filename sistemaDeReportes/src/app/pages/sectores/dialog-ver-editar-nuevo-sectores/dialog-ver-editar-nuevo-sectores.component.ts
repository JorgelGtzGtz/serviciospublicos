import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { DialogService } from '../../../services/dialog-service.service';
import { SectorService } from '../../../services/sector.service';
import { Sector } from '../../../Interfaces/ISector';
import { SectorM } from 'src/app/Models/SectorM';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-dialog-ver-editar-nuevo-sectores',
  templateUrl: './dialog-ver-editar-nuevo-sectores.component.html',
  styleUrls: ['./dialog-ver-editar-nuevo-sectores.component.css']
})
export class DialogVerEditarNuevoSectoresComponent implements OnInit {
accion: string;
form: FormGroup;
modificado: boolean;
idListo: boolean;
datosCargados: boolean;
sector: Sector;

  constructor(public dialogRef: MatDialogRef<DialogVerEditarNuevoSectoresComponent>,
              @Inject (MAT_DIALOG_DATA) private data,
              private dialogService: DialogService,
              private formBuilder: FormBuilder,
              private sectorService: SectorService) {
      dialogRef.disableClose = true;
      this.buildForm();
   }

  ngOnInit(): void {
    this.accion = this.data.accion;
    this.tipoFormularioAccion();
    this.iniciarFormulario();
  }


  // Inicializa el formulario reactivo, aquí es donde se crean los controladores de los inputs
  // con sus respectivas validaciones de campos.
  private buildForm(): void{
    this.form = this.formBuilder.group({
      id: [''],
      estado: [''],
      nombreS: ['', [Validators.required]]
    });
    this.form.valueChanges.subscribe(value => {
      if (this.form.touched){
        console.log('se interactuo');
        this.modificado = true;
      }else{
        this.modificado = false;
      }
    });
  }

  // Se inicializan los valores de los campos del formulario
  // dependiendo del tipo de actividad a realizar.
  iniciarFormulario(): void{
    if (this.accion !== 'nuevo'){
        this.sector = this.data.sector;
        this.campoId.setValue( this.sector.ID_sector);
        this.campoNombreSector.setValue(this.sector.Descripcion_sector);
        this.campoEstado.setValue(!this.sector.Estatus_sector);
        this.datosCargados = true;
    }else{
      this.obtenerIDNuevo();
      this.campoEstado.setValue(false);
    }
  }

   // Función para obtener el ID del nuevo registro
   obtenerIDNuevo(): void{
    this.sectorService.obtenerIDRegistro().subscribe( (id: number) => {
      this.campoId.setValue(id);
      this.idListo = true;
    });
  }

  get campoId(): AbstractControl{
    return this.form.get('id');
  }
  get campoEstado(): AbstractControl{
    return this.form.get('estado');
  }
  get campoNombreSector(): AbstractControl{
    return this.form.get('nombreS');
  }

// Devuelve true si el usuario interactuó con el formulario o false si no.
  obtenerEstadoFormulario(): boolean{
    return this.modificado;
  }

// Este método habilita o deshabilita el formulario según lo que se quiera hacer en el
//  En "ver" todos los campos aparecen deshabilitados y en "nuevo" el único deshabilitado
//  es "activar"
tipoFormularioAccion(): void{
  switch (this.accion){
    case 'ver':
      this.form.disable();
      break;
    case 'nuevo':
      this.campoEstado.disable();
      this.campoId.disable();
      break;
    default:
      this.form.enable();
      this.campoId.disable();
  }
}

// Método que se llama cuando se le da click en guardar en el formulario.
guardar(): void {
  // event.preventDefault();
  if (this.form.valid){
    this.accionGuardar();
    this.dialogRef.close(this.data);
  } else{
    this.form.markAllAsTouched();
  }
}

// Acciones a ejecutar para el boton guardar dependiendo
//  del tipo de proceso que se hizo en el dialog
accionGuardar(): void{
  const sector = this.generarSector();
  if (this.accion !== 'nuevo'){
   this.sectorService.actualizarSector(sector).subscribe( res => {
    alert ('¡Sector ' + sector.Descripcion_sector + ' actualizado con éxito!');
    }, (error: HttpErrorResponse) => {
      alert('¡Sector ' + sector.Descripcion_sector + ' no pudo ser actualizado! Error: ' + error.message);
    });
  } else{
    this.sectorService.insertarSector(sector).subscribe( res => {
      alert ('¡Sector ' + sector.Descripcion_sector + ' registrado con éxito!');
    }, (error: HttpErrorResponse) => {
      alert ('¡Sector ' + sector.Descripcion_sector + ' no pudo ser guardado! Error: ' + error.message);
    });
  }
}

// Se crea nuevo sector en nuevos registros
generarSector(): SectorM{
  return new SectorM(
    this.campoId.value,
    this.campoNombreSector.value,
    !this.campoEstado.value
  );
}

// Método que a través del método "verificarCambios" del servicio de DialogService
// verifica si el usuario interactuó con el formulario.
// Si la interacción sucedió se despliega un mensaje de confirmación.
cerrarDialog(): void{
  this.dialogService.verificarCambios(this.dialogRef);
}

}
