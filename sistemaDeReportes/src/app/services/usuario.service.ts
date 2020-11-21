import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  url = 'http://localhost:50255/api/Usuario/';

  constructor(private http: HttpClient ) { }

  // Método que genera header para autorización, recibe
  //  usuario y contraseña. Devuelve una variable de tipo
  //  HttpHeaders
  generarHeaders(usuario: string, password: string): HttpHeaders{
    const headers = new HttpHeaders({
      Authorization : 'Basic ' + btoa(usuario + ':' + password),
      'Content-Type': 'application/json'
    });
    return headers;
  }

  // Método login para el inicio de sesión.
  //  Recibe el usuario y contraseña y llama al método "generarHeaders()"
  //  para obtener los headers de autorización. Hace una petición post a la API
  //  y devuelve el observable de esa petición.
  login(usuario: string, password: string){
    const headers = this.generarHeaders(usuario, password);
    return this.http.post(this.url + 'Login', null, {
      headers
    });
  }

   // Método para obtener los datos del usuario que  inicio de sesión.
  //  Recibe el usuario y contraseña y llama al método "generarHeaders()"
  //  para obtener los headers de autorización. Hace una petición post a la API
  //  y devuelve el observable de esa petición.
  usuarioLogueado(usuario: string, password: string){
    const headers = this.generarHeaders(usuario, password);
    return this.http.post(this.url + 'Login', null, {
      headers
    });
  }
}
