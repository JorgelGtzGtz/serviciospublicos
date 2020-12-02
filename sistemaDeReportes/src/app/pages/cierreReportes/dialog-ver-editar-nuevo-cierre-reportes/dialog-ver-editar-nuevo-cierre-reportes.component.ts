import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DialogService } from '../../../services/dialog-service.service';

interface Reporte{
  num: number;
  fechaInicio: string;
  numTickets: number;
  colonia: string;
  calle: string;
  descripcion: string;
}

@Component({
  selector: 'app-dialog-ver-editar-nuevo-cierre-reportes',
  templateUrl: './dialog-ver-editar-nuevo-cierre-reportes.component.html',
  styleUrls: ['./dialog-ver-editar-nuevo-cierre-reportes.component.css']
})
export class DialogVerEditarNuevoCierreReportesComponent implements OnInit {
  imagenesApertura: string [];
  imagenesCierre: string [];
  mostrarImgApertura: boolean;
  mostrarImgCierre: boolean;
  modificado: boolean;
  form: FormGroup;
  datosReporte: any;
  reporte: Reporte = { num: 1,
    fechaInicio: '05/10/2020',
    numTickets: 3,
    colonia: 'Prados del tepeyac',
    calle: 'Golfo de Tehuantepec',
    descripcion: 'Las luces de la calle mar de cortez no prenden desde hace 3 dias'
   };

  constructor(public dialogRef: MatDialogRef<DialogVerEditarNuevoCierreReportesComponent>,
              @Inject (MAT_DIALOG_DATA) private data,
              private dialogService: DialogService,
              private formBuilder: FormBuilder) {
                dialogRef.disableClose = true;
                this.buildForm();
              }

//  Al iniciar se mandarán los datos al componente de mapa
  ngOnInit(): void {
    this.datosReporte = {
      posicion: [-109.9285487, 27.5129998],
      zoom: 16,
      reporte: this.reporte,
    };
    this.imagenesApertura = ['alumbrado.jpg', 'baches.jpg', 'fugaAgua.jpg'];
    this.imagenesCierre = [];
    this.inicializarVariablesImagenes();
  }

  // Inicializa el formulario reactivo, aquí es donde se crean los controladores de los inputs
  private buildForm(){
    this.form = this.formBuilder.group({
      fechaCierre: ['', [Validators.required]],
      hora: ['', [Validators.required]]
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

  get campoFechaCierre(){
    return this.form.get('fechaCierre');
  }

  get campoHora(){
    return this.form.get('hora');
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

  // Método que se llama cuando se le da click en guardar en el formulario.
  guardar() {
    // event.preventDefault();
    if (this.form.valid){
      const value = this.form.value;
      alert('¡Cierre de reporte exitoso!');
      this.dialogRef.close(this.data);
      console.log(value);
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
