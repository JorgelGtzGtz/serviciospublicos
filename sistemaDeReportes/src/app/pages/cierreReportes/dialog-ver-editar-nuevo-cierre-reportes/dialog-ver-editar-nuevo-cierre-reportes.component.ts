import { Component, OnInit, OnDestroy , Inject, Renderer2, ViewChild, ElementRef } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { DialogService } from '../../../services/dialog-service.service';
import { Reporte } from '../../../Interfaces/IReporte';
import { Imagen } from '../../../Interfaces/IImagen';
import { ImagenService } from '../../../services/imagen.service';
import { ReporteService } from '../../../services/reporte.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-dialog-ver-editar-nuevo-cierre-reportes',
  templateUrl: './dialog-ver-editar-nuevo-cierre-reportes.component.html',
  styleUrls: ['./dialog-ver-editar-nuevo-cierre-reportes.component.css']
})
export class DialogVerEditarNuevoCierreReportesComponent implements OnInit, OnDestroy {
  private ngUnsubscribe = new Subject();
  @ViewChild('inputFile') inputFile: ElementRef;
  imagenesApertura: Imagen [] = [];
  imagenesCierre: Imagen [] = [];
  pathImgApertura: string[] = [];
  pathImgCierre: string[] = [];
  uploadedImg: string [] = [];
  mensajeResultado: string;
  mostrarImgApertura: boolean;
  mostrarImgCierre: boolean;
  imagenesCargadas: boolean;
  modificado: boolean;
  imagenesValidas: boolean;
  procesando: boolean;
  finalProceso: boolean;
  error: boolean;
  form: FormGroup;
  reporte: Reporte;

  constructor(public dialogRef: MatDialogRef<DialogVerEditarNuevoCierreReportesComponent>,
              @Inject (MAT_DIALOG_DATA) private data,
              private dialogService: DialogService,
              private imagenService: ImagenService,
              private reporteSevice: ReporteService,
              private renderer: Renderer2,
              private formBuilder: FormBuilder) {
                dialogRef.disableClose = true;
                this.buildForm();
              }

//  Al iniciar se mandarán los datos al componente de mapa
  ngOnInit(): void {
    this.procesando = false;
    this.finalProceso = false;
    this.error = false;
    this.obtenerObjetoReporte();
    this.inicializarFormulario();
    this.tipoFormularioAccion();
    this.cargarImagenesReporte();
  }

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción:Inicializa el formulario reactivo, aquí es donde
  // se crean los controladores de los inputs.
  private buildForm(): void{
    this.form = this.formBuilder.group({
      fechaCierre: ['', [Validators.required]],
      hora: ['', [Validators.required]]
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
// Salida: control de tipo AbstractControl.
// Descripción: Métodos para tener acceso a los controles con los que se obtiene
// la información de los campos del formulario.
  get campoFechaCierre(): AbstractControl{
    return this.form.get('fechaCierre');
  }

  get campoHora(): AbstractControl{
    return this.form.get('hora');
  }

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción: Método para convertir los datos del registro seleccionado en la tabla de inicio
  // a un objeto de tipo ReporteM.
  obtenerObjetoReporte(): void{
    this.reporte = this.reporteSevice.convertirDesdeJSON(this.data.reporte);
  }

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción: Método para inicializar los valores de los campos del formulario.
  inicializarFormulario(): void{
    // fecha cierre
    if (this.reporte.FechaCierre_reporte !== null){
      const fechaHora: string[] = this.reporteSevice.separarFechaHora(this.reporte.FechaCierre_reporte);
      this.campoFechaCierre.setValue(fechaHora[0]);
      this.campoHora.setValue(fechaHora[1]);
    }
  }

// Entrada: Ninguna
// Salida: vacío.
// Descripción: Este método habilita o deshabilita el formulario según el estado del reporte.
tipoFormularioAccion(): void{
  const estadoReporte = this.reporte.Estatus_reporte;
  if (estadoReporte === 2 || estadoReporte === 4){
    this.form.disable();
  }
}

// Entrada: Ninguna.
// Salida: boolean
// Descripción: Genera mensaje para informar al usuario que el reporte tiene estado cancelado o cerrado.
reporteDisponible(): boolean{
  let disponible: boolean;
  const estadoReporte = this.reporte.Estatus_reporte;
  if (estadoReporte === 2 || estadoReporte === 4){
    disponible = true;
  }else{
    disponible = false;
  }
  return disponible;
}

  // Entrada: Ninguna
  // Salida: valor boolean.
  // Descripción: Método que devuelve true si el usuario interactuó con el formulario o false si no.
  obtenerEstadoFormulario(): boolean{
    return this.modificado;
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
    this.imagenesCargadas = true;
  }, (error: HttpErrorResponse) => {
    console.log('Error al obtener imágenes. ' + error);
  });

  // imágenes de cierre
  this.reporteSevice.obtenerImagenesReporte(this.reporte.ID_reporte, 2)
  .pipe(takeUntil(this.ngUnsubscribe))
  .subscribe( (imgCierre: Imagen[]) => {
    this.pathImgCierre = this.imagenService.llenarListaPathImagenes(imgCierre);
    this.inicializarContenedorImagenes();
    this.imagenesCargadas = true;
  }, (error: HttpErrorResponse) => {
    console.log('Error al obtener imágenes de cierre. ' + error);
  });
}

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción: Método que verifica si las listas de imágenes contienen
  // elementos para determinar si se muestran las imágenes o un mensaje para indicar que no hay.
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
    if (photosList.length <= 2){
    this.imagenService.setListaImagenesSel(photosList);
    this.uploadedImg = this.imagenService.readThis(photosList);
    this.modificado = true;
    }else{
      alert('Solo se permiten dos imágenes de cierre.');
    }
  }

// Entrada: Ninguna
// Salida: Booleano
// Descripción: Deshabilita el botón guardar si
// el formulario fue accedido para ver información, si se está procesando
// una actualización o alta, o si ya se ha concluido un proceso.
deshabilitarGuardar(): boolean{
  let deshabilitar: boolean;
  if (this.procesando || this.finalProceso || this.reporteDisponible()) {
    deshabilitar = true;
  }else{
    deshabilitar = false;
  }
  return deshabilitar;
}


