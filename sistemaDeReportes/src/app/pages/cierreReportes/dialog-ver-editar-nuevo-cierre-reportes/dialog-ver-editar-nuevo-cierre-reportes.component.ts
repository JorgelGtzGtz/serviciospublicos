import { Component, OnInit, Inject, Renderer2, ViewChild, ElementRef } from '@angular/core';
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
export class DialogVerEditarNuevoCierreReportesComponent implements OnInit {
  @ViewChild('inputFile') inputFile: ElementRef;
  pathImgApertura: string[] = [];
  pathImgCierre: string[] = [];
  imagenesApertura: Imagen [] = [];
  imagenesCierre: Imagen [] = [];
  uploadedImg: string [] = [];
  mostrarImgApertura: boolean;
  mostrarImgCierre: boolean;
  imagenesCargadas: boolean;
  modificado: boolean;
  habilitarBoton: boolean;
  imagenesValidas: boolean;
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
      fechaCierre: [''],
      hora: ['']
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
  if(estadoReporte === 2 || estadoReporte === 4){
    this.form.disable();
  }
}

// Entrada: Ninguna.
// Salida: boolean
// Descripción: Genera mensaje para informar al usuario que el reporte tiene estado cancelado o cerrado.
mensajeEstado(): boolean{
  let mostrarMensaje: boolean;
  const estadoReporte = this.reporte.Estatus_reporte;
  if(estadoReporte === 2 || estadoReporte === 4){
    mostrarMensaje = true;
    this.habilitarBoton = true;
  }else{
    mostrarMensaje = false;
    this.habilitarBoton = false;
  }
  return mostrarMensaje;
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
  .subscribe( (imgApertura: Imagen[]) => {
    this.pathImgApertura = this.imagenService.llenarListaPathImagenes(imgApertura);
    this.inicializarContenedorImagenes();
    this.imagenesCargadas = true;
  }, (error: HttpErrorResponse) => {
    console.log('Error al obtener imágenes. ' + error);
  });

  // imágenes de cierre
  this.reporteSevice.obtenerImagenesReporte(this.reporte.ID_reporte, 2)
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
    this.imagenService.setListaImagenesSel(photosList);
    this.uploadedImg = this.imagenService.readThis(photosList);    
  }
  
  // Entrada: evento que se genera al seleccionar imágenes en ventana de input tipo = file.
  // Salida: vacío.
  // Descripción: Método que recibe el evento que se genera al seleccionar imagenes en input
  // obtiene la lista de files o imagenes y las almacena en el servicio de imagen
  // Muestra en pantalla las imagenes seleccionadas.
  async accionGuardar(): Promise<void>{
    // Obtener datos a actualizar
    const fechaCierre = this.campoFechaCierre.value;
    const horaCierre = this.campoHora.value;
    const fechaCierreHora: string = this.reporteSevice.juntarFechaHora(fechaCierre, horaCierre);
    this.reporte.FechaCierre_reporte = fechaCierreHora;
    this.reporte.Estatus_reporte = 2;

    // Obtener imágenes
    if (this.uploadedImg.length > 0){
      this.imagenesCierre = await this.imagenService.llenarListaImagen(2);
      this.reporteSevice.insertarImgReporte(this.reporte, this.imagenesCierre).subscribe(res => {
        console.log('Imagenes de cierre:', this.imagenesCierre);
        console.log(res);
      }, (error: HttpErrorResponse) => {
        alert('Surgió un error al subir imágenes de cierre de reporte. Inténtelo más tarde o verifique las imágenes');
        console.log('Imágenes de cierre no pudieron ser procesadas.', error.message);
      });
      
      // actualizar reporte
    this.reporteSevice.actualizarReporte(this.reporte). subscribe( respuesta => {
      alert('¡Cierre de reporte exitoso!');
      this.dialogRef.close();
    }, (error: HttpErrorResponse) => {
      alert('¡Lo sentimos! El cierre no se ha podido efectuar. Verifique que los datos sean correctos o solicite ayuda. ');
      console.log('Error al efectuar actualización para cierre de reporte.', error.message);
    });
    }else{
      alert('¡Debe subir imágenes de cierre para poder cerrar el reporte!');      
    }
  }

  // Entrada: evento que se genera al seleccionar imágenes en ventana de input tipo = file.
  // Salida: vacío.
  // Descripción: Método que se llama cuando se le da click en guardar en el formulario para
  // llamar al método "accionGuardar" que efectúa los procesos para mandar información a la API.
  guardar(): void {
    // event.preventDefault();
    if (this.form.valid){
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

}
