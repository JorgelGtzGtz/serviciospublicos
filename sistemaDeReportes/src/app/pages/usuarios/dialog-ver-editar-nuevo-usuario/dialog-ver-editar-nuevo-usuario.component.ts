import { Component, ElementRef, Inject, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogService } from '../../../services/dialog-service.service';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../Interfaces/IUsuario';
import { TipoUsuarioService } from '../../../services/tipo-usuario.service';
import { UsuarioM } from '../../../Models/UsuarioM';
import { HttpErrorResponse } from '@angular/common/http';
import { TipoUsuario } from '../../../Interfaces/ITipoUsuario';
import { debounce, debounceTime } from 'rxjs/operators';

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
  existeCorreo: boolean;
  existeLoginUsuario: boolean;
  passwordInvalido: boolean;
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
    this.cargarTiposUsuario();
    this.inicializarCampos();
    this.inicializarFormulario();
  }

// Entrada: ninguna.
// Salida: valor boolean.
// Descripción: verifica que la información del formulario
// se encuentre lista para poder mostrarla al usuario.
datosCargados(): boolean{
  let cargado: boolean;
  if ((this.tiposUListos && this.idListo) && this.accion === 'nuevo' ||
      this.tiposUListos && this.accion !== 'nuevo' ){
        cargado = true;
    }else{
        cargado = false;
    }
  return cargado;
}

//   ngAfterViewInit() {
//     setTimeout(() => {
//       // this.inicializarFormulario();
//       // this.inicializarCampos();
//     }, 30);
// }

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción:Inicializa el formulario reactivo, aquí es donde se crean los controladores de los inputs
  private buildForm(): void{
    this.form = this.formBuilder.group({
      id: [''],
      estado: [''],
      nombre: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      correo: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.pattern('[0-9]{10,16}')]],
      genero: ['', [Validators.required]],
      tipoUsuario: ['', [Validators.required]],
      usuario: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])([A-Za-z0-9]|[^ ]){8}')]]
    });
    this.verificarCambiosFormulario();
    this.verificarCambiosCorreo();
    this.verificarCambiosLogin();  
    // this.verificarPasswordValido(); 
  }

