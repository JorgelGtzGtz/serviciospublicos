import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators, AbstractControl } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { Usuario } from '../Interfaces/IUsuario';
import { HttpErrorResponse } from '@angular/common/http';
// import { ScriptService } from '../services/script.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('password') passwordInput: ElementRef;
  usuarioForm: FormControl;
  passwordForm: FormControl;
  desactivar: boolean;
  visible = false;


  constructor( private renderer: Renderer2,
               private router: Router,
               private route: ActivatedRoute,
               private usuarioServicio: UsuarioService) {
    this.formBuilder();
   }

  ngOnInit(): void {
    this.desactivar = false;
  }

  // Entrada: Ninguna.
  // Salida: vacío.
  // Descripción: Método que inicializa los controles que interactúan con los inputs del formulario.
  formBuilder(): void{
    this.usuarioForm = new FormControl('', [Validators.required]);
    this.passwordForm = new FormControl('', [Validators.required]);
  }

  // Entrada: Ninguna.
  // Salida: control de tipo AbstractControl.
  // Descripción: Método para obtener acceso al control del formulario.
  get campoUsuario(): AbstractControl{
    return this.usuarioForm;
  }
  get campoPassword(): AbstractControl{
    return this.passwordForm;
  }

  // Entrada: Ninguna.
  // Salida: vacío.
  // Descripción:Método que se llama al hacer click en el botón ingresar del login.
  // En este se almacenan los datos ingresados del usuario y contraseña en el localStorage 
  // y se redirecciona a inicio.
  async ingresar(): Promise<void>{
    if (this.campoUsuario.valid && this.campoPassword.valid){
      this.desactivar = true;
      this.usuarioServicio.almacenarClaveLogin(this.campoUsuario.value, this.passwordForm.value);
      const usuario: Usuario = await this.buscarUsuario();
      this.usuarioServicio.almacenarUsuarioLog(usuario);
      this.router.navigate(['../inicio']);
      this.desactivar = false;
    }else{
      this.campoPassword.markAsTouched();
      this.campoUsuario.markAsTouched();
    }
  }

  // Entrada: Ninguna.
  // Salida: Ninguna.
  // Descripción: con método del servicio de usuario, busca el usuario que
  // coincida con los datos usuario y contraseña proporcionados.

  async buscarUsuario(): Promise<Usuario>{
    const usuario: Usuario = await this.usuarioServicio.login().toPromise()
      .then( (usuarioRes: Usuario) => {
        return usuarioRes;
      })
      .catch((error: HttpErrorResponse) => {
        this.desactivar = false;
        this.usuarioServicio.logOut();
        this.inicializarFormulario();
        return null;
      });
    return usuario;
  }

  // Entrada: Ninguna.
  // Salida: Ninguna.
  // Descripción: Inicializa los valores de input del formulario.
  inicializarFormulario(): void{
    this.campoUsuario.setValue('');
    this.campoPassword.setValue('');
  }

  // Entrada: Ninguna.
  // Salida: Ninguna
  // Descripción: redirecciona hacia la página para recuperación de contraseña.
  recuperarPassword(): void{
    this.router.navigate(['../forgotPassword']);
  }

  // Entrada: Ninguna.
  // Salida: vacío.
  // Descripción: Método que oculta el texto del input password o muestra el texto.
  visibilidadContra(): void{
    if (this.visible){
      this.renderer.setAttribute(this.passwordInput.nativeElement, 'type', 'password');
      this.visible = false;
    }else{
      this.renderer.setAttribute(this.passwordInput.nativeElement, 'type', 'text');
      this.visible = true;
    }
  }



}
