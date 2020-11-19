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
  selector: 'app-dialog-asignacion-tickets',
  templateUrl: './dialog-asignacion-tickets.component.html',
  styleUrls: ['./dialog-asignacion-tickets.component.css']
})
export class DialogAsignacionTicketsComponent implements OnInit {
  imagenesApertura: string [];
  mostrarImgApertura: boolean;
  modificado: boolean;
  form: FormGroup;
  datosReporte: any;
  reporte: Reporte = { num: 1,
    fechaInicio: '06/10/2020',
    numTickets: 3,
    colonia: 'Noroeste',
    calle: 'Boulevard Rodolfo Elías Calles',
    descripcion: 'Bache de tamaño grande ocasiona severos daños a los automóviles que transitan ahí'
   };


  constructor( public dialogRef: MatDialogRef<DialogAsignacionTicketsComponent>,
               @Inject (MAT_DIALOG_DATA) private data,
               private dialogService: DialogService,
               private formBuilder: FormBuilder) {
    dialogRef.disableClose = true;
    this.buildForm();
   }

  //  Al iniciar se mandarán los datos al componente de mapa
  ngOnInit(): void {
    this.imagenesApertura = ['alumbrado.jpg', 'baches.jpg', 'fugaAgua.jpg'];
    this.datosReporte = {
      posicion: [-109.9285487, 27.5129998],
      zoom: 16,
      reporte: this.reporte,
    };
    this.inicializarVariablesImagenes();
    console.log('Datos reporte:', this.data.registro);
  }

      // Inicializa el formulario reactivo, aquí es donde se crean los controladores de los inputs
  private buildForm(){
    this.form = this.formBuilder.group({
      cuadrilla: ['', [Validators.required]],
      fechaCierre: ['', [Validators.required]],
      tiempo: ['', [Validators.required]]
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

  // Métodos get para obtener acceso a los inputs del formulario
  get campoCuadrilla(){
    return this.form.get('cuadrilla');
  }

  get campoFechaCierre(){
    return this.form.get('fechaCierre');
  }

  get campoTiempo(){
    return this.form.get('tiempo');
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
  }

  // Método que se llama cuando se le da click en guardar en el formulario.
  guardar() {
    // event.preventDefault();
    if (this.form.valid){
      const value = this.form.value;
      alert('¡Asignación exitosa!');
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