// Entrada: Ninguna
// Salida: vacío
// Descripción: Método que se llama cuando se interactúa con el formulario
// para verificar si se interactuó con el formulario en general.
  verificarCambiosFormulario(){
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
// Salida: vacío
// Descripción: Método que se llama cuando se interactúa con el formulario
// para verificar si se interactuó con el input correo.
  verificarCambiosCorreo(){
    this.campoCorreo.valueChanges.pipe(debounceTime(500)).subscribe(correo => {
     if (this.campoCorreo.touched){
       this.verificarExistenciaEmail(correo);
     }
    });
  }

// Entrada: Ninguna
// Salida: vacío
// Descripción: Método que se llama cuando se interactúa con el formulario
// para verificar si se interactuó con el input usuario.
  verificarCambiosLogin(){
    this.campoUsuario.valueChanges.pipe(debounceTime(500)).subscribe(loginUsuario => {
      if (this.campoUsuario.touched){
      this.verificarExistenciaUsuario(loginUsuario);
      }
    });
  }

// Entrada: Ninguna
// Salida: vacío
// Descripción: Método que se llama cuando se interactúa con el formulario
// para verificar si se interactuó con el input password.
  verificarPasswordValido(){
    this.campoPassword.valueChanges.pipe(debounceTime(500)).subscribe( password => {
      if (this.campoPassword.touched){
      this.verificarPassword(password);
      }
    });
  }

  // Entrada: string con el valor del input
// Salida: vacío.
// Descripción: Método que verifica si el campo ya interactuó con el usuario
//  y si el Email no pertenece a algun otro usuario.
verificarExistenciaEmail(correo: string){
  if(correo.length > 0){
    this.usuarioService.obtenerUsuarioPorCorreo(correo).subscribe( res => {
      if (res !== null){
        this.existeCorreo = true;
      }else{
        this.existeCorreo = false;
      }
    }, (error: HttpErrorResponse) => {
      console.log('Error al verificar la existencia de correo.' + error.message);
    });
  }else {
    this.existeCorreo = false;
  }
}

// Entrada: valor string
// Salida: vacío.
// Descripción: Método que verifica si el campo ya interactuó con el usuario
//  y si el login_usuario no pertenece a algun otro usuario.
verificarExistenciaUsuario(loginUsuario: string){
  if(loginUsuario.length > 0){
    this.usuarioService.obtenerUsuarioPorNombreLogin(loginUsuario).subscribe( res => {
      if (res !== null){
        this.existeLoginUsuario = true;
      }else{
        this.existeLoginUsuario = false;
      }
    }, (error: HttpErrorResponse) => {
      console.log('Error al verificar la existencia de login usuario.' + error.message);
    });
  }else {
    this.existeLoginUsuario = false;
  }
}

// Entrada: valor string.
// Salida: vacío.
// Descripción: Método que verifica si el campo ya interactuó con el usuario
//  y si la contraseña tiene el formato correcto.
verificarPassword(password: string){
  if(password.length > 0){
    const passwordVerificada = this.usuarioService.verificarFormatoPassword(password);
    console.log('respuesta:', passwordVerificada);
      if (passwordVerificada !== null){
        this.passwordInvalido = false ;
      }else{
        this.passwordInvalido = true;
      }
  }else {
    this.passwordInvalido = false;
  }
}

// Entrada: Ninguna
// Salida: control del input que pertenece al formGroup, de tipo AbstractControl.
// Descripción: Métodos para obtener acceso a los controladores de los inputs del formulario.
get campoId(): AbstractControl{
  return this.form.get('id');
}
get campoEstado(): AbstractControl{
  return this.form.get('estado');
}

get campoNombre(): AbstractControl{
  return this.form.get('nombre');
}
get campoCorreo(): AbstractControl{
  return this.form.get('correo');
}

get campoTelefono(): AbstractControl{
  return this.form.get('telefono');
}

get campoGenero(): AbstractControl{
  return this.form.get('genero');
}
get campoTipoUsuario(): AbstractControl{
  return this.form.get('tipoUsuario');
}
get campoUsuario(): AbstractControl{
  return this.form.get('usuario');
}
get campoPassword(): AbstractControl{
  return this.form.get('password');
}

// Entrada: objeto tipo TipoUsuario
// Salida: valor boolean
// Descripción: Este método habilita o deshabilita el formulario según lo que se quiera hacer en el
//  ya sea ver información, crear nuevo registro o editar.
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

// Entrada: Ninguna
// Salida: vacío.
// Descripción: Métodos para cargar los tipos de usuario existentes en una lista
// para posteriormente mostrarlos en un select.
cargarTiposUsuario(): void{
  this.tipoService.obtenerListaTipoU().subscribe(tipos => {
    this.tiposUsuario = tipos;
    this.tiposUListos = true;
  }, (error: HttpErrorResponse) => {
    alert('Ha surgido un error al cargar ventana. Intente de nuevo o solicite asistencia.');
    console.log('Error al obtener tipos de usuario. Mensaje de error: ', error.message);
  });
}

// Entrada: Ninguna
// Salida: vacío.
// Descripción: Métodos para inicializar valores en formulario en relación a la acción.
inicializarCampos(): void{
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
    this.campoTipoUsuario.setValue(this.datosUsuario.ID_tipoUsuario);
  }else{
    this.campoEstado.setValue(false);
    this.obtenerIDNuevo();
    this.campoTipoUsuario.setValue(0);
  }
}

// Entrada: objeto tipo TipoUsuario
// Salida: valor boolean
// Descripción: Método para determinar que tipo de usuario se debe mostrar
// seleccionado en el select.
inicializarSelTipo(tipo: TipoUsuario): boolean{
  let valor = false;
  if (this.datosUsuario !== undefined){
        if (tipo.ID_tipoUsuario === this.datosUsuario.ID_tipoUsuario){
          valor =  true;
       }
    }
  return valor;
}

// Entrada: Ninguna.
// Salida: valor boolean
// Descripción: Devuelve true si el usuario interactuó con el formulario o false si no.
obtenerEstadoFormulario(): boolean{
  return this.modificado;
}

