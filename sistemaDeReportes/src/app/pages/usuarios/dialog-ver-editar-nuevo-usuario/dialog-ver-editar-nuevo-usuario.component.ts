import { Component, ElementRef, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogService } from '../../../services/dialog-service.service';
import { UsuarioService } from '../../../services/usuario.service';
import { debounceTime } from 'rxjs/operators';
import { Usuario } from '../../../Interfaces/IUsuario';
import { TipoUsuarioService } from '../../../services/tipo-usuario.service';
import { UsuarioM } from '../../../Models/UsuarioM';
import { HttpErrorResponse } from '@angular/common/http';
import { TipoUsuario } from '../../../Interfaces/ITipoUsuario';

@Component({
  selector: 'app-dialog-ver-editar-nuevo-usuario',
  templateUrl: './dialog-ver-editar-nuevo-usuario.component.html',
  styleUrls: ['./dialog-ver-editar-nuevo-usuario.component.css']
})
export class DialogVerEditarNuevoUsuarioComponent implements OnInit {
  accion: string;
  datosUsuario: Usuario;
  tiposUsuario: any = [];
  modificado: boolean;
  idListo: boolean;
  tiposUListos: boolean;
  form: FormGroup;

  constructor(public dialogRef: MatDialogRef<DialogVerEditarNuevoUsuarioComponent> ,
              @Inject (MAT_DIALOG_DATA) private data,
              private dialogService: DialogService,
              private formBuilder: FormBuilder,
              private usuarioService: UsuarioService,
              private tipoService: TipoUsuarioService) {
              dialogRef.disableClose = true;
              this.buildForm();
}

  ngOnInit(): void {
    this.accion = this.data.accion;
    this.tipoService.obtenerListaTipoU().subscribe(tipos => {
      this.tiposUsuario = tipos;
      this.tiposUListos = true;
    });
    this.inicializarCampos();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.inicializarFormulario();
    }, 30);
}

  // Inicializa el formulario reactivo, aquí es donde se crean los controladores de los inputs
  private buildForm(){
    this.form = this.formBuilder.group({
      id: [''],
      estado: [''],
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

// Llena los inputs con los datos del usuario cuando 
//  se abre la ventana ver o editar
inicializarCampos(){
  if (this.accion !== 'nuevo'){
    this.datosUsuario = this.usuarioService.convertirDesdeJSON(this.data.usuario);
    this.campoId.setValue( this.datosUsuario.ID_usuario);
    this.campoNombre.setValue(this.datosUsuario.Nombre_usuario);
    this.campoCorreo.setValue(this.datosUsuario.Correo_usuario);
    this.campoTelefono.setValue(this.datosUsuario.Telefono_usuario);
    this.campoUsuario.setValue(this.datosUsuario.Login_usuario);
    this.campoPassword.setValue(this.datosUsuario.Password_usuario);
    this.campoEstado.setValue(!this.datosUsuario.Estatus_usuario);
    this.campoGenero.setValue(this.datosUsuario.Genero_usuario);
  }else{
    this.campoEstado.setValue(false);
    this.obtenerIDNuevo();
  }
}

// funcion para indicar al selector tipoUsuario si debe mostrar
// el tipo de usuario de un usuario, cuando se está editando
inicializarSelTipo(tipo: TipoUsuario){
  let valor = false;
  if (this.datosUsuario !== undefined){
       if (tipo.ID_tipoUsuario === this.datosUsuario.ID_tipoUsuario){
         this.campoTipoUsuario.setValue(tipo.Descripcion_tipoUsuario);
         valor =  true;
       }
    }
  return valor;
}

// Devuelve true si el usuario interactuó con el formulario o false si no.
obtenerEstadoFormulario(): boolean{
  return this.modificado;
}
// Este método habilita o deshabilita el formulario según lo que se quiera hacer en el
//  ya sea ver información, crear nuevo registro o editar.
//  En "ver" todos los campos aparecen deshabilitados y en "nuevo" el único deshabilitado
//  es "activar"
  inicializarFormulario(): void{
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

  obtenerIDNuevo(): void{
    this.usuarioService.obtenerIDRegistro().subscribe( (id: number) => {
      this.campoId.setValue(id);
      this.idListo = true;
      console.log('ID a asignar:', id);
    });
  }

// Método que se llama cuando se le da click en guardar en el formulario.
guardar(): void {
  // event.preventDefault();
  if (this.form.valid){
    const usuario = this.generarUsuario();
    this.accionGuardar(usuario);
    this.dialogRef.close(this.data);
  } else{
    this.form.markAllAsTouched();
  }
}

//Generar usuario con datos de formulario
generarUsuario(){
  return new UsuarioM(
    this.campoId.value,
    this.campoNombre.value,
    this.campoCorreo.value,
    this.campoTelefono.value,
    this.campoGenero.value,
    this.buscarTipo(this.campoTipoUsuario.value),
    this.campoUsuario.value,
    this.campoPassword.value,
    !this.campoEstado.value,
    false
  );
}

// Recibe la descripcion de un tipo de usuario
// Y regresa el id que pertenece a este.
buscarTipo(descripcion: string){
  let desc: number;
  this.tiposUsuario.forEach(tipo => {
    if (tipo.Descripcion_tipoUsuario === descripcion) {
        desc = tipo.ID_tipoUsuario;
     }
  });
  return desc;
}


// Método para saber si se actualizará o registrará un nuevo usuario
accionGuardar(usuario: Usuario){
  if (this.accion === 'nuevo'){
      this.usuarioService.registrarUsuario(usuario).subscribe( res => {
        alert(res);
      }, (error: HttpErrorResponse) => {
        alert('El registro no pudo ser completado. Error:' + error.message);
      });
  }else if (this.accion === 'editar'){
    usuario.ID_usuario = this.datosUsuario.ID_usuario;
    this.usuarioService.actualizarUsuario(usuario).subscribe( res => {
        alert(res);
      }, (error: HttpErrorResponse) => {
        alert('Usuario no pudo ser actualizado. Error:' + error.message);
      });
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
