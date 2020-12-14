import { Component, OnInit, Inject, ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { DialogService } from '../../../services/dialog-service.service';
import { SectorService } from '../../../services/sector.service';
import { TipoReporteService } from '../../../services/tipo-reporte.service';
import { ReporteService } from '../../../services/reporte.service';
import { MapBoxService } from 'src/app/services/map-box.service';
import { UsuarioService } from '../../../services/usuario.service';
import { Sector } from '../../../Interfaces/ISector';
import { TipoReporte } from '../../../Interfaces/ITipoReporte';
import { Reporte } from '../../../Interfaces/IReporte';
import { HttpErrorResponse } from '@angular/common/http';
import { TicketM } from '../../../Models/TicketM';
import { UsuarioM } from '../../../Models/UsuarioM';
import { Usuario } from '../../../Interfaces/IUsuario';
import { Imagen } from '../../../Interfaces/IImagen';
import { ImagenService } from '../../../services/imagen.service';
import { Features } from '../../../Interfaces/Features';


@Component({
  selector: 'app-dialog-ver-editar-nuevo-alta-reportes',
  templateUrl: './dialog-ver-editar-nuevo-alta-reportes.component.html',
  styleUrls: ['./dialog-ver-editar-nuevo-alta-reportes.component.css']
})
export class DialogVerEditarNuevoAltaReportesComponent implements OnInit {
  @ViewChild("inputFile") inputFile: ElementRef;
  reporte: Reporte;
  idListo: boolean;
  mostrarImgApertura: boolean;
  mostrarImgCierre: boolean;
  modificado: boolean;
  cancelado: boolean;
  estado: number;
  accion: string;
  imagenesApertura: Imagen [] = [];
  imagenesCierre: Imagen [] = [];
  listaTiposR: TipoReporte[] = [];
  listaSectores: Sector[] = [];
  coordenadas: number[] = [];
  imagenesAperturaPrueba: string [];
  imagenesCierrePrueba: string [];
  uploadedImg: any [] = [];
  form: FormGroup;

  constructor(public dialogRef: MatDialogRef <DialogVerEditarNuevoAltaReportesComponent>,
              @Inject (MAT_DIALOG_DATA) private data,
              private dialogService: DialogService,
              private sectorService: SectorService,
              private tipoReporteService: TipoReporteService,
              private reporteSevice: ReporteService,
              private usuarioService: UsuarioService,
              private mapBoxService: MapBoxService,
              private imagenSevice: ImagenService,
              private formBuilder: FormBuilder,
              private renderer: Renderer2 ) {
      dialogRef.disableClose = true;
      this.buildForm();
     }

  ngOnInit(): void {
    this.accion = this.data.accion;
    this.inicializarCampos();
    this.tipoFormularioAccion();
    this.obtenerSectoresYTiposRep();
    this.imagenesAperturaPrueba = ['callejon.jpg', 'bache.jpg', 'alumbrado.jpg'];
    this.imagenesCierrePrueba= ['', '', '']; 
    console.log('RECIBE:', this.data.reporte);
  }

  // Inicializa el formulario reactivo, aquí es donde se crean los controladores de los inputs
  private buildForm(): void{
    this.form = this.formBuilder.group({
      id: ['0'],
      tipoReporte: ['', [Validators.required]],
      sector: ['', [Validators.required]],
      fechaInicio: ['', [Validators.required]],
      fechaCierre: [''],
      calleP: ['', [Validators.required]],
      referencia: ['', [Validators.required]],
      calleS1: ['', [Validators.required]],
      calleS2: ['', [Validators.required]],
      colonia: ['', [Validators.required]],
      descripcionR: ['', [Validators.required, Validators.maxLength(40)]]
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

    // Método para inicializar los valores de los campos
    inicializarCampos(): void{
      if (this.accion !== 'nuevo'){
        this.obtenerObjetoReporte();
        const calles: string [] = this.reporteSevice.separarEntreCalles(this.reporte.EntreCalles_reporte);
        const fechaApertura: string = this.reporteSevice.formatoFechaMostrar(this.reporte.FechaRegistro_reporte);
        const fechaCierre: string = this.reporteSevice.formatoFechaMostrar(this.reporte.FechaCierre_reporte);
        this.estado = this.reporte.Estatus_reporte;
        this.campoId.setValue(this.reporte.ID_reporte);
        this.campoFechaInicio.setValue(fechaApertura);
        this.campoFechaCierre.setValue(fechaCierre);
        this.campoCallePrincipal.setValue(this.reporte.Direccion_reporte);
        this.campoReferencia.setValue(this.reporte.Referencia_reporte);
        this.campoCalleSecundaria1.setValue(calles[0]);
        this.campoCalleSecundaria2.setValue(calles[1]);
        this.campoColonia.setValue(this.reporte.Colonia_reporte);
        this.campoDescripcionReporte.setValue(this.reporte.Observaciones_reporte);
        this.mostrarImgApertura = true;
        this.mostrarImgCierre = false;
        //this. inicializarVariablesImagenes();
      }else{
        this.obtenerIDNuevo();
        this.imagenesApertura = [];
        this.estado = 1;
      }
    }

    // Función para obtener el ID del nuevo registro
    obtenerIDNuevo(): void{
      this.reporteSevice.obtenerIDRegistro().subscribe( (id: number) => {
        this.campoId.setValue(id);
        this.idListo = true;
        console.log('ID:', id);
      });
    }

  // Se obtiene el objeto reporte con los datos recibidos en el dialog
  obtenerObjetoReporte(): void{
    if (this.accion !== 'nuevo'){
      this.reporte = this.reporteSevice.convertirDesdeJSON(this.data.reporte);
    }
  }

  // Función para obtener la lista de sectores y tipos de reporte
  // que se mostrarán en los select
obtenerSectoresYTiposRep(): void{
  this.sectorService.obtenerSectores().subscribe( sectores => {
    sectores.forEach(sector => {
      this.listaSectores.push(sector);
    });
  });
  console.log('Sectores', this.listaSectores);

  this.tipoReporteService.obtenerTiposReporte().subscribe( tipos => {
    tipos.forEach(tipo => {
      this.listaTiposR.push(tipo);
    });
  });
  console.log('Tipos de Reportes', this.listaTiposR);
}

inicializarSelTipo(tipo: TipoReporte): boolean{
  let valor = false;
  if (this.reporte !== undefined){
       if (tipo.ID_tipoReporte === this.reporte.ID_tipoReporte){
         valor =  true;
       }
    }
  return valor;
}

inicializarSelSector(sector: Sector): boolean{
  let valor = false;
  if (this.reporte !== undefined){
       if (sector.ID_sector === this.reporte.ID_sector){
         valor =  true;
       }
    }
  return valor;
}

  // Este método, va a establecer las variables "mostrarImgApertura" y "mostrarImgCierre"
  // como falso o verdadero, dependiendo si las listas "imagenesApertura" y "imagenesCierre"
  // tienen contenido, con el fin de que en el HTML se muestre un mensaje o se
  // muestren las imágenes
  inicializarVariablesImagenes(): void{
    if (this.imagenesApertura.length !== 0){
      this.mostrarImgApertura = true;
    }else{
      this.mostrarImgApertura = false;
    }
    if (this.imagenesCierre.length !== 0){
      this.mostrarImgCierre = true;
    }else{
      this.mostrarImgCierre = false;
    }
  }

  // Metodos get para obtener datos del formulario
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

  // Devuelve true si el usuario interactuó con el formulario o false si no.
obtenerEstadoFormulario(): boolean{
  return this.modificado;
}

// Devuelve el valor de la variable cancelado
reporteCancelado(): boolean{
  return this.cancelado;
}

// Este método habilita o deshabilita el formulario según lo que se quiera hacer en el
//  ya sea ver información, crear nuevo registro o editar.
//  En "ver" todos los campos aparecen deshabilitados y en "nuevo" el único deshabilitado
//  es "activar"
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
        this.form.enable();
        this.campoId.disable();
    }
  }

  // Al dar click en botón cancelar, se llama este método que cambiará
  //  el estado del reporte actual a "cancelado"
  cancelarReporte(): void{
    const result = confirm('¿Seguro que desea cancelar el reporte?');
    if (result) {
      console.log('Se cancela');
      this.form.disable();
      this.estado = 4;
      this.cancelado = true;
    }else{
      this.cancelado = false;
      console.log('no se cancela');
    }
  }

   // Método para obtener el ID del tipo de reporte
  // que se seleccionó
  tipoRepSeleccionado(nombre: string): number{
    let idTipoR: number;
    this.listaTiposR.forEach(tipo => {
      if (nombre === tipo.Descripcion_tipoReporte){
        idTipoR = tipo.ID_tipoReporte;
      }
    });
    return idTipoR;
  }
   // Método para obtener el ID del sector
  // que se seleccionó
  sectorSeleccionado(nombre: string): number{
    let idSector: number;
    this.listaSectores.forEach(sector => {
      if (nombre === sector.Descripcion_sector){
        idSector = sector.ID_sector;
      }
    });
    return idSector;
  }

  obtenerUsuarioActual(): UsuarioM{
    return this.usuarioService.obtenerUsuarioLogueado();
  }

  abrirVentanaImagenes(): void{
    this.renderer.selectRootElement(this.inputFile.nativeElement).click();
  }

  // Recibe el evento que se genera al seleccionar imagenes en input
  // obtiene la lista de files o imagenes y las almacena en el servicio de imagen
  // Muestra en pantalla las imagenes seleccionadas.
   obtenerImagenesSubidas(event){
    const photosList = event.target.files;
    this.imagenSevice.setListaImagenesSel(photosList);
    this.uploadedImg = this.imagenSevice.readThis(photosList);
  }

  generarCoordenadas(): Promise<number[]> {
    const calleNumero = this.campoCallePrincipal.value;
    const colonia = this.campoColonia.value;
    const query = this.mapBoxService.generarQueryCoordenadas(calleNumero, colonia);
    return new Promise((resolved, reject) => {
      this.mapBoxService.obtenerCoordenadasDireccion(query).toPromise()
      .then((features: Features[]) => {
        const coordenadas = features[0].geometry.coordinates
        console.log('coordenadas');        
        resolved(coordenadas);
      })
      .catch(error => {
        console.log('Error al obtener coordenadas. ' + error);
        reject([]);        
      });
      // resolved(this.mapBoxService.obtenerCoordenadasDireccion(query).toPromise());
    });
  }

   // Metodo para modificar datos pertinentes de reporte
   modificarDatosReporte(tipoReporte: number, coordenadas: number[], idSector: number, entreCalles: string): void{
     this.reporte.ID_sector = idSector;
     this.reporte.ID_tipoReporte = tipoReporte;
     this.reporte.Latitud_reporte = coordenadas[1];
     this.reporte.Longitud_reporte = coordenadas[0];
     this.reporte.FechaRegistro_reporte = this.campoFechaInicio.value;
     this.reporte.FechaCierre_reporte = this.campoFechaCierre.value;
     this.reporte.Direccion_reporte = this.campoCallePrincipal.value;
     this.reporte.Referencia_reporte = this.campoReferencia.value;
     this.reporte.EntreCalles_reporte = entreCalles;
     this.reporte.Colonia_reporte = this.campoColonia.value;
     this.reporte.Poblado_reporte = this.campoColonia.value;
     this.reporte.Observaciones_reporte = this.campoDescripcionReporte.value;
     this.reporte.Estatus_reporte = this.estado;
      console.log('Reporte:', this.reporte);
  }
 // Método para generar nuevo ticket para el reporte
  generarNuevoTicket(usuarioActual: Usuario, tipoReporte: number, coordenadas: number[], idSector: number, entreCalles: string){
    const ticket: TicketM = new TicketM(
      this.campoId.value,
      tipoReporte,
      usuarioActual.ID_usuario,
      this.estado,
      this.campoFechaInicio.value,
      null,
      coordenadas[1], // Latitud
      coordenadas[0], // Longitud
      idSector,
      null,
      0,
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

  async accionGuardar(){
    const usuarioActual = this.obtenerUsuarioActual();
    const tipoReporte = this.tipoRepSeleccionado(this.campoTipoReporte.value);
    const idSector = this.sectorSeleccionado(this.campoSector.value);
    const entreCalles = this.campoCalleSecundaria1.value + ' y ' + this.campoCalleSecundaria2.value;
    const coordenadas = await this.generarCoordenadas();
    if(this.uploadedImg.length > 0){
      this.imagenesApertura = await this.imagenSevice.llenarListaImagenApertura();
    }

    if (this.accion !== 'nuevo'){
        this.modificarDatosReporte(tipoReporte, coordenadas, idSector, entreCalles);
        console.log('REPORTE:', this.reporte);
        this.reporteSevice.actualizarReporte(this.reporte).subscribe( res => {
          alert('Los datos del reporte se actualizaron correctamente.');
          this.dialogRef.close(this.data);
        }, (error: HttpErrorResponse) => {
          alert('El reporte no pudo ser modificado. Error:' + error.message);
        });
      } else{
        const ticket = this.generarNuevoTicket(usuarioActual, tipoReporte, coordenadas, idSector, entreCalles);
        console.log('Ticket a generar:', ticket);
        this.reporteSevice.registrarReporte(ticket, this.imagenesApertura).subscribe( res => {
            alert('Reporte creado con éxito.');
            this.dialogRef.close(this.data);
          }, (error: HttpErrorResponse) => {
            alert('No se pudo realizar el registro. Error:' + error.message);
          });
      }
  }

// Método que se llama cuando se le da click en guardar en el formulario.
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
