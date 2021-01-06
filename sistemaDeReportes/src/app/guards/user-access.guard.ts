import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from '../services/usuario.service';
import { Usuario } from '../Interfaces/IUsuario';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserAccessGuard implements CanActivate {

  constructor(private usuarioServicio: UsuarioService,
              private router: Router){}

  // Entrada: ActivatedRouteSnapshot y RouterStateSnapshot.
  // Salida: Promesa de tipo boolean.
  // Descripción: Método para verificar la existencia del usuario
  // en la base de datos, para permitirle ingresar al sistema.
  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
      let acceder: boolean;
      const usuario = await this.usuarioServicio.login().toPromise()
      .then( (usuarioRes: Usuario) => {
        return usuarioRes;
      })
      .catch((err: HttpErrorResponse) => {
          alert('Ingrese un usuario y contraseña válidos.');
          console.log(err);
          return null;
      });
      if (usuario){
        acceder = true;
        this.usuarioServicio.almacenarUsuarioLog(usuario);
      }else{
        this.usuarioServicio.eliminarDatosLogin();
        this.router.navigate(['login']);
        acceder = false;
      }
      return acceder;
  }

}