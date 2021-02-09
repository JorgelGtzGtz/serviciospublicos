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
  deshabilitar: boolean;
  visible = false;


  constructor( private renderer: Renderer2,
               private router: Router,
               private route: ActivatedRoute,
               private usuarioServicio: UsuarioService) {
    this.formBuilder();
   }

  ngOnInit(): void {
    this.deshabilitar = false;
  }

  // Entrada: Ninguna.
  // Salida: vacío.
  // Descripción: Método que inicializa los controles que interactúan con los inputs del formulario.
  formBuilder(): void{
    this.usuarioForm = new FormControl('');
    this.passwordForm = new FormControl('');
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
  ingresar(): void{
    this.usuarioServicio.almacenarClaveLogin(this.campoUsuario.value, this.passwordForm.value);
    this.deshabilitar = true;
    this.router.navigate(['../inicio']);
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
