import { Component, ElementRef, Inject, OnInit, OnDestroy } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { DialogService } from '../../../services/dialog-service.service';
import { TipoUsuarioService } from '../../../services/tipo-usuario.service';
import { ProcesoPermisoService } from '../../../services/proceso-permiso.service';
import { TipoUsuario } from '../../../Interfaces/ITipoUsuario';
import { ProcesoPermiso } from 'src/app/Interfaces/IProcesoPermiso';
import { PermisoService } from '../../../services/permiso.service';
import { TipoUsuarioM } from '../../../Models/TipoUsuarioM';
import { HttpErrorResponse } from '@angular/common/http';
import { debounceTime } from 'rxjs/operators';


@Component({
  selector: 'app-dialog-ver-editar-nuevo',
  templateUrl: './dialog-ver-editar-nuevo.component.html',
  styleUrls: ['./dialog-ver-editar-nuevo.component.css']
})
export class DialogVerEditarNuevoComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  listaProcesos: ProcesoPermiso[] = [];
  listaProcTipo: ProcesoPermiso[] = [];
  procesosSistema: ProcesoPermiso[] = [];
  elementoLista: ProcesoPermiso;
  accion: string;
  mensajeResultado: string;
  idListo: boolean;
  procesosYpermisos: boolean;
  modificado: boolean;
  existeDescripcion: boolean;
  errorListas: boolean;
  procesando: boolean;
  finalProceso: boolean;
  error: boolean;
  form: FormGroup;
  tipoUsuario: TipoUsuario;

  constructor(public dialogRef: MatDialogRef<DialogVerEditarNuevoComponent> ,
              @Inject (MAT_DIALOG_DATA) private data,
              private dialogService: DialogService,
              private elementoReferencia: ElementRef,
              private formBuilder: FormBuilder,
              private tipoService: TipoUsuarioService,
              private procesoServicio: ProcesoPermisoService,
              private permisoService: PermisoService) {
    this.buildForm();
   }

   ngOnInit(): void {
     this.accion = this.data.accion;
     this.procesando = false;
     this.finalProceso = false;
     this.error = false;
     this.tipoFormularioAccion();
     this.inicializarCampos();
     this.obtenerProcesosSistema();
    }

// Entrada: ninguna.
// Salida: valor boolean.
// Descripción: verifica que la información del formulario
// se encuentre lista para poder mostrarla al usuario.
  datosCargados(): boolean{
    let cargado: boolean;
    if ((this.procesosYpermisos && this.idListo) && this.accion === 'nuevo' ||
        this.procesosYpermisos && this.accion !== 'nuevo'){
        cargado = true;
    }else{
        cargado = false;
    }
    return cargado;
    }

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción: Inicializa el formulario reactivo, aquí es donde se crean los controladores de los inputs
  private buildForm(): void{
    this.form = this.formBuilder.group({
      id: [0],
      descripcion: ['', [Validators.required, Validators.pattern('[a-zA-ZÀ-ÿ\u00f1\u00d1 ]*')]],
      estado: ['']
    });
    this.verificarCambiosFormulario();
    this.verificarCambiosDescripcion();
  }

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción: Verifica si se ha interactuado con el formulario.
  verificarCambiosFormulario(): void{
    this.form.valueChanges
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(value => {
      if (this.form.touched){
        this.modificado = true;
      }else{
        this.modificado = false;
      }
    });
  }

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción: Verifica si se ha interactuado con campo descripción.
  verificarCambiosDescripcion(): void{
    this.campoDescripcion.valueChanges
    .pipe(debounceTime(500), takeUntil(this.ngUnsubscribe))
    .subscribe( descripcion => {
      if (this.campoDescripcion.dirty){
        this.verificarExistenciaTipo(descripcion);
      }
    });
  }

// Entrada: string con el valor del input
// Salida: vacío.
// Descripción: Método que verifica si el campo ya interactuó con el usuario
//  y si la descripción de Tipo ya existe.
verificarExistenciaTipo(descripcion: string): void{
  if (descripcion.length > 0){
    this.tipoService.obtenerTipoUPorDesc(descripcion)
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe( res => {
      if (res !== null){
        this.existeDescripcion = this.esTipoDiferente(res);
      }else{
        this.existeDescripcion = false;
      }
    }, (error: HttpErrorResponse) => {
      console.log('Error al verificar la existencia de tipo con descripción.' + error.message);
    });
  }else {
    this.existeDescripcion = false;
  }
}

