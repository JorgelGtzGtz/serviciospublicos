import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { UsuarioService } from '../services/usuario.service';
import { Usuario } from '../Interfaces/IUsuario';
import { HttpErrorResponse } from '@angular/common/http';
import { PermisoService } from '../services/permiso.service';
import { Permiso } from '../Interfaces/IPermiso';

@Injectable({
  providedIn: 'root'
})
export class UserAccessGuard implements CanActivate {

  constructor(private usuarioServicio: UsuarioService,
              private permisoService: PermisoService,
              private router: Router){}

  // Entrada: ActivatedRouteSnapshot y RouterStateSnapshot.
  // Salida: Promesa de tipo boolean.
  // Descripción: Método para verificar la existencia del usuario
  // en la base de datos, para permitirle ingresar al sistema.
  async canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
      let acceder: boolean;
      const usuario: Usuario = this.usuarioServicio.obtenerUsuarioLogueado();
      const permisoAcceder = await this.verificarPermisoAcceso(usuario);
      const estadoActivo = this.verificarEstado(usuario);
      if (permisoAcceder && estadoActivo){
        acceder = true;
      }else{
        acceder = false;
        this.usuarioServicio.logOut();
      }
      return acceder;
  }



  // Entrada: usuario de tipo Usuario
  // Salida: valor boolean
  // Descripción: verifica si el usuario encontrado es administrador
  // para permitirle acceder al sistema.
 async verificarPermisoAcceso(usuario: Usuario): Promise<boolean>{
    let tipoValido: boolean;
    const permisosTipo = await this.permisoService.obtenerPermisosTipo(usuario.ID_tipoUsuario).toPromise()
    .then( (permisos: Permiso[]) => {
        return permisos;
    });

    // Guardar los permisos del usuario
    this.permisoService.guardarPermisos(permisosTipo);

    // Verificar si tiene permiso de ingresar al sistema web.
    tipoValido = this.permisoService.verificarPermiso(1);
    if (!tipoValido){
      alert('No tiene permisos para ingresar a este sistema.');
    }
    return tipoValido;
  }

  // Entrada: usuario de tipo Usuario
  // Salida: valor boolean
  // Descripción: verifica si el usuario encontrado es administrador
  // para permitirle acceder al sistema.
  verificarEstado(usuario: Usuario): boolean{
    let usuarioActivo: boolean;
    if (usuario.Estatus_usuario){ // Tipo de usuario administrativo
      usuarioActivo = true;
    }else{
      alert('Esta cuenta no se encuentra activa. Contacte al personal pertinente para cualquier aclaración.');
      usuarioActivo = false;
    }
    return usuarioActivo;
  }
}
