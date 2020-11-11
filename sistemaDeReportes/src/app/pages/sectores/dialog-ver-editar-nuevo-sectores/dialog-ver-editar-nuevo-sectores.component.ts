import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA  } from '@angular/material/dialog';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-dialog-ver-editar-nuevo-sectores',
  templateUrl: './dialog-ver-editar-nuevo-sectores.component.html',
  styleUrls: ['./dialog-ver-editar-nuevo-sectores.component.css']
})
export class DialogVerEditarNuevoSectoresComponent implements OnInit {
accion: string;
form: FormGroup;
modificado: boolean;

  constructor(public dialogRef: MatDialogRef<DialogVerEditarNuevoSectoresComponent>,
              @Inject (MAT_DIALOG_DATA) private data,
              private formBuilder: FormBuilder) {
      dialogRef.disableClose = true;
      this.buildForm();
   }

  ngOnInit(): void {
    this.accion = this.data.accion;
    this.tipoFormularioAccion();
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
    alert('Registro exitoso!');
  }
}

  cerrarDialog(): void{
    this.dialogRef.close();
  }

}
