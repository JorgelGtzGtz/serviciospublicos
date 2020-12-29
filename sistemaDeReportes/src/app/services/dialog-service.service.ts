import { Injectable } from '@angular/core';
import { MatDialog, MatDialogRef, MatDialogState } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class DialogService {
  modificado: boolean; // para saber si el usuario ya modificó el formulario

  constructor(private dialog: MatDialog) {
  }

  // Entrada: Ninguna
  // Salida: valor tip boolean.
  // Descripción: Método que se llama al querer cambiar de ruta en el sidebar
  // es un metodo que llamará al método "VerificarDialogsAbiertos()" para verificar
  // si existen dialogs abiertos.
verificarDialogs(): boolean{
  let permisoParaNavegar: boolean;
  permisoParaNavegar = this.verificarDialogsAbiertos();
  return permisoParaNavegar;

}

// Entrada: Ninguna
// Salida: valor booleano.
// Descripción: Método que verifica si existen dialogs abiertos, si los hay,
// llama al método "obtenerDialogAbierto()" para encontrar el dialog en uso.
// Después, llama al método "verificarCambios" para saber si el usuario
// ha interactuado con el formulario y evitar que pierda datos.
  verificarDialogsAbiertos(): boolean{
    let navegar: boolean;
    let dialogAbierto;
    if (this.dialog.openDialogs.length > 0){
      dialogAbierto = this.obtenerDialogAbierto();
      navegar = this.verificarCambios(dialogAbierto);
    }else{
      navegar = true;
    }
    return navegar;
  }

  // Entrada: Ninguna
  // Salida: valor tipo MatDialogRef con referencia de Dialog abierto.
  // Descripción: Método que permite obtener el dialog que se encuentra 
  // abierto actualmente, con estado OPEN.
  obtenerDialogAbierto(): MatDialogRef<any, any>{
    for (let d of this.dialog.openDialogs) {
      if (d.getState() === MatDialogState.OPEN ){
        console.log('dialog abierto:', d);
        return d;
      }
    }
  }

  // Entrada: valor tipo MatDialogRef<any,any> con referencia de dialog abierto.
  // Salida: valor booleano.
  // Descripción: Este método verifica si la variable "modificado" que existe en el componente del dialog
  //  es true o false; si es true, manda a llamar el método "mostrarMensajeConfirmacion"
  //  para permitir que el usuario decida si quiere salir de la página actual con el dialog abierto
  //  o cambiar de página, aunque esto implique que el dialog se cierra sin guardar cambios.
  verificarCambios(dialogAbierto: MatDialogRef<any, any>): boolean{
    let navegar: boolean;
    let d;
    d = dialogAbierto.componentInstance; // Con esto se accede al componente del dialog
    if (d.obtenerEstadoFormulario()){
        navegar = this.mostrarMensajeConfirmacion(dialogAbierto);
      }else{
        dialogAbierto.close();
        navegar =  true;
      }
    return navegar;
  }

  // Entrada: Valor tipo MatDialogRef<any,any> con la referencia del dialog abierto.
  // Salida: valor tipo boolean.
  // Descripción: Este método lanza un mensaje al usuario, si éste modificó el formulario
  // que contiene el dialog, en este mensaje se le pide confirme su decisión de salir.
  // Al ser una respuesta true, los dialogs abiertos se cierra y regresa un true.
  // Al ser false, los dialogs se quedan abiertos y regresa un false.
  mostrarMensajeConfirmacion(dialogAbierto: MatDialogRef<any, any>): boolean{
    const respuesta = confirm('¿Está seguro que desea salir?');
    if (respuesta){
      dialogAbierto.close();
      return true;
    }else{
      return false;
    }

  }
}