// Entrada: Tipo de Usuario con el valor del resultado de la consulta GET
// Salida: vacío.
// Descripción" método para verificar si el nombre que se asigna pertenece al tipo de usuario actual.
// con el propósito de evitar que al modificar y volver a escribirlo igual salga
// el error de que ya existe.
esTipoDiferente(tipoU: TipoUsuario): boolean{
  let valor: boolean;
  if (this.accion === 'editar'){
    if (this.tipoUsuario.ID_tipoUsuario === tipoU.ID_tipoUsuario){
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
  // Descripción: Método para inicializar los campos del formulario.
  inicializarCampos(): void{
    if (this.accion !== 'nuevo'){
      this.campoId.setValue( this.tipoUsuario.ID_tipoUsuario);
      this.campoEstado.setValue(!this.tipoUsuario.Estatus_tipoUsuario);
      this.campoDescripcion.setValue(this.tipoUsuario.Descripcion_tipoUsuario);
    } else{
      this.campoEstado.setValue(false);
      this.obtenerIDNuevo();
    }
  }

  // Entrada: Ninguna
  // Salida: control de tipo AbstractControl.
  // Descripción: Métodos para obtener acceso a los controles que se encuentran relacionados
  // al formulario.
  get campoId(): AbstractControl{
    return this.form.get('id');
  }

  get campoDescripcion(): AbstractControl{
    return this.form.get('descripcion');
  }

  get campoEstado(): AbstractControl{
    return this.form.get('estado');
  }

// Entrada: Ninguna
// Salida: vacío.
// Descripción: Este método habilita o deshabilita el formulario según lo que se quiera hacer en el.
tipoFormularioAccion(): void{
  switch (this.accion){
    case 'ver':
      this.form.disable();
      this.tipoUsuario = this.data.tipoU;
      break;
    case 'nuevo':
      this.campoEstado.disable();
      this.campoId.disable();
      break;
    default:
      this.form.enable();
      this.campoId.disable();
      this.tipoUsuario = this.data.tipoU;
  }
}

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción: Método para obtener el ID del nuevo registro.
  obtenerIDNuevo(): void{
    this.tipoService.obtenerIDRegistro()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe( (id: number) => {
      this.campoId.setValue(id);
      this.idListo = true;
    });
  }

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción:Método para obtener los procesos del sistema
  obtenerProcesosSistema(): void{
    this.procesoServicio.obtenerProcesosLista()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe( procesos => {
      this.procesosSistema = procesos;
      if (this.accion !== 'nuevo'){
        this.obtenerPermisosActuales(procesos);
      }else {
        this.obtenerProcesosNuevoRegistro(procesos);
        this.procesosYpermisos = true;
      }
    });
  }

  // Entrada: lista de tipo ProcesoPermiso
  // Salida: vacío.
  // Descripción: Inicializa la lista listaProcesos para un nuevo registro.
  // en esta se encuentran todos los procesos del sistema en general.
  obtenerProcesosNuevoRegistro(procesos: ProcesoPermiso[]): void{
      procesos.forEach(proceso => {
        this.listaProcesos.push(proceso);
      });
  }

  // Entrada: Lista de tipo ProcesoPermiso.
  // Salida: Vacío.
  // Descripción: Método para inicializar la lista de procesos. En esta lista se
  // encuentran los procesos que quedan sin seleccionar para el tipo de usuario.
   obtenerProcesosDisponibles(procesos: ProcesoPermiso[]): void{
     this.listaProcesos = this.procesoServicio.procesosDisponibles(procesos, this.listaProcTipo );
     this.procesosYpermisos = true;
   }

  // Entrada: Lista de tipo ProcesoPermiso.
  // Salida: vacío.
  // Descripción: Método para obtener los permisos actuales del tipo Usuario
   obtenerPermisosActuales(procesos: ProcesoPermiso[]): void{
       this.permisoService.obtenerPermisosTipo(this.tipoUsuario.ID_tipoUsuario)
       .pipe(takeUntil(this.ngUnsubscribe))
       .subscribe( permisos => {
         this.listaProcTipo = this.procesoServicio.descripcionPermiso(procesos, permisos);
         this.obtenerProcesosDisponibles(procesos);
       },
       err => {
         console.error(err);
         alert('Se ha generado un problema al cargar el tipo de usuario. Intente de nuevo o solicite asistencia.');
       });
   }

// Entrada: Ninguna.
// Salida: valor boolean.
// Descripción: Devuelve true si el usuario interactuó con el formulario o false si no.
 obtenerEstadoFormulario(): boolean{
  return this.modificado;
}

// Entrada: Ninguna.
// Salida: vacío.
// Descripción: Método que verifica si se han asignado procesos a tipo de usuario.
listaTienePermisos(): void{
  if (this.listaProcTipo.length === 0){
    this.errorListas = true;
  } else{
    this.errorListas = false;
  }
}

// Entrada: Evento.
// Salida: vacío.
// Descripción: Función para recibir el item que fue seleccionado en una de las listas
// Le agrega una clase CSS para cambiar apariencia y recupera los datos del proceso seleccionado.
  itemSeleccionado(e: Event): void{
    this.cambiarAspectoLista();
    const ELEMENT  = (e.target as Element);
    ELEMENT.classList.add('item-selected');
    this.elementoLista = this.procesoServicio.obtenerProceso(ELEMENT.innerHTML, this.procesosSistema);
  }

  // Entrada: Lista de tipo ProcesoPermiso.
  // Salida: vacío.
  // Descripción: Cambia el aspecto de los elementos de la lista.
  // Al seleccionar uno nuevo, quita la clase .item-selected de aquellos elementos que lo tenían
  cambiarAspectoLista(): void{
    const coincidenciasQuery = this.elementoReferencia.nativeElement.querySelectorAll('li.item-selected');
    if (coincidenciasQuery.lenght !== null){
      for (let li of coincidenciasQuery){
        li.classList.remove('item-selected');
      }
    }
  }

  // Entrada: Lista de tipo ProcesoPermiso.
  // Salida: valor boolean.
  // Descripción: Función que verifica que el elemento de la lista seleccionado,
  // se quiera transferir a la lista contraria.
  existenciaEnLista(listaOrigen: ProcesoPermiso[]): boolean{
    let validacionExistencia: boolean;
    if (listaOrigen.includes(this.elementoLista)){
      validacionExistencia =  true;
    }else{
      alert('OPERACION INVALIDA; debe seleccionar elemento de lista contraria para transferir.');
      validacionExistencia = false;
    }
    return validacionExistencia;
  }

  // Entrada: Ninguna.
  // Salida: vacío.
  // Descripción: Método para transferir un elemento de lista A a lista B.
  cambiarListAListB(): void{
    if (this.elementoLista !== undefined){
      const validacion = this.existenciaEnLista(this.listaProcesos);
      if (validacion){
          this.modificarListas(this.listaProcesos, this.listaProcTipo);
          this.listaTienePermisos();
          this.modificado = true;
        }
    }else{
      alert('Debe seleccionar un proceso para poder asignarlo.');
    }
  }

  // Entrada: Ninguna.
  // Salida: vacío.
  // Descripción: Método para transferir un elemento de lista B a lista A.
  cambiarListBListA(): void{
    if (this.elementoLista !== undefined){
        const validacion = this.existenciaEnLista(this.listaProcTipo);
        if (validacion){
          this.modificarListas(this.listaProcTipo, this.listaProcesos);
          this.listaTienePermisos();
          this.modificado = true;
          }
    }else{
      alert('Debe seleccionar un proceso para poder asignarlo.');
    }
  }

  // Entrada: Ninguna.
  // Salida: vacío.
  // Descripción: Método para ejecutar los procesos de cambio del elemento de la lista
  // origen a la lista destino
  modificarListas(listaOrigen: ProcesoPermiso[], listaDestino: ProcesoPermiso[]): void{
    listaDestino.push(this.elementoLista);
    const index: number = listaOrigen.indexOf(this.elementoLista);
    listaOrigen.splice(index, 1);
    this.elementoLista = undefined;
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

  // Entrada: Ninguna.
  // Salida: vacío.
  // Descripción: Método que guarda las modificaciones o acciones hechas en el dialog
guardar(): void {
  // event.preventDefault();
  this.listaTienePermisos();
  if (this.camposValidos()){
    this.procesando = true;
    const tipo = this.generarTipo();
    this.accionGuardar(tipo);
  }else{
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

  // Verificar que se asignaron procesos
  if (this.errorListas){
    sonValidos = false;
  }

  // Verificar que la descripción de Tipo de usuario no existe.
  if (this.existeDescripcion){
    sonValidos = false;
  }
  return sonValidos;
}

// Entrada: Ninguna.
// Salida: objeto Tipo usuario.
// Descripción: Método para generar un nuevo objeto de Tipo Usuario
// con los datos de los campos del formulario.
generarTipo(): TipoUsuarioM{
  const estado = !this.campoEstado.value;
  return new TipoUsuarioM(
    this.campoId.value,
    this.campoDescripcion.value,
    estado,
    true
  );
}

// Entrada: Objeto Tipo Usuario.
// Salida: vacío.
// Descripción: Método para ejecutar los procesos pertinentes a actualización
// o registro de un Tipo de Usuario.
accionGuardar(tipo: TipoUsuario): void{
  if (this.accion === 'nuevo'){
      this.tipoService.insertarTipoUsuario(tipo, this.listaProcTipo)
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
        console.log('Error al registrar tipo de usuario. Error:' + error.message);
      });
  }else if (this.accion === 'editar'){
      this.tipoService.actualizarTipoUsuario(tipo, this.listaProcTipo)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(res => {
        this.procesando = false;
        this.finalProceso = true;
        this.mensajeResultado = res;
      }, (error: HttpErrorResponse) => {
        this.procesando = false;
        this.finalProceso = true;
        this.error = true;
        this.mensajeResultado = 'El registro no pudo ser completado. Vuelva a intentarlo ó solicite asistencia.';
        console.log('Tipo de usuario no pudo ser actualizado. Error:' + error.message);
      });
  }
  this.modificado = false; // los datos se han guardado, no hay necesidad de prevenir pérdida de datos.
}

// Entrada: Ninguna.
// Salida: vacío.
// Descripción: Método que a través del método "verificarCambios" del servicio de DialogService
// verifica si el usuario interactuó con el formulario.
// Si la interacción sucedió se despliega un mensaje de confirmación.
cerrarDialog(): void{
  this.dialogService.verificarCambios(this.dialogRef);
}

ngOnDestroy(): void {
  this.ngUnsubscribe.next();
  this.ngUnsubscribe.complete();
}
}
