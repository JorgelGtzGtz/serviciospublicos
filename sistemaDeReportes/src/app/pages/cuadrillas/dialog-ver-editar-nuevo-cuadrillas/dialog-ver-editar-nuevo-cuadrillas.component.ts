import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { DialogService } from '../../../services/dialog-service.service';
import { Cuadrilla } from '../../../Interfaces/ICuadrilla';
import { CuadrillaService } from '../../../services/cuadrilla.service';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../Interfaces/IUsuario';
import { CuadrillaM } from '../../../Models/CuadrillaM';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-dialog-ver-editar-nuevo-cuadrillas',
  templateUrl: './dialog-ver-editar-nuevo-cuadrillas.component.html',
  styleUrls: ['./dialog-ver-editar-nuevo-cuadrillas.component.css']
})
export class DialogVerEditarNuevoCuadrillasComponent implements OnInit {
  accion: string;
  form: FormGroup;
  modificado: boolean;
  idListo: boolean;
  jefesCargados: boolean;
  cuadrilla: Cuadrilla;
  jefesCuadrillaDisp: Usuario[] = [];
  tipoCuadrilla: any = [1, 2, 3, 4];

  constructor(public dialogRef: MatDialogRef<DialogVerEditarNuevoCuadrillasComponent>,
              @Inject (MAT_DIALOG_DATA) private data,
              private dialogService: DialogService,
              private formBuilder: FormBuilder,
              private cuadrillaService: CuadrillaService,
              private usuarioService: UsuarioService) {
                dialogRef.disableClose = true;
                this.buildForm();
               }

  ngOnInit(): void {
    this.accion = this.data.accion;
    this.obtenerJefesCuadrilla();
    this.inicializarCampos();
    this.tipoFormularioAccion();
    }

