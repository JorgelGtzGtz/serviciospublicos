import { Component, OnInit, OnDestroy, Inject, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { DialogService } from '../../../services/dialog-service.service';
import { SectorService } from '../../../services/sector.service';
import { TipoReporteService } from '../../../services/tipo-reporte.service';
import { ReporteService } from '../../../services/reporte.service';
import { MapService } from 'src/app/services/map.service';
import { UsuarioService } from '../../../services/usuario.service';
import { Sector } from '../../../Interfaces/ISector';
import { TipoReporte } from '../../../Interfaces/ITipoReporte';
import { Reporte } from '../../../Interfaces/IReporte';
import { HttpErrorResponse } from '@angular/common/http';
import { TicketM } from '../../../Models/TicketM';
import { UsuarioM } from '../../../Models/UsuarioM';
import { Imagen } from '../../../Interfaces/IImagen';
import { ImagenService } from '../../../services/imagen.service';
import { PermisoService } from '../../../services/permiso.service';


@Component({
  selector: 'app-dialog-ver-editar-nuevo-alta-reportes',
  templateUrl: './dialog-ver-editar-nuevo-alta-reportes.component.html',
  styleUrls: ['./dialog-ver-editar-nuevo-alta-reportes.component.css']
})
export class DialogVerEditarNuevoAltaReportesComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  @ViewChild('inputFile') inputFile: ElementRef;
  reporte: Reporte;
  idListo: boolean;
  modificado: boolean;
  mostrarImgApertura: boolean;
  mostrarImgCierre: boolean;
  procesando: boolean;
  finalProceso: boolean;
  error: boolean;
  estadoReporte: number;
  accion: string;
  mensajeResultado: string;
  pathImgApertura: string[] = [];
  pathImgCierre: string[] = [];
  imagenesApertura: Imagen [] = [];
  imagenesCierre: Imagen [] = [];
  listaTiposR: TipoReporte[] = [];
  listaSectores: Sector[] = [];
  coordenadas: number[] = [];
  uploadedImg: string[] = [];
  form: FormGroup;

  constructor(public dialogRef: MatDialogRef <DialogVerEditarNuevoAltaReportesComponent>,
              @Inject (MAT_DIALOG_DATA) private data,
              private dialogService: DialogService,
              private sectorService: SectorService,
              private tipoReporteService: TipoReporteService,
              private reporteSevice: ReporteService,
              private usuarioService: UsuarioService,
              private mapService: MapService,
              private imagenService: ImagenService,
              private permisoService: PermisoService,
              private formBuilder: FormBuilder,
              private renderer: Renderer2 ) {
      dialogRef.disableClose = true;
      this.buildForm();
     }

  ngOnInit(): void {
    this.accion = this.data.accion;
    this.procesando = false;
    this.finalProceso = false;
    this.error = false;
    this.obtenerSectoresYTiposRep();
    this.inicializarCampos();
    this.tipoFormularioAccion();
  }

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción: Método que inicializa el objeto de tipo FormGroup para
  // obtener y establecer información en el formulario.
  private buildForm(): void{
    this.form = this.formBuilder.group({
      id: ['0'],
      tipoReporte: ['', [Validators.required]],
      sector: ['', [Validators.required]],
      fechaInicio: ['', [Validators.required]],
      fechaCierre: [''],
      calleP: ['', [Validators.required]],
      referencia: [''],
      calleS1: [''],
      calleS2: [''],
      colonia: ['', [Validators.required]],
      descripcionR: ['', [Validators.required, Validators.maxLength(40)]]
    });
    this.form.valueChanges.subscribe(value => {
      if (this.form.touched){
        this.modificado = true;
      }else{
        this.modificado = false;
      }
    });
  }

  // Entrada: Ninguna
  // Salida: control de tipo AbstractControl, .
  // Descripción: Método para obtener acceso a los controles del formulario
  // que pertenecen al FormGroup
  get campoId(): AbstractControl{
    return this.form.get('id');
  }

  get campoTipoReporte(): AbstractControl{
    return this.form.get('tipoReporte');
  }

  get campoSector(): AbstractControl{
    return this.form.get('sector');
  }

  get campoFechaInicio(): AbstractControl{
    return this.form.get('fechaInicio');
  }

  get campoFechaCierre(): AbstractControl{
    return this.form.get('fechaCierre');
  }

  get campoCallePrincipal(): AbstractControl{
    return this.form.get('calleP');
  }

  get campoReferencia(): AbstractControl{
    return this.form.get('referencia');
  }

  get campoCalleSecundaria1(): AbstractControl{
    return this.form.get('calleS1');
  }

  get campoCalleSecundaria2(): AbstractControl{
    return this.form.get('calleS2');
  }

  get campoColonia(): AbstractControl{
    return this.form.get('colonia');
  }

  get campoDescripcionReporte(): AbstractControl{
    return this.form.get('descripcionR');
  }

  // Entrada: Ninguna.
  // Salida: valor booleano
  // Decripción: Se utiliza para verificar si el botón guardar debe
  // estar habilitado o no.
  habilitarBoton(): boolean{
    let habilitar: boolean;
    // Si se va a visualizar el reporte o si su estado es cancelado o cerrado.
    if (this.accion === 'ver' || this.estadoReporte === 4 || this.estadoReporte === 2){
      habilitar = true;
    }else{
      habilitar = false;
    }
    return habilitar;
  }

  // Entrada: Ninguna
  // Salida: valor booleano.
  // Descripción: Método que verifica que los datos se encuentren cargados, con el fin de
  // determinar en que momento mostrar el formulario o la animación de cargando.
  datosCargados(): boolean{
    let cargado: boolean;
    if (this.accion === 'nuevo' && this.idListo && this.listaTiposR.length > 0 && this.listaSectores.length > 0){
      cargado = true;
    }else if (this.accion !== 'nuevo' && this.listaTiposR.length > 0 && this.listaSectores.length > 0){
      cargado = true;
    }else{
      cargado = false;
    }
    return cargado;
  }

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción: Método para establecer los valores iniciales de los campos del formulario.
  // según sea un nuevo registro o modificación/ visualización de registro.
    inicializarCampos(): void{
      if (this.accion !== 'nuevo'){
        this.obtenerObjetoReporte();
        this.cargarImagenesReporte();
        const calles: string [] = this.reporteSevice.separarEntreCalles(this.reporte.EntreCalles_reporte);
        const fechaApertura: string = this.reporteSevice.separarFechaHora(this.reporte.FechaRegistro_reporte)[0];
        const fechaCierre: string = this.reporteSevice.separarFechaHora(this.reporte.FechaCierre_reporte)[0];
        const sector: number = this.reporte.ID_sector ?? 0; // acciones si el sector es null
        this.estadoReporte = this.reporte.Estatus_reporte;
        this.campoId.setValue(this.reporte.ID_reporte);
        this.campoSector.setValue(sector);
        this.campoTipoReporte.setValue(this.reporte.ID_tipoReporte);
        this.campoFechaInicio.setValue(fechaApertura);
        this.campoFechaCierre.setValue(fechaCierre);
        this.campoCallePrincipal.setValue(this.reporte.Direccion_reporte);
        this.campoReferencia.setValue(this.reporte.Referencia_reporte);
        this.campoCalleSecundaria1.setValue(calles[0]);
        this.campoCalleSecundaria2.setValue(calles[1]);
        this.campoColonia.setValue(this.reporte.Colonia_reporte);
        this.campoDescripcionReporte.setValue(this.reporte.Observaciones_reporte);
      }else{
        this.obtenerIDNuevo();
        this.imagenesApertura = [];
        this.estadoReporte = 1;
        this.campoTipoReporte.setValue(0); // para que aparezca "Seleccionar"
        this.campoSector.setValue(0); // para que aparezca "Seleccionar"
      }
    }

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción: Método para obtener el último ID registrado en la base de datos para
  // posteriormente ser mostrado en formulario.
    obtenerIDNuevo(): void{
      this.reporteSevice.obtenerIDRegistro()
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe( (id: number) => {
        this.campoId.setValue(id);
        this.idListo = true;
      });
    }

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción: Método para convertir los datos del registro seleccionado en la tabla de inicio
  // a un objeto de tipo ReporteM.
  obtenerObjetoReporte(): void{
    if (this.accion !== 'nuevo'){
      this.reporte = this.reporteSevice.convertirDesdeJSON(this.data.reporte);
    }
  }

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción: Método para obtener el listado de sectores y tipos de reporte
  // que se encuentran en la base de datos.
obtenerSectoresYTiposRep(): void{
  this.sectorService.obtenerSectores()
  .pipe(takeUntil(this.ngUnsubscribe))
  .subscribe( sectores => {
    sectores.forEach(sector => {
      // Solo sectores que estén activos
      if (sector.Estatus_sector === true){
        this.listaSectores.push(sector);
        // Si se está editando, para mostrar el sector al que pertenece el reporte.
      } else if ((this.accion !== 'nuevo') && (this.reporte.ID_sector === sector.ID_sector)){
        this.listaSectores.push(sector);
      }
    });
  });

  this.tipoReporteService.obtenerTiposReporte()
  .pipe(takeUntil(this.ngUnsubscribe))
  .subscribe( tipos => {
    tipos.forEach(tipo => {
      this.listaTiposR.push(tipo);
    });
  });
}

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción: Método para obtener las imágenes de apertura y cierre que
  // contiene el reporte.
cargarImagenesReporte(): void{
  // Imagenes de apertura
  this.reporteSevice.obtenerImagenesReporte(this.reporte.ID_reporte, 1)
  .pipe(takeUntil(this.ngUnsubscribe))
  .subscribe( (imgApertura: Imagen[]) => {
    this.pathImgApertura = this.imagenService.llenarListaPathImagenes(imgApertura);
    this.inicializarContenedorImagenes();
  }, (error: HttpErrorResponse) => {
    console.log('Error al obtener imágenes. ' + error);
  });

  // imágenes de cierre
  this.reporteSevice.obtenerImagenesReporte(this.reporte.ID_reporte, 2)
  .pipe(takeUntil(this.ngUnsubscribe))
  .subscribe( (imgCierre: Imagen[]) => {
    this.pathImgCierre = this.imagenService.llenarListaPathImagenes(imgCierre);
    this.inicializarContenedorImagenes();
  }, (error: HttpErrorResponse) => {
    console.log('Error al obtener imágenes de cierre. ' + error);
  });
}

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción: Método para indicar, mediante las variables "mostrarImgApertura" y "mostrarImgCierre"
  // si existen imágenes del reporte que mostrar.
  inicializarContenedorImagenes(): void{
    if (this.pathImgApertura.length !== 0){
      this.mostrarImgApertura = true;
    }else{
      this.mostrarImgApertura = false;
    }
    if (this.pathImgCierre.length !== 0){
      this.mostrarImgCierre = true;
    }else{
      this.mostrarImgCierre = false;
    }
  }

  // Entrada: Ninguna
  // Salida: valor booleano.
  // Descripción: Método que devuelve la variable "modificado" que indica si se
  // interactuó con el formulario.
obtenerEstadoFormulario(): boolean{
  return this.modificado;
}

// Entrada: Ninguna
// Salida: Ninguna
// Descripción: Verifica el estado del reporte y habilita o deshabilita los campos
habilitarPorEstado(): void{
  const estado = this.reporte.Estatus_reporte;
  switch (estado){
    case 2:
      this.form.disable();
      this.campoFechaCierre.enable();
      break;
    case 4:
      this.form.disable();
      break;
    default:
      this.form.enable();
      this.campoFechaCierre.disable();
      this.campoId.disable();
      break;
  }
}

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción: Método para habilitar o deshabilitar el formulario según la acción (crear, ver, editar)
  // o estado del registro.
  tipoFormularioAccion(): void{
    switch (this.accion){
      case 'ver':
        this.form.disable();
        break;
      case 'nuevo':
        this.campoFechaCierre.disable();
        this.campoId.disable();
        break;
      default:
        this.habilitarPorEstado();
        // const estado = this.reporte.Estatus_reporte;
        // if ( estado === 2 || estado === 4){
        //   this.form.disable();
        // }else{
        //   this.form.enable();
        //   this.campoId.disable();
        // }
    }
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
  // Salida: vacío.
  // Descripción: Método que se llama al presionar el botón cancelar.
  // Esta cambiará el estado del reporte a "Cancelado" y actualizará este cambio en la base de datos.
  cancelarReporte(): void{
    if (this.tienePermiso(23)){
      const result = confirm('¿Seguro que desea cancelar el reporte? Esta operación es irreversible');
      const auxEstado = this.reporte.Estatus_reporte;
      this.reporte.Estatus_reporte = 4;
      if (result) {
        this.reporteSevice.actualizarReporte(this.reporte)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe( res => {
          alert('¡El reporte fue cancelado!');
          this.form.disable();
          this.dialogRef.close(this.data);
        }, (error: HttpErrorResponse) => {
          alert('¡Lo sentimos! El reporte no pudo ser cancelado debido a problemas internos.' +
          'Comunique el problema al personal pertinente.');
          console.warn('Error:' + error.message);
          this.reporte.Estatus_reporte = auxEstado;
        });
      }
    }else{
      alert('No tiene permiso para ejecutar este proceso.');
    }
  }

  // Entrada: Ninguna
  // Salida: Objeto tipo UsuarioM.
  // Descripción: Método para obtener el objeto usuario del usuario actual, el que inició sesión
  // en el sistema.
  obtenerUsuarioActual(): UsuarioM{
    return this.usuarioService.obtenerUsuarioLogueado();
  }

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción: Método que se llama al presionar el botón "Subir imágenes"
  // con el fin de abrir la ventana para selección de archivos del input tipo = file
  abrirVentanaImagenes(): void{
    this.renderer.selectRootElement(this.inputFile.nativeElement).click();
  }

  // Entrada: evento que se genera al seleccionar imágenes en ventana de input tipo = file.
  // Salida: vacío.
  // Descripción: Método que recibe el evento que se genera al seleccionar imagenes en input
  // obtiene la lista de files o imagenes y las almacena en el servicio de imagen
  // Muestra en pantalla las imagenes seleccionadas.
   obtenerImagenesSubidas(event): void{
    const photosList = event.target.files;
    this.imagenService.setListaImagenesSel(photosList);
    this.uploadedImg = this.imagenService.readThis(photosList);
  }

// Entrada: Ninguna.
// Salida: boolean
// Descripción: Genera mensaje para informar al usuario que el reporte tiene estado cancelado o cerrado.
mensajeEstado(): boolean{
  let mostrarMensaje = false;
  if (this.accion !== 'nuevo'){
    const estadoReporte = this.reporte.Estatus_reporte;
    if (estadoReporte === 2 || estadoReporte === 4){
      mostrarMensaje = true;
    }
  }
  return mostrarMensaje;
}

  // Entrada: Ninguna
  // Salida:  promesa de tipo lista de numeros.
  // Descripción: Método para generar las coordenadas de la dirección ingresada en formulario
  // mediante un llamado al servicio de reporte.
  async generarCoordenadas(): Promise<number[]>{
    const calleNumero = this.campoCallePrincipal.value;
    const colonia = this.campoColonia.value;
    const direccion = this.mapService.generarDireccionCompleta(calleNumero, colonia);
    const latLng = await this.mapService.obtenerLatLng(direccion).toPromise()
    .then((respuesta: any) => {
      const direcciones = respuesta.results[0];
      const resLatLng = [direcciones.geometry.location.lat, direcciones.geometry.location.lng ];
      console.log(resLatLng);
      return resLatLng;
    })
    .catch(error => {
      console.log('Error al obtener coordenadas de dirección. ' + error);
      return [];
    });
    return latLng;
  }

  // Entrada: lista de tipo number
  // Salida: vacío.
  // Descripción: Método para modificar datos pertinentes de reporte
   modificarDatosReporte(coordenadas: number[]): void{
     const entreCalles = this.reporteSevice.formatoEntreCalles(this.campoCalleSecundaria1.value, this.campoCalleSecundaria2.value);
     const horaApertura: string = this.reporteSevice.separarFechaHora(this.reporte.FechaRegistro_reporte)[1];
     const horaCierre: string = this.reporteSevice.separarFechaHora(this.reporte.FechaCierre_reporte)[1];
     const fechaHoraApertura = this.reporteSevice.juntarFechaHora(this.campoFechaInicio.value, horaApertura);
     const fechaHoraCierre = this.reporteSevice.juntarFechaHora(this.campoFechaCierre.value, horaCierre);
     // Asignar valores a Reporte
     this.reporte.ID_sector = this.campoSector.value;
     this.reporte.ID_tipoReporte = this.campoTipoReporte.value;
     this.reporte.Latitud_reporte = coordenadas[0]; // lat
     this.reporte.Longitud_reporte = coordenadas[1]; // lng
     this.reporte.FechaRegistro_reporte = fechaHoraApertura;
     this.reporte.FechaCierre_reporte = fechaHoraCierre;
     this.reporte.Direccion_reporte = this.campoCallePrincipal.value;
     this.reporte.Referencia_reporte = this.campoReferencia.value;
     this.reporte.EntreCalles_reporte = entreCalles;
     this.reporte.Colonia_reporte = this.campoColonia.value;
     this.reporte.Poblado_reporte = this.campoColonia.value;
     this.reporte.Observaciones_reporte = this.campoDescripcionReporte.value;
     this.reporte.Estatus_reporte = this.estadoReporte;
  }

  // Entrada: lista de tipo number
  // Salida: Objeto de tipo TicketM.
  // Descripción: Método para generar nuevo ticket para el reporte
  generarNuevoTicket(coordenadas: number[]): TicketM{
    const usuarioActual = this.obtenerUsuarioActual();
    const hora: string = this.reporteSevice.formatoHora();
    const fechaHoraApertura = this.reporteSevice.juntarFechaHora(this.campoFechaInicio.value, hora);
    const entreCalles = this.reporteSevice.formatoEntreCalles(this.campoCalleSecundaria1.value, this.campoCalleSecundaria2.value);
    const ticket: TicketM = new TicketM(
      this.campoId.value,
      this.campoTipoReporte.value,
      usuarioActual.ID_usuario,
      this.estadoReporte,
      fechaHoraApertura,
      null,
      coordenadas[0], // Latitud
      coordenadas[1], // Longitud
      this.campoSector.value,
      null,
      null,
      this.campoCallePrincipal.value,
      entreCalles,
      this.campoReferencia.value,
      this.campoColonia.value,
      this.campoColonia.value,
      false,
      false,
      this.campoDescripcionReporte.value,
      2
    );
    return ticket;
  }

// Entrada: valor de tipo number con el valor actual del input tipo reporte.
// Salida: valor boolean
// Descripción: Verifica el valor actual del input para tipo de reporte y activa el error si
// no se ha seleccionado un tipo de reporte o lo retira.
errorTipoR(valor: number): boolean{
  let error: boolean;
  if (valor === 0){
    this.campoTipoReporte.setErrors({required: true});
    error = true;
  }else{
    this.campoTipoReporte.setErrors(null);
    error = false;
  }
  return error;
}

// Entrada: valor de tipo number con el valor actual del input sector.
// Salida: valor boolean
// Descripción: Verifica el valor actual del input para sector y activa el error si
// no se ha seleccionado un sector o lo retira.
errorSector(valor: number): boolean{
  let error: boolean;
  if (valor === 0){
    this.campoSector.setErrors({required: true});
    error = true;
  }else{
    this.campoSector.setErrors(null);
    error = false;
  }
  return error;
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

  // Entrada: ninguna
  // Salida: Promesa<void> que indica que las operaciones asíncronas se completaron.
  // Descripción: Método para actualizar o registrar un nuevo reporte.
  async accionGuardar(): Promise<void>{
    const coordenadas = await this.generarCoordenadas();
    if (this.uploadedImg.length > 0){
        this.imagenesApertura = await this.imagenService.llenarListaImagen(1);
    }

    if (this.accion !== 'nuevo'){
      // actualizar reporte
        this.modificarDatosReporte(coordenadas);
        this.reporteSevice.actualizarReporte(this.reporte)
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
          console.warn( 'Error al actualizar reporte:' + error.message);
        });
      } else{
        // registrar nuevo reporte
        const ticket = this.generarNuevoTicket(coordenadas);
        this.reporteSevice.registrarReporte(ticket, this.imagenesApertura)
        .pipe(takeUntil(this.ngUnsubscribe))
        .subscribe( res => {
          this.procesando = false;
          this.finalProceso = true;
          this.mensajeResultado = res;
          }, (error: HttpErrorResponse) => {
            this.procesando = false;
            this.finalProceso = true;
            this.error = true;
            this.mensajeResultado = 'EL reporte no pudo ser actualizado. Vuelva a intentarlo ó solicite asistencia.';
            console.warn('Error al registrar nuevo reporte:' + error.message);

          });
      }
    this.modificado = false; // los datos se han guardado, no hay necesidad de prevenir pérdida de datos.
  }

  // Entrada: ninguna.
  // Salida: ninguna.
  // Descripción: Método que se llama cuando se le da click en guardar en el formulario.
guardar(): void {
  // event.preventDefault();
  if (this.form.valid){
    this.procesando = true;
    this.accionGuardar();
  } else{
    this.form.markAllAsTouched();
  }
}



// Entrada: lista de tipo number
// Salida: Objeto de tipo TicketM.
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
