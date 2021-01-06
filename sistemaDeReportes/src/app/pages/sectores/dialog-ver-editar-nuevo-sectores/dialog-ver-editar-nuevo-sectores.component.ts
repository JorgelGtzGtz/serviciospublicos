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
datosSectorCargados: boolean;
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

  // Entrada: Ninguna
  // Salida: valor boolean.
  // Descripción: verifica que los datos del formulario se encuentrar listos, para poder
  // mostrar el formulario o el spinner.
  datosCargados(): boolean{
    let cargado: boolean;
    if (this.idListo && this.accion === 'nuevo' || this.datosSectorCargados  && this.accion !== 'nuevo'){
      cargado = true;
    }else{
      cargado = false;
    }
    return cargado;

  }

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción:Inicializa el formulario reactivo, aquí es donde se crean los controladores de los inputs
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

  // Entrada: Ninguna
  // Salida: control de tipo AbstractControl.
  // Descripción: Métodos para obtener el acceso a los controladores que se relacionan con los
  // campos del formulario.
  get campoId(): AbstractControl{
    return this.form.get('id');
  }
  get campoEstado(): AbstractControl{
    return this.form.get('estado');
  }
  get campoNombreSector(): AbstractControl{
    return this.form.get('nombreS');
  }

// Entrada: Ninguna
// Salida: vacío.
// Descripción: Este método habilita o deshabilita el formulario según lo que se quiera hacer en el.
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

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción:Se inicializan los valores de los campos del formulario
  // dependiendo del tipo de actividad a realizar.
  iniciarFormulario(): void{
    if (this.accion !== 'nuevo'){
        this.sector = this.data.sector;
        this.campoId.setValue( this.sector.ID_sector);
        this.campoNombreSector.setValue(this.sector.Descripcion_sector);
        this.campoEstado.setValue(!this.sector.Estatus_sector);
        this.datosSectorCargados = true;
    }else{
      this.obtenerIDNuevo();
      this.campoEstado.setValue(false);
    }
  }

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción: Función para obtener el ID del nuevo registro
   obtenerIDNuevo(): void{
    this.sectorService.obtenerIDRegistro().subscribe( (id: number) => {
      this.campoId.setValue(id);
      this.idListo = true;
    });
  }

  // Entrada: Ninguna
  // Salida: valor boolean.
  // Descripción: Devuelve true si el usuario interactuó con el formulario o false si no.
  obtenerEstadoFormulario(): boolean{
    return this.modificado;
  }

// Entrada: Ninguna
// Salida: vacío.
// Descripción: Método que se llama cuando se le da click en guardar en el formulario. Llama al
// método "accionGuardar" para ejecutar las acciones para guardar o actualizar.
guardar(): void {
  // event.preventDefault();
  if (this.form.valid){
    this.accionGuardar();
    this.dialogRef.close(this.data);
  } else{
    this.form.markAllAsTouched();
  }
}

// Entrada: Ninguna
// Salida: vacío.
// Descripción: Acciones a ejecutar para guardar dependiendo
// del tipo de proceso que se hizo en el dialog. Se usan las peticiones del servicio de sector.
accionGuardar(): void{
  const sector = this.generarSector();
  if (this.accion !== 'nuevo'){
   this.sectorService.actualizarSector(sector).subscribe( res => {
    alert ('¡Sector ' + sector.Descripcion_sector + ' actualizado con éxito!');
    }, (error: HttpErrorResponse) => {
      alert('¡Sector ' + sector.Descripcion_sector + ' no pudo ser actualizado! Verifique los datos o solicite asistencia.');
      console.log('Error al actualizar sector: ' + error.message);
    });
  } else{
    this.sectorService.insertarSector(sector).subscribe( res => {
      alert ('¡Sector ' + sector.Descripcion_sector + ' registrado con éxito!');
    }, (error: HttpErrorResponse) => {
      alert ('¡Sector ' + sector.Descripcion_sector + ' no pudo ser guardado! Verifique los datos o solicite asistencia.');
      console.log('Error al registrar nuevo sector: ' + error.message);
    });
  }
}

// Entrada: Ninguna
// Salida: Objeto de tipo SectorM.
// Descripción: Se crea nuevo objeto sectorM con los datos ingresados en los campos
// del formulario.
generarSector(): SectorM{
  return new SectorM(
    this.campoId.value,
    this.campoNombreSector.value,
    !this.campoEstado.value,
    true
  );
}

// Entrada: Ninguna
// Salida: vacío.
// Descripción:  Método que a través del método "verificarCambios" del servicio de DialogService
// verifica si el usuario interactuó con el formulario.
// Si la interacción sucedió se despliega un mensaje de confirmación.
cerrarDialog(): void{
  this.dialogService.verificarCambios(this.dialogRef);
}

}