  datosCargados(): boolean{
    let cargado: boolean;
    if ((this.jefesCargados && this.idListo) && this.accion === 'nuevo' ||
        this.jefesCargados && this.accion !== 'nuevo' ){
      cargado = true;
    } else{
      cargado = false;
    }
    return cargado;

  }

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción: Método que inicializa el Form Reactive con los controladores para los inputs del
  // formulario
  private buildForm(): void{
    this.form = this.formBuilder.group({
      id: [0, [Validators.required]],
      estado: [''],
      nombreC: ['', [Validators.required]],
      encargado: ['', [Validators.required]],
      tipoCuadrilla: ['', [Validators.required]]
    });
    this.form.valueChanges.subscribe(value => {
      if (this.form.touched){
        console.log('se interactuo');
        this.modificado = true;
      }else{
        this.modificado = false;
      }
    });
  }

// Entrada: Ninguna
// Salida: control de tipo AbstractControl.
// Descripción: Métodos para obtener acceso a los controladores relacionados a los
// inputs del formulario.
get campoId(): AbstractControl{
  return this.form.get('id');
}

get campoEstado(): AbstractControl{
  return this.form.get('estado');
}

get campoNombreCuadrilla(): AbstractControl{
  return this.form.get('nombreC');
}

get campoEncargado(): AbstractControl{
  return this.form.get('encargado');
}

get campoTipoCuadrilla(): AbstractControl{
  return this.form.get('tipoCuadrilla');
}

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción: Método para inicializar los valores de los campos
  inicializarCampos(): void{
    if (this.accion !== 'nuevo'){
      this.obtenerObjetoCuadrilla();
      this.campoNombreCuadrilla.setValue(this.cuadrilla.Nombre_cuadrilla);
      this.campoId.setValue(this.cuadrilla.ID_cuadrilla);
      this.campoEstado.setValue(!this.cuadrilla.Estatus_cuadrilla);
      this.campoTipoCuadrilla.setValue(this.cuadrilla.Tipo_cuadrilla);
      this.campoEncargado.setValue(this.cuadrilla.ID_JefeCuadrilla);
      this.campoTipoCuadrilla.setValue(this.cuadrilla.Tipo_cuadrilla);
      this.obtenerObjetoJefeActual();
    }else{
      this.campoEstado.setValue(false);
      this.campoEncargado.setValue(0);
      this.campoTipoCuadrilla.setValue(0);
      this.obtenerIDNuevo();

    }
  }

// Entrada: Ninguna
// Salida: vacío.
// Descripción: Este método habilita o deshabilita el formulario según lo que se quiera hacer en el
//  ya sea ver información, crear nuevo registro o editar.
//  En "ver" todos los campos aparecen deshabilitados y en "nuevo" el único deshabilitado
//  es "activar"
tipoFormularioAccion(): void{
  switch (this.accion){
    case 'ver':
      this.form.disable();
      break;
    case 'nuevo':
      this.campoEstado.setValue(false);
      this.campoEstado.disable();
      this.campoId.disable();
      break;
    default:
      this.form.enable();
      this.campoId.disable();
  }
}

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción: Método para generar un objeto Cuadrilla a partir
  // de los datos obtenidos como parámetro en el dialog.
  obtenerObjetoCuadrilla(): void{
    this.cuadrilla = this.cuadrillaService.convertirDesdeJSON(this.data.cuadrilla);
  }

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción: Función para obtener el ID del nuevo registro
  obtenerIDNuevo(): void{
    this.cuadrillaService.obtenerIDRegistro().subscribe( (id: number) => {
      this.campoId.setValue(id);
      this.idListo = true;
    }, (error: HttpErrorResponse) => {
      alert('No ha sido posible cargar la página correctamente. Vuelva a cargar la página o solicite asistencia.');
      console.log('Error al obtener ID para nuevo registro de cuadrilla: ' + error.message);
    });
  }

// Entrada: Ninguna
// Salida: vacío.
// Descripción: Función para obtener la lista de los usuarios
// de tipo Jefe de cuadrilla que pueden ser asignados
  obtenerJefesCuadrilla(): void{
    this.usuarioService.obtenerJefesCuadrilla().subscribe( jefes => {
      jefes.forEach(jefe => {
        this.jefesCuadrillaDisp.push(jefe);
      });
      this.jefesCargados = true;
    }, (error: HttpErrorResponse) => {
      alert('No ha sido posible cargar la página correctamente. Vuelva a cargar la página o solicite asistencia.');
      console.log('Error al cargar jefes de cuadrilla. Error:' + error.message);
    });
  }

// Entrada: Ninguna
// Salida: vacío.
// Descripción: Método que obtiene el objeto Usuario del ID_JefeCuadrilla que la cuadrilla tiene asociado
// Y lo agrega a la lista de jefes de cuadrilla disponibles
  obtenerObjetoJefeActual(): void{
    this.usuarioService.obtenerUsuario(this.cuadrilla.ID_JefeCuadrilla).subscribe( usuario => {
      this.jefesCuadrillaDisp.push(usuario);
    }, (error: HttpErrorResponse) => {
      alert('No ha sido posible cargar la página correctamente. Vuelva a cargar la página o solicite asistencia.');
      console.log('Error al obtener usuario de Jefe de cuadrilla. Error:' + error.message);
    });
  }

// Entrada: Ninguna
// Salida: valor boolean.
// Descripción: Devuelve true si el usuario interactuó con el formulario o false si no.
obtenerEstadoFormulario(): boolean{
  return this.modificado;
}

// Entrada: Ninguna
// Salida: Objeto de tipo CuadrillaM.
// Descripción: Método para crear un nuevo objeto cuadrilla para ser registrado
  generarNuevaCuadrilla(): CuadrillaM{
    return new CuadrillaM(
      this.campoId.value,
      this.campoNombreCuadrilla.value,
      !this.campoEstado.value,
      this.campoTipoCuadrilla.value,
      this.campoEncargado.value,
      true
    );
  }

// Entrada: Ninguna
// Salida: vacío.
// Descripción: Método que se llama cuando se le da click en guardar en el formulario.
// Aquí se llama al método "accionGuardar" para ejecutar las acciones pertinente
// a guardar los datos de la cuadrilla.
guardar(): void {
  // event.preventDefault();
  if (this.form.valid){
    this.accionGuardar();
  } else{
    this.form.markAllAsTouched();
  }
}

// Entrada: Ninguna
// Salida: vacío.
// Descripción: Método que llama al servicio Cuadrilla para peticiones HTTP
accionGuardar(): void{
  const cuadrilla = this.generarNuevaCuadrilla();
  if (this.accion === 'nuevo'){
    this.cuadrillaService.insertarCuadrilla(cuadrilla).subscribe( res => {
      alert('¡Registro de cuadrilla ' + cuadrilla.Nombre_cuadrilla + ' exitoso!');
      this.dialogRef.close(this.data);
    }, (error: HttpErrorResponse) => {
          alert('El registro no pudo ser completado. Verifique los datos o solicite asistencia.');
          console.log('Error al registrar nueva cuadrilla:' + error.message);
    });
  } else{
    this.cuadrillaService.actualizarCuadrilla(cuadrilla).subscribe( res => {
      alert('¡Cuadrilla ' + cuadrilla.Nombre_cuadrilla  + ' se han actualizado exitosamente!');
      this.dialogRef.close(this.data);
    }, (error: HttpErrorResponse) => {
      alert('Los datos de la cuadrilla no pudieron ser actualizados. Verifique los datos o solicite asistencia.');
      console.log('Error al actualizar cuadrilla:' + error.message);
    });
  }
}

// Entrada: Ninguna
// Salida: vacío.
// Descripción:  Método que a través del método "verificarCambios" del servicio de DialogService
// verifica si el usuario interactuó con el formulario.
// Si la interacción sucedió se despliega un mensaje de confirmación.
// Cierra el dialog.
cerrarDialog(): void{
  this.dialogService.verificarCambios(this.dialogRef);
}

}
