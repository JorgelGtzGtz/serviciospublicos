import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { DialogService } from '../../../services/dialog-service.service';
import { ReporteService } from '../../../services/reporte.service';
import { ReporteM } from '../../../Models/ReporteM';
import { Imagen } from '../../../Interfaces/IImagen';
import { ImagenService } from '../../../services/imagen.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CuadrillaService } from '../../../services/cuadrilla.service';
import { Cuadrilla } from '../../../Interfaces/ICuadrilla';
import { Reporte } from '../../../Interfaces/IReporte';

@Component({
  selector: 'app-dialog-asignacion-tickets',
  templateUrl: './dialog-asignacion-tickets.component.html',
  styleUrls: ['./dialog-asignacion-tickets.component.css']
})
export class DialogAsignacionTicketsComponent implements OnInit {
  imagenesApertura: string [];
  listaCuadrillas: Cuadrilla [] = [];
  mostrarImgApertura: boolean;
  cuadrillasCargadas: boolean;
  imagenesCargadas: boolean;
  modificado: boolean;
  form: FormGroup;
  reporte: Reporte;


  constructor( public dialogRef: MatDialogRef<DialogAsignacionTicketsComponent>,
               @Inject (MAT_DIALOG_DATA) private data,
               private dialogService: DialogService,
               private formBuilder: FormBuilder,
               private reporteSevice: ReporteService,
               private imagenSevice: ImagenService,
               private cuadrillaService: CuadrillaService) {
    dialogRef.disableClose = true;
    this.buildForm();
   }

  //  Al iniciar se mandarán los datos al componente de mapa
  ngOnInit(): void {
    this.obtenerCuadrillasList();
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
      cuadrilla: [0, [Validators.required]],
      fechaCierre: [''],
      tiempo: ['']
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
get campoCuadrilla(): AbstractControl{
  return this.form.get('cuadrilla');
}

get campoFechaCierre(): AbstractControl{
  return this.form.get('fechaCierre');
}

get campoTiempo(): AbstractControl{
  return this.form.get('tiempo');
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
    // cuadrilla asignada
    if (this.reporte.ID_cuadrilla !== null){
      this.campoCuadrilla.setValue(this.reporte.ID_cuadrilla);
    }
    // fecha cierre
    if (this.reporte.FechaCierre_reporte !== null){
      const fechaCierre: string = this.reporteSevice.separarFechaHora(this.reporte.FechaCierre_reporte)[0];
      this.campoFechaCierre.setValue(fechaCierre);
    }
    // tiempo estimado
    if (this.reporte.TiempoEstimado_reporte !== null){
      this.campoTiempo.setValue(this.reporte.TiempoEstimado_reporte);
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
  }else{
    mostrarMensaje = false;
  }
  return mostrarMensaje;
}

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción: Método para obtener las imágenes de apertura y cierre que
  // contiene el reporte.
cargarImagenesReporte(): void{
  this.reporteSevice.obtenerImagenesReporte(this.reporte.ID_reporte, 1)
  .subscribe( (imgApertura: Imagen[]) => {
    this.imagenesApertura = this.imagenSevice.llenarListaPathImagenes(imgApertura);
    this.inicializarVariablesImagenes();
    this.imagenesCargadas = true;
  }, (error: HttpErrorResponse) => {
    console.log('Error al obtener imágenes. ' + error);
  });
}

  // Entrada: Ninguna
  // Salida: vacío.
  // Descripción: Método para obtener el listado de cuadrillas
  obtenerCuadrillasList(): void{
    this.cuadrillaService.obtenerCuadrillasGeneral().subscribe( cuadrillas => {
      cuadrillas.forEach(cuadrilla => {
        this.listaCuadrillas.push(cuadrilla);
        this.cuadrillasCargadas = true;
      });
    });
  }

  // Entrada: Ninguna
  // Salida: valor booleano.
  // Descripción: Método que verifica que los datos se encuentren cargados, con el fin de 
  // determinar en que momento mostrar el formulario o la animación de cargando.
  datosCargados(): boolean{
    let cargado: boolean;
    if (this.cuadrillasCargadas && this.imagenesCargadas){
        cargado = true;
    }else{
        cargado = false;
    }
    return cargado;
  }

// Entrada: Ninguna
// Salida: Valor boolean.
// Descripción: Método que devuelve la variable  booleana que indica si 
// se ha interactuado con algún campo del formulario.
  obtenerEstadoFormulario(): boolean{
    return this.modificado;
  }

// Entrada: Ninguna
// Salida: vacío.
// Descripción: Método que según el contenido de la variable "imagenesApertura", indica
// mediante la variable "mostrarImgApertura", si hay imágenes que mostrar.
  inicializarVariablesImagenes(): void{
    if (this.imagenesApertura.length !== 0){
      this.mostrarImgApertura = true;
    }else{
      this.mostrarImgApertura = false;
    }
  }

// Entrada: Ninguna
// Salida: vacío.
// Descripción: Método en donde se llama al servicio de reporte para ejecutar la actualización,
// de la información del reporte, a partir de los datos del formulario.
  accionGuardar(): void{
    this.reporte.FechaCierre_reporte = this.campoFechaCierre.value;
    this.reporte.TiempoEstimado_reporte = this.campoTiempo.value;
    this.reporte.ID_cuadrilla = this.campoCuadrilla.value;
    this.reporteSevice.actualizarReporte(this.reporte).subscribe( respuesta => {
      alert('¡ Reporte asignado con éxito ! ');
      this.dialogRef.close();
    }, (error: HttpErrorResponse) => {
      alert('¡Lo sentimos! No ha sido posible asignar la cudrilla. Verifique que los datos sean correctos o solicite asistencia.');
      console.log('Error al asignar cuadrilla a reporte:', error.message);
    });
  }

// Entrada: Ninguna
// Salida: vacío.
// Descripción: Método que se llama al dar click en guardar. Llama al método que ejecuta 
// las acciones necesarias para enviar la información a la API.
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
// Descripción: Método que cierra dialog y además muestra un mensaje de confirmación,
// en caso de que se interactuara con el dialog.
  cerrarDialog(): void{
    this.dialogService.verificarCambios(this.dialogRef);
  }

  }
