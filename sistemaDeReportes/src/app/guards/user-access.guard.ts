import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { Usuario } from '../Interfaces/IUsuario';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserAccessGuard implements CanActivate {

  constructor(private usuarioServicio: UsuarioService,
              private router: Router, private route: ActivatedRoute){}

  // Entrada: ActivatedRouteSnapshot y RouterStateSnapshot.
  // Salida: Promesa de tipo boolean.
  // Descripción: Método para verificar la existencia del usuario
  // en la base de datos, para permitirle ingresar al sistema.
  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
      let acceder: boolean;
      const usuario: Usuario = await this.usuarioServicio.login().toPromise()
      .then( (usuarioRes: Usuario) => {
        return usuarioRes;
      })
      .catch((error: HttpErrorResponse) => {
          alert('Verifique que el usuario y contraseña sean correctos.');
          return null;
      });

      if (usuario){
        acceder = this.verificarTipoUsuario(usuario);
      }else{
        acceder = false;
      }
      return acceder;
  }

  // Entrada: usuario de tipo Usuario
  // Salida: valor boolean
  // Descripción: verifica si el usuario encontrado es administrador
  // para permitirle acceder al sistema.
  verificarTipoUsuario(usuario: Usuario): boolean{
    let acceder: boolean;
    if (usuario.ID_tipoUsuario === 3){
      acceder = true;
      this.usuarioServicio.almacenarUsuarioLog(usuario);
    }else{
      this.usuarioServicio.eliminarDatosLogin();
      alert('No tiene permisos para ingresar a este sistema.');
      acceder = false;
    }
    return acceder;
  }

}
