import { Component, Inject, OnInit, OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { DialogService } from '../../../services/dialog-service.service';
import { Cuadrilla } from '../../../Interfaces/ICuadrilla';
import { CuadrillaService } from '../../../services/cuadrilla.service';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../Interfaces/IUsuario';
import { CuadrillaM } from '../../../Models/CuadrillaM';
import { HttpErrorResponse } from '@angular/common/http';
import { TipoReporteService } from '../../../services/tipo-reporte.service';
import { TipoReporte } from 'src/app/Interfaces/ITipoReporte';
import { PermisoService } from '../../../services/permiso.service';

@Component({
  selector: 'app-dialog-ver-editar-nuevo-cuadrillas',
  templateUrl: './dialog-ver-editar-nuevo-cuadrillas.component.html',
  styleUrls: ['./dialog-ver-editar-nuevo-cuadrillas.component.css']
})
export class DialogVerEditarNuevoCuadrillasComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  accion: string;
  mensajeResultado: string;
  form: FormGroup;
  modificado: boolean;
  idListo: boolean;
  jefesCargados: boolean;
  tiposCargados: boolean;
  existeCuadrilla: boolean;
  procesando: boolean;
  finalProceso: boolean;
  error: boolean;
  cuadrilla: Cuadrilla;
  jefesCuadrillaDisp: Usuario[] = [];
  tiposCuadrilla: TipoReporte[];

  constructor(public dialogRef: MatDialogRef<DialogVerEditarNuevoCuadrillasComponent>,
              @Inject (MAT_DIALOG_DATA) private data,
              private dialogService: DialogService,
              private formBuilder: FormBuilder,
              private cuadrillaService: CuadrillaService,
              private usuarioService: UsuarioService,
              private permisoService: PermisoService,
              private tipoReporteService: TipoReporteService) {
                dialogRef.disableClose = true;
                this.buildForm();
               }

  ngOnInit(): void {
    this.accion = this.data.accion;
    this.procesando = false;
    this.finalProceso = false;
    this.error = false;
    this.ObtenerTiposCuadrilla();
    this.obtenerJefesCuadrilla();
    this.inicializarCampos();
    this.tipoFormularioAccion();
    }

  datosCargados(): boolean{
    let cargado: boolean;
    if ((this.jefesCargados && this.idListo && this.tiposCargados) && this.accion === 'nuevo' ||
        this.jefesCargados && this.tiposCargados && this.accion !== 'nuevo' ){
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
      nombreC: ['', [Validators.required, Validators.pattern('[a-zA-ZÀ-ÿ\u00f1\u00d1 ]*')]],
      encargado: ['', [Validators.required]],
      tipoCuadrilla: ['', [Validators.required]]
    });
    this.verificarCambiosFormulario();
    this.verificarCambiosNombre();

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
  // Descripción: Verifica si se ha interactuado con el formulario.
  verificarCambiosFormulario(): void{
    this.form.valueChanges
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(value => {
      if (this.form.dirty){
        this.modificado = true;
      }else{
        this.modificado = false;
      }
    });
  }

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción: Verifica si se ha interactuado con el formulario.
  verificarCambiosNombre(): void{
    this.campoNombreCuadrilla.valueChanges
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(nombre => {
      if (this.campoNombreCuadrilla.dirty){
        this.verificarExistenciaCuadrilla(nombre);
      }
    });
  }

// Entrada: string con el valor del input
// Salida: vacío.
// Descripción: Método que verifica si el campo ya interactuó con el usuario
//  y si la descripción de cuadrilla ya existe.
verificarExistenciaCuadrilla(nombre: string): void{
  if (nombre.length > 0){
    this.cuadrillaService.obtenerCuadrillaPorNombre(nombre)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe( res => {
      if (res !== null){
        this.existeCuadrilla = this.esCuadrillaDiferente(res);
      }else{
        this.existeCuadrilla = false;
      }
    }, (error: HttpErrorResponse) => {
      console.log('Error al verificar la existencia de cuadrilla con descripción.' + error.message);
    });
  }else {
    this.existeCuadrilla = false;
  }
}

// Entrada: cuadrilla con el valor del resultado de la consulta GET
// Salida: valor booleano.
// Descripción: método para verificar si los datos que se modificaron ya pertenecían a la misma cuadrilla
// que se está editando.
esCuadrillaDiferente(cuadrilla: Cuadrilla): boolean{
  let valor: boolean;
  if (this.accion === 'editar'){
    if (this.cuadrilla.ID_cuadrilla === cuadrilla.ID_cuadrilla){
      valor = false;
    }else{
      valor = true;
    }
  }else{
    valor = true;
  }
  return valor;
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
    this.cuadrillaService.obtenerIDRegistro()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe( (id: number) => {
      this.campoId.setValue(id);
      this.idListo = true;
    }, (error: HttpErrorResponse) => {
      alert('Se generó un problema al cargar ventana. Vuelva a cargar la página o solicite asistencia.');
      console.log('Error al obtener ID para nuevo registro de cuadrilla: ' + error.message);
    });
  }

// Entrada: Ninguna.
// Salida: vacío.
// Descripción: Llena la lista de Tipos de cuadrilla.
ObtenerTiposCuadrilla(): void{
  this.tipoReporteService.obtenerTiposReporte()
  .pipe(takeUntil(this.ngUnsubscribe))
  .subscribe(tipos => {
    this.tiposCuadrilla = tipos;
    this.tiposCargados = true;
  }, (error: HttpErrorResponse) => {
    alert('Se generó un problema al cargar ventana. Vuelva a cargar la página o solicite asistencia.');
    console.log('Error al cargar tipos de reporte para tipos de cuadrilla. Error: ' + error.message);
  });
}

// Entrada: Ninguna
// Salida: vacío.
// Descripción: Función para obtener la lista de los usuarios
// de tipo Jefe de cuadrilla que pueden ser asignados
  obtenerJefesCuadrilla(): void{
    this.usuarioService.obtenerJefesCuadrilla()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe( jefes => {
      jefes.forEach(jefe => {
        if (!jefe.Jefe_asignado && jefe.Estatus_usuario === true){
          this.jefesCuadrillaDisp.push(jefe);
        }
      });
      this.jefesCargados = true;
    }, (error: HttpErrorResponse) => {
      alert('Se generó un problema al cargar ventana. Vuelva a cargar la página o solicite asistencia.');
      console.log('Error al cargar jefes de cuadrilla. Error:' + error.message);
    });
  }

// Entrada: Ninguna
// Salida: vacío.
// Descripción: Método que obtiene el objeto Usuario del ID_JefeCuadrilla que la cuadrilla tiene asociado
// Y lo agrega a la lista de jefes de cuadrilla disponibles
  obtenerObjetoJefeActual(): void{
    if (this.cuadrilla.ID_JefeCuadrilla){
      this.usuarioService.obtenerUsuario(this.cuadrilla.ID_JefeCuadrilla)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe( usuario => {
        this.jefesCuadrillaDisp.push(usuario);
        this.campoEncargado.setValue(this.cuadrilla.ID_JefeCuadrilla);
      }, (error: HttpErrorResponse) => {
        alert('Se generó un problema al cargar ventana                                                                                                                                                                                                                                                                                                                . Vuelva a cargar la página o solicite asistencia.');
        console.log('Error al obtener usuario de Jefe de cuadrilla. Error:' + error.message);
      });
    } else{
      this.campoEncargado.setValue(0);
    }
  }

// Entrada: Ninguna
// Salida: valor boolean.
// Descripción: Devuelve true si el usuario interactuó con el formulario o false si no.
obtenerEstadoFormulario(): boolean{
  return this.modificado;
}

// Entrada: number para número de permiso
  // Salida: boolean
  // Descripción: Verifica si el usuario que entró al sistema tiene
  // permiso para el proceso que se pide.
  tienePermiso(proceso: number): boolean{
    const permiso: boolean = this.permisoService.verificarPermiso(proceso);
    return permiso;
  }

// Entrada: Ninguna
// Salida: boolean
// Descripción: Verifica si se cumplen las condiciones para activar o desactivar el botón,
// para remover el jefe de cuadrilla que está asignado.
desactivarJefeBtn(): boolean{
  // si ya tiene un jefe para quitar la asignación.
  const desactivarBtn: boolean = this.campoEncargado.value === 0 ? true : false;
  return desactivarBtn;
}

// Entrada: Ninguna.
// Salida: ninguna.
// Descripción: remueve el id del jefe de cuadrilla que se tenía asignado.
  removerJefe(): void {
    if (this.tienePermiso(14)){
      this.campoEncargado.setValue(0);
    }else{
      alert('No tiene permiso para ejecutar este proceso.');
    }
  }

// Entrada: valor de tipo number con el valor actual del input tipo cuadrilla.
// Salida: valor boolean
// Descripción: Verifica el valor actual del input para tipo de cuadrilla y activa el error si
// no se ha seleccionado un tipo de cuadrilla o lo retira.
errorTipoC(valor: number): boolean{
  let error: boolean;
  if (valor === 0){
    this.campoTipoCuadrilla.setErrors({required: true});
    error = true;
  }else{
    this.campoTipoCuadrilla.setErrors(null);
    error = false;
  }
  return error;
}

// Entrada: Ninguna
// Salida: Objeto de tipo CuadrillaM.
// Descripción: Método para crear un nuevo objeto cuadrilla para ser registrado
  generarNuevaCuadrilla(): CuadrillaM{
    const jefe = this.campoEncargado.value === 0 ? null : this.campoEncargado.value;
    return new CuadrillaM(
      this.campoId.value,
      this.campoNombreCuadrilla.value,
      !this.campoEstado.value,
      this.campoTipoCuadrilla.value,
      jefe,
      true
    );
  }

// Entrada: Ninguna
// Salida: Booleano
// Descripción: Deshabilita el botón guardar si
// el formulario fue accedido para ver información, si se está procesando
// una actualización o alta, o si ya se ha concluido un proceso.
deshabilitarGuardar(): boolean{
  let deshabilitar: boolean;
  if (this.accion === 'ver' || this.procesando || this.finalProceso) {
    deshabilitar = true;
  }else{
    deshabilitar = false;
  }
  return deshabilitar;
}

// Entrada: Ninguna
// Salida: vacío.
// Descripción: Método que se llama cuando se le da click en guardar en el formulario.
// Aquí se llama al método "accionGuardar" para ejecutar las acciones pertinente
// a guardar los datos de la cuadrilla.
guardar(): void {
  // event.preventDefault();
  if (this.camposValidos()){
    this.procesando = true;
    this.accionGuardar();
  } else{
    alert('Verifique que los campos tengan la información correcta o estén llenos.');
  }
}

// Entrada: Ninguna.
// Salida: valor boolean.
// Descripción: verifica que los campos estén llenos correctamente o
// que no existan errores en los campos.
camposValidos(): boolean{
  let sonValidos = true;
  // Verificar que se llenaron los campos del formulario.
  if (!this.form.valid){
    this.form.markAllAsTouched();
    sonValidos = false;
  }
  // Verificar nombre de cuadrilla
  if (this.existeCuadrilla){
    sonValidos = false;
  }
  return sonValidos;
}

// Entrada: Ninguna
// Salida: vacío.
// Descripción: Método que llama al servicio Cuadrilla para peticiones HTTP
accionGuardar(): void{
  const cuadrilla = this.generarNuevaCuadrilla();
  if (this.accion === 'nuevo'){
    this.cuadrillaService.insertarCuadrilla(cuadrilla)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe( res => {
      this.procesando = false;
      this.finalProceso = true;
      this.mensajeResultado = res;
    }, (error: HttpErrorResponse) => {
      this.procesando = false;
      this.finalProceso = true;
      this.error = true;
      this.mensajeResultado = 'El registro no pudo ser completado. Vuelva a intentarlo ó solicite asistencia.';
      console.log('Error al registrar nueva cuadrilla:' + error.message);
    });
  } else{
    this.cuadrillaService.actualizarCuadrilla(cuadrilla)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe( res => {
      this.procesando = false;
      this.finalProceso = true;
      this.mensajeResultado = res;
    }, (error: HttpErrorResponse) => {
      this.procesando = false;
      this.finalProceso = true;
      this.error = true;
      this.mensajeResultado = 'La cuadrilla no pudo ser actualizada. Vuelva a intentarlo ó solicite asistencia.';
      console.log('Error al actualizar cuadrilla:' + error.message);
    });
  }
  this.modificado = false; // los datos se han guardado, no hay necesidad de prevenir pérdida de datos.
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

ngOnDestroy(): void {
  this.ngUnsubscribe.next();
  this.ngUnsubscribe.complete();
}

}
