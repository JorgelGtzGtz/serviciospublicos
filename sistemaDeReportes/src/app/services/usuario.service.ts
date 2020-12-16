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
  login(){
    return this.http.post<Usuario>(this.url + '/Login', null, {
     }).pipe(
       map( dato => {
         return UsuarioM.usuarioDesdeJson(dato);
     }));
  }

  logOut(){
    localStorage.removeItem('usuario');
  }

  // Obtener lista de usuarios utilizando parametros
  obtenerListaUsuarios(textoB?: string, estadoUsuario?: string, tipoU?: string, repActi?: boolean){
    console.log('Se recibe en servicio:', textoB, estadoUsuario, tipoU, repActi);
    let reportesActivos: string;
    if (textoB === undefined){
      textoB = '';
   }
    if (estadoUsuario === undefined || estadoUsuario === 'Todos'){
      estadoUsuario = '';
   }

    if (tipoU === undefined || tipoU === 'Todos'){
     tipoU = '';
   }

    if (repActi === true){
     reportesActivos = '1';
   }else{
     reportesActivos = '';
   }

    let params = new HttpParams();
    params = params.append('textoB', textoB);
    params = params.append('estado', estadoUsuario);
    params = params.append('tipoU', tipoU);
    params = params.append('repActivos', reportesActivos);
    return this.http.get(this.url + '/ListaBusqueda', {
      params
      });
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

  obtenerIDRegistro(){
    return this.http.get(this.url + '/ObtenerID');
  }

  registrarUsuario(usuario: Usuario){
    return this.http.post(this.url + '/Registrar', usuario);
  }

  actualizarUsuario(usuario: Usuario){
    return this.http.put(this.url + '/Actualizar', usuario);
  }

  eliminarUsuario(idUsuario: number){
    console.log('Recibe en eliminar usuario:', idUsuario);
    return this.http.delete(this.url + '/Eliminar/' + idUsuario);
  }

  almacenarUsuarioLog(usuario: Usuario): void{
    localStorage.setItem('usuario', JSON.stringify( usuario));
  }

  // Al iniciar sesión, almacena temporalmente el usuario y contraseña para los header en 
  // el interceptor
  almacenarDatosLogin(usuarioLogin: string, password: string): void{
    const datosLogin: string[] = [usuarioLogin, password];
    localStorage.setItem('datosLogin', JSON.stringify(datosLogin));
  }

  // Obtener los datos usuario y contraseña ingresados en el login.
  obtenerDatosLogin(): string []{
    const datosLogin: string [] = JSON.parse(localStorage.getItem('datosLogin'));
    return datosLogin;
  }

  // Método para obtener los datos del usuario que  inicio de sesión.
  obtenerUsuarioLogueado(): UsuarioM{
    const usuario = JSON.parse(localStorage.getItem('usuario'));
    return usuario;
  }

  // Eliminar el item en el local storage que tenía los datos usuario
  //  y contraseña ingresados en el login
  eliminarDatosLogin(): void{
    localStorage.removeItem('datosLogin');
  }
  convertirDesdeJSON(obj: Object){
    return UsuarioM.usuarioDesdeJson(obj);
  }



}
