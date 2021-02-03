import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-recuperar-password',
  templateUrl: './recuperar-password.component.html',
  styleUrls: ['./recuperar-password.component.css']
})
export class RecuperarPasswordComponent implements OnInit {

  constructor( private usuarioService: UsuarioService) { }

  ngOnInit(): void {
  }

  recuperarPassword(): void{
    this.usuarioService.recuperarPassword('correo@correo.com').toPromise()
    .then( resultado => {
      console.log('token generado:', resultado);
      alert('El código para recuperar contraseña a sido enviado a su correo.');
    })
    .catch((error: HttpErrorResponse) => {
      alert('¡Lo sentimos! ocurrió un problema al enviar su código de modificación de contraseña, vuelva a interntarlo.');
      console.log('Error al solicitar enviar correo para recuperación de contraseña. Error:' + error.message);
    });
  }

  modificarPassword(): void {
    this.usuarioService.modificarPassword('nueva123').toPromise()
    .then( resultado => {
      console.log('resultado modificacion: ', resultado);
    }).catch( (error: HttpErrorResponse) => {
      console.log(error.message);
    });
  }

}
