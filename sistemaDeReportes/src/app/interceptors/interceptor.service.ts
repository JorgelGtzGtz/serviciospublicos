import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UsuarioService } from '../services/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {
  datosLogin: string [];
  constructor(private usuarioService: UsuarioService) {
    this.datosLogin = this.usuarioService.obtenerDatosLogin();
   }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.indexOf('http://localhost:50255/api') === -1) {
      return next.handle(req).pipe(
        catchError(this.manejarError)
      );
    }else{
      const headers = new HttpHeaders({
        Authorization : 'Basic ' + btoa(this.datosLogin[0] + ':' + this.datosLogin[1])
      });
      const reqClone = req.clone({
        headers
      });
  
      return next.handle(reqClone).pipe(
        catchError(this.manejarError)
      );
    }
  }

  manejarError(error: HttpErrorResponse){
    console.warn(error);
    return throwError('Error en dirección de acceso');
  }
}
