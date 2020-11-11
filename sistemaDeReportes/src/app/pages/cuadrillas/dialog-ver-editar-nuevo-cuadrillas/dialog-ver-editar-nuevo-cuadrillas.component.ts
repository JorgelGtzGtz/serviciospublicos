import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DialogService } from '../../../services/dialog-service.service';

@Component({
  selector: 'app-dialog-ver-editar-nuevo-cuadrillas',
  templateUrl: './dialog-ver-editar-nuevo-cuadrillas.component.html',
  styleUrls: ['./dialog-ver-editar-nuevo-cuadrillas.component.css']
})
export class DialogVerEditarNuevoCuadrillasComponent implements OnInit {
  accion: string;
  form: FormGroup;
  modificado: boolean;

  constructor(public dialogRef: MatDialogRef<DialogVerEditarNuevoCuadrillasComponent>,
              @Inject (MAT_DIALOG_DATA) private data,
              private dialogService: DialogService,
              private formBuilder: FormBuilder) {
                dialogRef.disableClose = true;
                this.buildForm();
               }

  ngOnInit(): void {
    this.accion = this.data.accion;
    this.tipoFormularioAccion();
  }

  private buildForm(){
    this.form = this.formBuilder.group({
      id: ['', [Validators.required]],
      estado: [''],
      nombreC: ['', [Validators.required]],
      encargado: ['', [Validators.required]]
    });
    this.form.valueChanges.subscribe(value => {
      if (this.form.touched){
        console.log('se interactuo');
        this.modificado = true;
      }else{
        this.modificado = false;
      }
      console.log('Value:', value);
    });
  }

  get campoId(){
    return this.form.get('id');
  }

  get campoEstado(){
    return this.form.get('estado');
  }

  get campoNombreCuadrilla(){
    return this.form.get('nombreC');
  }

  get campoNombreEncargado(){
    return this.form.get('encargado');
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
guardar() {
  // event.preventDefault();
  if (this.form.valid){
    const value = this.form.value;
    this.mensajeDeGuardado();
    this.dialogRef.close(this.data);
    console.log(value);
  } else{
    this.form.markAllAsTouched();
  }
}

// Método que muestra un mensaje, al dar click en guardar.
// El contenido del mensaje depende de si está actualizando datos o creando nuevo registro
mensajeDeGuardado(): void{
  if (this.accion === 'editar'){
    alert('¡Los datos se han actualizado exitosamente!');
  } else{
    alert('¡Registro exitoso!');
  }
}

// Método que a través del método "verificarCambios" del servicio de DialogService
// verifica si el usuario interactuó con el formulario.
// Si la interacción sucedió se despliega un mensaje de confirmación.
cerrarDialog(): void{
  this.dialogService.verificarCambios(this.dialogRef);
}

}