  // Entrada: evento que se genera al seleccionar imágenes en ventana de input tipo = file.
  // Salida: vacío.
  // Descripción: Método que recibe el evento que se genera al seleccionar imagenes en input
  // obtiene la lista de files o imagenes y las almacena en el servicio de imagen
  // Muestra en pantalla las imagenes seleccionadas.
  async accionGuardar(): Promise<void>{
    // Obtener imágenes
      this.imagenesCierre = await this.imagenService.llenarListaImagen(2);
      this.reporteSevice.insertarImgReporte(this.reporte, this.imagenesCierre).toPromise()
      .catch((error: HttpErrorResponse) => {
        alert('Surgió un error al subir imágenes de cierre de reporte. Inténtelo más tarde o verifique que las imágenes sean del formato y peso correcto.');
        console.log('Imágenes de cierre no pudieron ser procesadas.', error.message);
      });

      // actualizar reporte
      // Obtener datos a actualizar
      const fechaCierre = this.campoFechaCierre.value;
      const horaCierre = this.campoHora.value;
      const fechaCierreHora: string = this.reporteSevice.juntarFechaHora(fechaCierre, horaCierre);
      this.reporte.FechaCierre_reporte = fechaCierreHora;
      this.reporte.Estatus_reporte = 2;

      // Enviar datos de reporte para actualizar
      this.reporteSevice.actualizarReporte(this.reporte)
      .pipe(takeUntil(this.ngUnsubscribe))
      .subscribe( respuesta => {
        this.procesando = false;
        this.finalProceso = true;
        this.mensajeResultado = '¡El reporte se ha cerrado exitosamente!';
    }, (error: HttpErrorResponse) => {
        this.procesando = false;
        this.finalProceso = true;
        this.error = true;
        this.mensajeResultado = 'No fue posible cerrar el reporte. Vuelva a intentarlo ó solicite asistencia.';
        console.log('Error al efectuar actualización para cierre de reporte.', error.message);
    });
      this.modificado = false; // los datos se han guardado, no hay necesidad de prevenir pérdida de datos.
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
    alert('Verifique que los campos tengan la información correcta o estén llenos.');
  }
  // Verificar nombre de cuadrilla
  if (this.uploadedImg.length === 0){
    sonValidos = false;
    alert('¡Debe subir imágenes de cierre para poder cerrar el reporte!');
  }
  return sonValidos;
}

  // Entrada: evento que se genera al seleccionar imágenes en ventana de input tipo = file.
  // Salida: vacío.
  // Descripción: Método que se llama cuando se le da click en guardar en el formulario para
  // llamar al método "accionGuardar" que efectúa los procesos para mandar información a la API.
  guardar(): void {
    // event.preventDefault();
    if (this.camposValidos()){
      this.procesando = true;
      this.accionGuardar();
    } else{
      this.form.markAllAsTouched();
    }
  }

// Método que a través del método "verificarCambios" del servicio de DialogService
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