// Entrada: Ninguna.
// Salida: vacío.
// Descripción: Método para obtener el ID que el nuevo registro tendrá.
obtenerIDNuevo(): void{
    this.usuarioService.obtenerIDRegistro().subscribe( (id: number) => {
      this.campoId.setValue(id);
      this.idListo = true;
      console.log('ID a asignar:', id);
    }, (error: HttpErrorResponse) => {
      alert('Ha surgido un error al cargar ventana. Intente de nuevo o solicite asistencia.');
      console.log('Error al obtener ID para nuevo registro. Mensaje de error: ', error.message);
    });
}

// Entrada: Ninguna.
// Salida: vacío.
// Descripción: Método para generar usuario con datos de formulario
generarUsuario(): UsuarioM{
  return new UsuarioM(
    this.campoId.value,
    this.campoNombre.value,
    this.campoCorreo.value,
    this.campoTelefono.value,
    this.campoGenero.value,
    this.campoTipoUsuario.value,
    this.campoUsuario.value,
    this.campoPassword.value,
    !this.campoEstado.value,
    false, // jefe cuadrilla
    true // disponible (para eliminación)
  );
}

// Entrada: value string con la descripción del tipo de usuario.
// Salida: valor number con el id del tipo de usuario.
// Descripción: Método que recibe la descripcion de un tipo de usuario
// Y regresa el id que pertenece a este.
buscarTipo(descripcion: string): number{
  let idTipoUsuario: number;
  this.tiposUsuario.forEach(tipo => {
    if (tipo.Descripcion_tipoUsuario === descripcion) {
        idTipoUsuario = tipo.ID_tipoUsuario;
     }
  });
  return idTipoUsuario;
}

// Entrada: Ninguna.
// Salida: vacío.
// Descripción: Método que se llama cuando se le da click en guardar en el formulario.
guardar(): void {
  // event.preventDefault();
  if (this.camposValidos()){
    const usuario = this.generarUsuario();
    this.accionGuardar(usuario);    
  } else{
    alert('Verifique que los campos tengan la información correcta o estén llenos.');
  }
}
// Entrada: Ninguna.
// Salida: valor boolean.
// Descripción: verifica que los campos estén llenos correctamente o
// que no existan errores en los campos.
camposValidos(): boolean{
  let sonValidos = true;
  // Verificar que se llenaron los campos del formulario.
  if (!this.form.valid){    
    this.form.markAllAsTouched();
    sonValidos = false;
  }

  // Verificar que la contraseña sea válida.
  if (this.passwordInvalido){   
    sonValidos = false;
  }

  // Verificar que no exista un usuario con este correo.
  if (this.existeCorreo){
    sonValidos = false;
  }  
  // Verificar que el login_usuario de usuario no existe.
  if (this.existeLoginUsuario){
    sonValidos = false;
  }  
  return sonValidos;
}

// Entrada: Objeto de tipo Usuario.
// Salida: vacío.
// Descripción: Método en donde se llama al servicio de usuario para hacer
// la petición para guardar o actualizar un registro de usuario.
accionGuardar(usuario: Usuario): void{
  if (this.accion === 'nuevo'){
      this.usuarioService.registrarUsuario(usuario).subscribe( res => {
        alert(res);
        this.dialogRef.close(this.data);
      }, (error: HttpErrorResponse) => {
        alert('El registro no pudo ser completado. Verifique que los datos sean correctos o solicite asistencia.');
        console.log('Error al registrar usuario. Mensaje de error: ', error.message);
      });
  }else if (this.accion === 'editar'){
    this.usuarioService.actualizarUsuario(usuario).subscribe( res => {
        alert(res);
        this.dialogRef.close(this.data);
      }, (error: HttpErrorResponse) => {
        alert('Usuario no pudo ser actualizado. Verifique que los datos sean correctos o solicite asistencia.');
        console.log('Error al actualizar usuario. Mensaje de error: ', error.message);
      });
    }
}

// Entrada: Objeto de tipo Usuario.
// Salida: vacío.
// Descripción: Método que a través del método "verificarCambios" del servicio de DialogService
// verifica si el usuario interactuó con el formulario.
// Si la interacción sucedió se despliega un mensaje de confirmación. Cierra el dialog.
cerrarDialog(): void{
  this.dialogService.verificarCambios(this.dialogRef);
}
}
