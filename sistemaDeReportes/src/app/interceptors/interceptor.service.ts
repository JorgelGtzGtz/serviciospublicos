import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UsuarioService } from '../services/usuario.service';
import { UsuarioM } from '../Models/UsuarioM';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {
  datosLogin: string [];
  constructor(private usuarioService: UsuarioService) {
    this.datosLogin = this.usuarioService.obtenerDatosLogin();
   }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const headers = new HttpHeaders({
      Authorization : 'Basic ' + btoa(this.datosLogin[0] + ':' + this.datosLogin[1]),
      'Content-Type': 'application/json'
    });
    console.log('INTERCEPTOR');
    const reqClone = req.clone({
      headers
    });

    return next.handle(reqClone).pipe(
      catchError(this.manejarError)
    );
  }

  manejarError(error: HttpErrorResponse){
    console.warn(error);
    return throwError('Error en dirección de acceso');
  }
}
