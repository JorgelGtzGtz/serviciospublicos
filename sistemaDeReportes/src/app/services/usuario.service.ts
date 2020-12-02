import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Usuario } from '../Interfaces/IUsuario';
import { UsuarioM } from '../Models/UsuarioM';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  url = 'http://localhost:50255/api/Usuario';

  constructor(private http: HttpClient ) { }

  // Método login para el inicio de sesión.
  login(usuario: string, password: string){
    return this.http.post<Usuario>(this.url + '/Login', null, {
     }).pipe(
       map( dato => {
         return UsuarioM.usuarioDesdeJson(dato);
     }));
  }

  logOut(){
    localStorage.removeItem('usuario');
  }

   // Método para obtener los datos del usuario que  inicio de sesión.
  obtenerUsuarioLogueado(){
    let usuario = JSON.parse(localStorage.getItem('usuario'));
    return usuario;
  }

  // Obtener lista de usuarios utilizando parametros
  obtenerListaUsuarios(parametro?: string){
    if (parametro === undefined){
       parametro = '';
    }
    const params = new HttpParams().append('usuario', parametro);
    return this.http.get(this.url + '/Lista/', {
      params
      });
    // return this.http.get<Usuario[]>(this.url + 'Lista/', {
    // params
    // }).pipe(
    //   map(usuarios => {
    //     return usuarios.map(user => this.convertirDesdeJSON(user));
    //   })
    // );
  }

  obtenerUsuario(idUsuario: number){
    return this.http.get<Usuario>(this.url + '/GetUsuario/' + idUsuario + '/');
  }

  obtenerJefesCuadrilla(){
    return this.http.get<Usuario[]>(this.url + '/GetJefesCuadrilla').pipe(
      map(jefes => {
        return jefes.map(user => UsuarioM.usuarioDesdeJson(user));
      })
    );
  }

  registrarUsuario(usuario: Usuario){
    return this.http.post(this.url + '/Registrar', usuario);
  }

  actualizarUsuario(usuario: Usuario){
    return this.http.put(this.url + '/Actualizar', usuario);
  }

  eliminarUsuario(idUsuario: number){
    return this.http.delete(this.url + '/Eliminar/' + idUsuario);
  }

  almacenarUsuario(usuario: Usuario){
    localStorage.setItem('usuario', JSON.stringify( usuario));
  }

  convertirDesdeJSON(obj: Object){
    return UsuarioM.usuarioDesdeJson(obj);
  }


}
