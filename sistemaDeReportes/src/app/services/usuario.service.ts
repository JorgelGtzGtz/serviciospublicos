import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Usuario } from '../Interfaces/IUsuario';
import { UsuarioM } from '../Models/UsuarioM';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {
  url = 'http://localhost:50255/api/Usuario';
  tokenRecuperacion: string [];

  constructor(private http: HttpClient ) { }

  // Entrada: Ninguna.
  // Salida: Observable de tipo Usuario.
  // Descripción: Método login para el inicio de sesión mediante una petición http POST
  login(): Observable<UsuarioM>{
    return this.http.post<Usuario>(this.url + '/Login', null, {
     }).pipe(
       map( dato => {
         return UsuarioM.usuarioDesdeJson(dato);
     }));
  }

  // Entrada: ninguna
  // Salida: vacío.
  // Descripción: Método para eliminar la información de usuario almacenada en el sessionStorgae
  logOut(): void{
    sessionStorage.clear();
  }

  // Entrada: string con email.
  // Salida: Observable de tipo string.
  // Descripción: Método para solicitar link para reestablecer contraseña.
  recuperarPassword(email: string): Observable<string[]>{
    let params = new HttpParams();
    params = params.append('email', email);
    return this.http.post<string[]>(this.url + '/forgotPassword', null, {params});
  }


  // Entrada: valor string con correo del usuario.
  // Salida: Ninguna
  // Descripción: Guarda en localStorage el correo del usuario
  guardarEmailUsuario(email: string): void {
    localStorage.setItem('emailUsuario', email);
  }

  // Entrada: ninguna.
  // Salida: string
  // Descripción: Se recupera de localStorage el email del usuario.
  recuperarEmailUsuario(): string {
    const email = localStorage.getItem('emailUsuario');
    return  email;
  }

  // Entrada: Ninguna.
  // Salida: Ninguna.
  // Descripción: elimina el emial de localStorage.
  eliminarEmail(): void{
    localStorage.removeItem('emailUsuario');
  }

  // Entrada: valor string con correo del usuario.
  // Salida: Ninguna
  // Descripción: Guarda en localStorage el token de recuperación.
  guardarToken(token: string[]): void {
    this.tokenRecuperacion = token;
  }

  // Entrada: ninguna.
  // Salida: string
  // Descripción: Se recupera de localStorage el token de recuperación.
  recuperarToken(): string[] {
    return  this.tokenRecuperacion;
  }

  // Entrada: Ninguna.
  // Salida: Ninguna.
  // Descripción: elimina el token de localStorage.
  eliminarToken(): void{
    this.tokenRecuperacion = [];
  }

  // Entrada: string con email.
  // Salida: Observable de tipo string.
  // Descripción: Método para solicitar link para reestablecer contraseña.
  modificarPassword(password: string): Observable<string>{
    const token = this.recuperarToken();
    const idUsuario = token[2];
    let params = new HttpParams();
    params = params.append('password', password);
    params = params.append('idUsuario', idUsuario);
    return this.http.post<string>(this.url + '/modificarPassword', null, {params});
  }

  // Entrada: string con token
  // Salida: Observable de tipo boolean.
  // Descripción: Verifica que el token ingresado y el asignado sean el mismo.
  mismoToken(token: string): boolean{
    let mismo: boolean;
    const tokenArr = this.recuperarToken();
    const tokenAsignado = tokenArr[0];
    mismo = token === tokenAsignado ? true : false;
    return mismo;
  }


  // Entrada: string con token
  // Salida: Observable de tipo boolean.
  // Descripción: Verifica validez del token en la API
  verificarToken(token: string): Observable<boolean>{
    const tokenArr = this.recuperarToken();
    const tokenAsignado = tokenArr[0];
    const fechaToken = tokenArr[1];
    const email = this.recuperarEmailUsuario();
    // Asignar parámetros
    let params = new HttpParams();
    params = params.append('token', token);
    params = params.append('tokenA', tokenAsignado);
    params = params.append('fechaToken', fechaToken);
    params = params.append('email', email);
    return this.http.post<boolean>(this.url + '/verificarToken', null, {params});
  }
  // Entrada: valor tipo string para cada parámetro de filtro de búsqueda.
  // Salida: observable con la respuesta de la petición.
  // Descripción: Obtener lista de usuarios utilizando parametros medinate petición http GET
  obtenerListaUsuarios(textoB?: string, estadoUsuario?: string, tipoU?: string, repActi?: boolean): Observable<Object[]>{
    let reportesActivos: string;
    if (textoB === undefined){
      textoB = '';
   }
    if (estadoUsuario === undefined || estadoUsuario === '01'){
      estadoUsuario = '';
   }

    if (tipoU === undefined || tipoU === '0' || tipoU === '00'){
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
    return this.http.get<Object[]>(this.url + '/ListaBusqueda', {
      params
      });
  }

  // Entrada: valor tipo number.
  // Salida: observable de tipo Usuario.
  // Descripción: método para obtener un Usuario por su ID mediante una petición http GET
  obtenerUsuario(idUsuario: number): Observable<Usuario>{
    return this.http.get<Usuario>(this.url + '/GetUsuario/' + idUsuario + '/');
  }

  // Entrada: valor tipo string.
  // Salida: observable de tipo Usuario.
  // Descripción: método para obtener un Usuario por su correo mediante una petición http GET
  obtenerUsuarioPorCorreo(correo: string): Observable<Usuario>{
    let params = new HttpParams();
    params = params.append('correoUsuario', correo);
    return this.http.get<Usuario>(this.url + '/GetUsuarioByEmail', {params});
  }

  // Entrada: valor tipo string.
  // Salida: observable de tipo Usuario.
  // Descripción: método para obtener un Usuario por su username mediante una petición http GET
  obtenerUsuarioPorNombreLogin(nombreLogin: string): Observable<Usuario>{
    let params = new HttpParams();
    params = params.append('loginUsuario', nombreLogin);
    return this.http.get<Usuario>(this.url + '/GetUsuarioByLogin', {params});
  }

  // Entrada: ninguna.
  // Salida: observable de tipo lista de usuario.
  // Descripción: Método para obtener los usuarios de tipo jefes de cuadrilla
  // con una petición http de tipo GET.
  obtenerJefesCuadrilla(): Observable<Usuario[]>{
    return this.http.get<Usuario[]>(this.url + '/GetJefesCuadrilla').pipe(
      map(jefes => {
        return jefes.map(user => UsuarioM.usuarioDesdeJson(user));
      })
    );
  }

  // Entrada: Ninguna.
  // Salida: observable de tipo number con el resultado de la petición http.
  // Descripción: Método para obtener el ID del nuevo registro, mediante una petición http de tipo get.
  obtenerIDRegistro(): Observable<number>{
    return this.http.get<number>(this.url + '/ObtenerID');
  }

  // Entrada: valor tipo Usuario.
  // Salida: Observable con el resultado de la petición.
  // Descripción: Método para hacer una petición Http de tipo POST para registrar un nuevo usuario.
  registrarUsuario(usuario: Usuario): Observable<string>{
    return this.http.post<string>(this.url + '/Registrar', usuario);
  }

  // Entrada: valor tipo Usuario.
  // Salida: observable con el resultado de la petición http PUT.
  // Descripción: Método para actualizar la información del usuario.
  actualizarUsuario(usuario: Usuario): Observable<string>{
    return this.http.put<string>(this.url + '/Actualizar', usuario);
  }

  // Entrada: valor tipo number con el ID del usuario.
  // Salida: observable con el resultado de la petición http DELETE.
  // Descripción: Método para hacer una petición DELETE a la API, para eliminar el usuario.
  eliminarUsuario(usuario: Usuario): Observable<object>{
    return this.http.put(this.url + '/EliminarUsuario', usuario);
  }

  // Entrada: String con password
  // Salida: password encriptada
  // Descripción: Encripta las contraseñas.
  encriptarPassword(password: string): string{
    return btoa(password);
  }

  // Entrada: objeto tipo Usuario
  // Salida: vacío.
  // Descripción: Método para guardar el objeto de tipo Usuario en el session storage
  almacenarUsuarioLog(usuario: Usuario): void{
    if (usuario){
      usuario.Password_usuario = '';
      usuario.Telefono_usuario = '';
      usuario.Correo_usuario = '';
      const encriptar = btoa(JSON.stringify(usuario));
      sessionStorage.setItem('usr', encriptar);
    }else{
      sessionStorage.setItem('usr', 'null');
    }
  }

  // Entrada: valor tipo string para usuario y valor tipo string para contraseña.
  // Salida: vacío.
  // Descripción: Al iniciar sesión, almacena temporalmente el usuario
  // y contraseña para los headers en el interceptor
  almacenarClaveLogin(usuarioLogin: string, password: string): void{
    const passwordEncriptada = btoa(password);
    const datosLogin = btoa(usuarioLogin + ':' + passwordEncriptada);
    sessionStorage.setItem('Login', JSON.stringify(datosLogin));
  }

  // Entrada: Ninguna
  // Salida: lista de tipo string.
  // Descripción: Obtener los datos usuario y contraseña ingresados en el login.
  obtenerClaveLogin(): string{
    const claveLogin: string  = JSON.parse(sessionStorage.getItem('Login'));
    return claveLogin;
  }

  // Entrada: Ninguna
  // Salida: objeto tipo Usuario.
  // Descripción: Método para obtener el usuario que inicio de sesión del local storage.
  obtenerUsuarioLogueado(): Usuario{
    const desencriptar = atob(sessionStorage.getItem('usr'));
    const usuarioGuardado = JSON.parse(desencriptar);
    const usuario = usuarioGuardado !== 'null' ? usuarioGuardado : null;
    return usuario;
  }

  // Entrada: objeto JSON con datos de usuario.
  // Salida: objeto de tipo Usuario.
  // Descripción: Crea un objeto tipo Usuario a partir de los datos del parámetro.
  convertirDesdeJSON(datosUsuario: JSON): Usuario{
    return UsuarioM.usuarioDesdeJson(datosUsuario);
  }

  // Entrada: valor string.
  // Salida: Lista de tipo String con las coincidencias.
  // Descripción: verifica que la contraseña cumpla con un determinado formato.
  verificarFormatoPassword(password: string): string[]{
    const reg = new RegExp( /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)([A-Za-z\d]|[^ ]){8}$/);
    return reg.exec(password);
  }


}
