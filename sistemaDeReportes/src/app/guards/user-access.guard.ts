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
      const usuario: Usuario = this.usuarioServicio.obtenerUsuarioLogueado();
      if (usuario){
        acceder = true;
      }else{
        acceder = false;
      }
      return acceder;
  }
}
