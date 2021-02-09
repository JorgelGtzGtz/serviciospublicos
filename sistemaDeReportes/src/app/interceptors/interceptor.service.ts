import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {
  claveLogin: string;
  constructor(private usuarioService: UsuarioService) {
   }

  // Entrada: valor de tipo HttpRequest y HttpHandler.
  // Salida: Observable con el evento HttpEvent.
  // Descripción: Método de interceptor que interviene en las peticiones Http
  // Agrega los headers si es necesario.
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.claveLogin = this.usuarioService.obtenerClaveLogin();

    if (req.url.indexOf('http://localhost:50255/api') === -1) {
      return next.handle(req).pipe(
        catchError(this.manejarError)
      );
    }else{
      const headers = new HttpHeaders({
        Authorization : 'Basic ' + this.claveLogin
      });
      const reqClone = req.clone({
        headers
      });
      return next.handle(reqClone).pipe(
        catchError(this.manejarError)
      );
    }
  }

  // Entrada: valor de tipo HttpErrorResponse.
  // Salida: Observable.
  // Descripción: Método para manejar un error en caso de presentarse.
  manejarError(error: HttpErrorResponse): Observable<never>{
    let mensajeError: string;
    if (error.status === 0){
      mensajeError = 'Se ha perdido la conexión con el servidor. Intente de nuevo más tarde ó solicite asistencia.';
      alert(mensajeError);
    }else{
      mensajeError = 'Se ha generado un un problema al acceder a la información solicitada. Vuelva a intentarlo o solicite asistencia.';
    }
    console.warn(error);
    return throwError(mensajeError);
  }
}
