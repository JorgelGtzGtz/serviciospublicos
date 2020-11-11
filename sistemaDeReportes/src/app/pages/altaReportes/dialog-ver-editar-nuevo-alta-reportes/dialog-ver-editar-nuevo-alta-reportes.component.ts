import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DialogService } from '../../../services/dialog-service.service';


@Component({
  selector: 'app-dialog-ver-editar-nuevo-alta-reportes',
  templateUrl: './dialog-ver-editar-nuevo-alta-reportes.component.html',
  styleUrls: ['./dialog-ver-editar-nuevo-alta-reportes.component.css']
})
export class DialogVerEditarNuevoAltaReportesComponent implements OnInit {
  accion: string;
  imagenesApertura: string [];
  imagenesCierre: string [];
  mostrarImgApertura: boolean;
  mostrarImgCierre: boolean;
  modificado: boolean;
  cancelado: boolean;
  form: FormGroup;

  constructor(public dialogRef: MatDialogRef <DialogVerEditarNuevoAltaReportesComponent>,
              @Inject (MAT_DIALOG_DATA) private data,
              private dialogService: DialogService,
              private formBuilder: FormBuilder ) {
      dialogRef.disableClose = true;
      this.buildForm();
     }

  ngOnInit(): void {
    this.accion = this.data.accion;
    this.imagenesApertura = [];
    this.imagenesCierre = ['alumbrado.jpg', 'baches.jpg', 'fugaAgua.jpg'];
    this. inicializarVariablesImagenes();
    this.tipoFormularioAccion();
  }

  // Inicializa el formulario reactivo, aquí es donde se crean los controladores de los inputs
  private buildForm(){
    this.form = this.formBuilder.group({
      id: ['1'],
      tipoReporte: ['', [Validators.required]],
      sector: ['', [Validators.required]],
      fechaInicio: ['', [Validators.required]],
      fechaCierre: [''],
      calleP: ['', [Validators.required]],
      referencia: ['', [Validators.required]],
      calleS1: ['', [Validators.required]],
      calleS2: ['', [Validators.required]],
      colonia: ['', [Validators.required]],
      poblacion: ['', [Validators.required]],
      descripcionR: ['', [Validators.required, Validators.maxLength(120)]]
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

  // Metodos get para obtener datos del formulario
  get campoId(){
    return this.form.get('id');
  }
  
  get campoTipoReporte(){
    return this.form.get('tipoReporte');
  }

  get campoSector(){
    return this.form.get('sector');
  }

  get campoFechaInicio(){
    return this.form.get('fechaInicio');
  }

  get campoFechaCierre(){
    return this.form.get('fechaCierre');
  }

  get campoCallePrincipal(){
    return this.form.get('calleP');
  }

  get campoReferencia(){
    return this.form.get('referencia');
  }

  get campoCalleSecundaria1(){
    return this.form.get('calleS1');
  }

  get campoCalleSecundaria2(){
    return this.form.get('calleS2');
  }
  
  get campoColonia(){
    return this.form.get('colonia');
  }

  get campoPoblacion(){
    return this.form.get('poblacion');
  }

  get campoDescripcionReporte(){
    return this.form.get('descripcionR');
  }

  // Devuelve true si el usuario interactuó con el formulario o false si no.
obtenerEstadoFormulario(): boolean{
  return this.modificado;
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

// Devuelve el valor de la variable cancelado
reporteCancelado(){
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
    let result = confirm('¿Seguro que desea cancelar el reporte?');
    if (result) {
      console.log('Se cancela');
      this.form.disable();
      this.cancelado = true;
    }else{
      this.cancelado = false;
      console.log('no se cancela');
    }
  }


// Método que se llama cuando se le da click en guardar en el formulario.
guardar(): void {
  // event.preventDefault();
  if (this.form.valid){
    const value = this.form.value;
    this.mensajeDeGuardado();
    this.dialogRef.close(this.data);
    console.log(value);
  } else{
    this.form.markAllAsTouched();
  }
}

// Método que muestra un mensaje, al dar click en guardar.
// El contenido del mensaje depende de si está actualizando datos o creando nuevo registro
mensajeDeGuardado(): void{
  if (this.accion === 'editar'){
    alert('¡Los datos se han actualizado exitosamente!');
  } else{
    alert('¡Reporte creado exitosamente!');
  }
}

// Método que a través del método "verificarCambios" del servicio de DialogService
// verifica si el usuario interactuó con el formulario.
// Si la interacción sucedió se despliega un mensaje de confirmación.
  cerrarDialog(): void{
    this.dialogService.verificarCambios(this.dialogRef);
  }

}
