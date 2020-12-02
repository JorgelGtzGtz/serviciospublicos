import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
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
  visible = false;


  constructor( private renderer: Renderer2,
               private router: Router,
               private route: ActivatedRoute,
               private usuarioServicio: UsuarioService) {
    this.formBuilder();
   }

  ngOnInit(): void {
  }

  formBuilder(){
    this.usuarioForm = new FormControl('');
    this.passwordForm = new FormControl('');
    this.usuarioForm.valueChanges.subscribe(value => {
      console.log('se interactuo busqueda:', value);
    });
    this.passwordForm.valueChanges.subscribe(value => {
      console.log('se interactuo estado:', value);
    });
  }

  get campoUsuario(){
    return this.usuarioForm;
  }
  get campoPassword(){
    return this.passwordForm;
  }

  ingresar(): void{
    console.log('formulario se ha subido');
    this.usuarioServicio.login(this.campoUsuario.value, this.passwordForm.value).subscribe((usuario: Usuario) => {
      this.router.navigate(['../inicio']);
      this.usuarioServicio.almacenarUsuario(usuario);
    },
    (err: HttpErrorResponse) => {
      alert(err.message);
      console.log(err);
    });
  }

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
