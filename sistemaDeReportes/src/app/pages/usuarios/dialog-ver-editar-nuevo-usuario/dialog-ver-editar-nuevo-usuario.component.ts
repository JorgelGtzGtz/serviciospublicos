import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogService } from '../../../services/dialog-service.service';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-dialog-ver-editar-nuevo-usuario',
  templateUrl: './dialog-ver-editar-nuevo-usuario.component.html',
  styleUrls: ['./dialog-ver-editar-nuevo-usuario.component.css']
})
export class DialogVerEditarNuevoUsuarioComponent implements OnInit {
  accion: string;
  modificado: boolean;
  form: FormGroup;

  constructor(public dialogRef: MatDialogRef<DialogVerEditarNuevoUsuarioComponent> ,
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

  // Inicializa el formulario reactivo, aquí es donde se crean los controladores de los inputs
  private buildForm(){
    this.form = this.formBuilder.group({
      id: [],
      estado: [],
      nombre: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required]],
      genero: ['', [Validators.required]],
      tipoUsuario: ['', [Validators.required]],
      usuario: ['', [Validators.required]],
      password: ['', [Validators.required]]
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

get campoNombre(){
  return this.form.get('nombre');
}
get campoCorreo(){
  return this.form.get('correo');
}

get campoTelefono(){
  return this.form.get('telefono');
}

get campoGenero(){
  return this.form.get('genero');
}
get campoTipoUsuario(){
  return this.form.get('tipoUsuario');
}
get campoUsuario(){
  return this.form.get('usuario');
}
get campoPassword(){
  return this.form.get('password');
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
    alert('¡Usuario creado exitosamente!');
  }
}

// Método que a través del método "verificarCambios" del servicio de DialogService
// verifica si el usuario interactuó con el formulario.
// Si la interacción sucedió se despliega un mensaje de confirmación.
cerrarDialog(): void{
  this.dialogService.verificarCambios(this.dialogRef);
}
}
