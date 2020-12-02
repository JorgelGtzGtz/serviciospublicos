import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
  private buildForm(){
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
  iniciarFormulario(){
    if (this.accion !== 'nuevo'){
        this.sector = this.data.sector;
        this.campoId.setValue( this.sector.ID_sector);
        this.campoNombreSector.setValue(this.sector.Descripcion_sector);
        this.campoEstado.setValue(this.sector.Estatus_sector);
    }else{
      this.campoId.setValue(0);
      this.campoEstado.setValue(false);
    }
  }

  get campoId(){
    return this.form.get('id');
  }
  get campoEstado(){
    return this.form.get('estado');
  }
  get campoNombreSector(){
    return this.form.get('nombreS');
  }

// Devuelve true si el usuario interactuó con el formulario o false si no.
  obtenerEstadoFormulario(): boolean{
    return this.modificado;
  }

// Este método habilita o deshabilita el formulario según lo que se quiera hacer en el
//  ya sea ver información, crear nuevo registro o editar.
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
accionGuardar(){
  if (this.accion !== 'nuevo'){
   this.actualizarDatosSector();
   this.sectorService.actualizarSector(this.sector).subscribe( res => {
      alert ('¡Sector' + this.sector.Descripcion_sector + ' registrado con éxito!');
    }, (error: HttpErrorResponse) => {
      alert ('¡Sector' + this.sector.Descripcion_sector + ' no pudo ser guardado! Error: ' + error.message);
    });
  } else{
    let sector = this.generarSector();
    this.sectorService.insertarSector(sector).subscribe( res => {
      alert ('¡Sector' + sector.Descripcion_sector + ' actualizado con éxito!');
    }, (error: HttpErrorResponse) => {
      alert('¡Sector' + sector.Descripcion_sector + ' no pudo ser actualizado! Error: ' + error.message);
    });
  }
}

// Actualizar datos sector
actualizarDatosSector(){
  this.sector.Estatus_sector = this.campoEstado.value;
  this.sector.Descripcion_sector = this.campoNombreSector.value;
}

// Se crea nuevo sector en nuevos registros
generarSector(){
  return new SectorM(
    this.campoId.value,
    this.campoNombreSector.value,
    this.campoEstado.value
  );
}

// Método que a través del método "verificarCambios" del servicio de DialogService
// verifica si el usuario interactuó con el formulario.
// Si la interacción sucedió se despliega un mensaje de confirmación.
cerrarDialog(): void{
  this.dialogService.verificarCambios(this.dialogRef);
}

}
