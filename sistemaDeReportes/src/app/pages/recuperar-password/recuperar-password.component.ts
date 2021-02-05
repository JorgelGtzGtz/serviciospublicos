import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-recuperar-password',
  templateUrl: './recuperar-password.component.html',
  styleUrls: ['./recuperar-password.component.css']
})
export class RecuperarPasswordComponent implements OnInit {
  email: FormControl;
  token: FormControl;
  password: FormControl;
  confirmPassword: FormControl;
  pedirToken: boolean;
  recibirToken: boolean;
  actualizarPassword: boolean;
  volverLogin: boolean;
  mismoPassword: boolean;

  constructor( private usuarioService: UsuarioService,
               private router: Router) {
    this.formBuilder();
   }

  ngOnInit(): void {
    this.pedirToken = true;
    this.recibirToken = false;
    this.actualizarPassword = false;
    this.mismoPassword = true;
  }

  // Entrada: Ninguna.
  // Salida: vacío.
  // Descripción: Método que inicializa los controles que interactúan con los inputs del formulario.
  formBuilder(): void{
    this.email = new FormControl('', [Validators.required, Validators.email]);
    this.token = new FormControl('', [Validators.required]);
    this.password = new FormControl('', [Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])([A-Za-z0-9]|[^ ]){8}')]);
    this.confirmPassword = new FormControl('', [Validators.required]);
    this.validezPassword();
  }

  // Entrada: Ninguna
  // Salida: Ninguna
  // Descripción: monitorea la contraseña de confirmación para verificar que sea igual a
  // la contraseña principal.
  validezPassword(): void{
    this.confirmPassword.valueChanges.pipe(debounceTime(500)).subscribe(passwordConfirmacion => {
      if (this.confirmPassword.dirty){
        this.mismoPassword = this.compararPassword(passwordConfirmacion);
      }
     });
  }

  // Entrada: string con password de confirmación
  // Salida: booleano.
  // Descripción: Compara las dos contraseñas ingresadas para verificar que sean iguales.
  compararPassword(passwordConfirmacion: string): boolean{
    let iguales: boolean;
    if (this.password.value === passwordConfirmacion){
      iguales = true;
    }else{
      iguales = false;
    }
    return iguales;
  }

  // Entrada: Ninguna
  // Salida: Ninguna
  // Descripción: Solicita el envío de un correo con código de recuperación de contraseña.
  // envía al servicio, el correo ingresado por el usuario.
  recuperarPassword(): void{
    if (this.email.valid){
      this.usuarioService.recuperarPassword(this.email.value).toPromise()
    .then( resultado => {
      console.log('token generado:', resultado);
      alert('El código para recuperar contraseña a sido enviado a su correo.');
      this.pedirToken = false;
      this.recibirToken = true;
    })
    .catch((error: HttpErrorResponse) => {
      alert('¡Lo sentimos! ocurrió un problema al enviar su código de modificación de contraseña, vuelva a interntarlo.');
      console.log('Error al solicitar enviar correo para recuperación de contraseña. Error:' + error.message);
    });
    }
  }

  // Entrada: Ninguna
  // Salida: Ninguna
  // Descripción: Verifica que el token sea válido.
  verificarToken(): void{
    this.usuarioService.verificarToken(this.token.value).toPromise()
    .then( resultado => {
      if (resultado){
        this.actualizarPassword = true;
        this.recibirToken = false;
      }else{
        alert('Este token no es válido.');
        this.usuarioService.eliminarToken();
      }
    })
    .catch( (error: HttpErrorResponse) => {
      console.log(error.message);
    });
  }

  // Entrada: Ninguna
  // Salida: Ninguna
  // Descripción: Reenvía al correo proporcionado el token.
  enviarCorreo(): void{
    const correo = this.usuarioService.recuperarEmailUsuario();
    this.usuarioService.recuperarPassword(correo).toPromise()
    .then( resultado => {
      console.log('Respuesta de correo:', resultado);
      alert('El código para recuperar contraseña a sido enviado a su correo.');
      this.pedirToken = false;
      this.recibirToken = true;
    })
    .catch((error: HttpErrorResponse) => {
      alert('¡Lo sentimos! ocurrió un problema al enviar su código de modificación de contraseña, vuelva a interntarlo.');
      console.log('Error al solicitar enviar correo para recuperación de contraseña. Error:' + error.message);
    });
  }

  // Entrada: Ninguna
  // Salida: Ninguna
  // Descripción: Método para modificar la contraseña del usuario.
  modificarPassword(): void {
    if (this.mismoPassword){
      this.usuarioService.modificarPassword(this.password.value).toPromise()
      .then( mensajeResultado => {
        alert(mensajeResultado);
        this.volverLogin = true;
        this.actualizarPassword = false;
        this.usuarioService.eliminarEmail();
      }).catch( (error: HttpErrorResponse) => {
        console.log(error.message);
        alert('Ha ocurrido un problema al actualizar su contraseña. Vuelva a intentarlo más tarde.');
      });
    }
}

// Entrada: Ninguna
// Salida: Ninguna
// Descripción: Redirecciona al login.
volverInicio(): void{
  this.router.navigate(['../login']);
}

}
