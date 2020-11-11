import { Component, OnInit, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MyErrorStateMatcher } from './myErrorStateMatcher';
import { ActivatedRoute, Router } from '@angular/router';
import { NavigationExtras } from '@angular/router';
// import { ScriptService } from '../services/script.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  @ViewChild('password') passwordInput: ElementRef;
  visible = false;
// PARA VALIDACIONES; SE HICIERON CONTEMPLANDO INPUTS DE ANGULAR MATERIAL
  // userFormControl = new FormControl('', [
  //   Validators.required
  // ]);
  // passwordFormControl = new FormControl('', [
  //   Validators.required,
  //   Validators.minLength(8),
  // ]);

  // matcher = new MyErrorStateMatcher();
  // usuario = 'nalupre94';
  // password = 'password';
  // hide = true;

  constructor( private renderer: Renderer2, private router: Router, private route: ActivatedRoute) {
   }

  ngOnInit(): void {
  //   this.scripts.load('jQuery', 'bootstrap', 'adminlteApp', 'adminlteDemo').then(data => {
  //     console.log('script loaded ', data);
  // }).catch(error => console.log(error));
  //   console.log(this.scripts);
  }

  guardar(): void{
    console.log('formulario se ha subido');
    this.router.navigate(['../inicio']);
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

  entrar(): void {
    // this.router.navigate(['../inicio'], { relativeTo: this.route});
  }


}
