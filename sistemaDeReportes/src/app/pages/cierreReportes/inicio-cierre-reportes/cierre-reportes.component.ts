import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogVerEditarNuevoCierreReportesComponent } from '../dialog-ver-editar-nuevo-cierre-reportes/dialog-ver-editar-nuevo-cierre-reportes.component';
import { FormControl} from '@angular/forms';

interface ReporteCierre{
  num: number;
  sector: string;
  direccion: string;
}

@Component({
  selector: 'app-inicio-cierre-reportes',
  templateUrl: './cierre-reportes.component.html',
  styleUrls: ['./cierre-reportes.component.css']
})
export class CierreReportesComponent implements OnInit {
  nombreSeccion = 'Cierre de reportes';
  cuadrillaForm: FormControl;
  headersTabla: string [];
  datosTabla: object [];
  datos: ReporteCierre[] = [
    {num: 1, sector: 'Norte', direccion: 'Tamaulipas y guerrero #126'},
    {num: 3, sector: 'Sur', direccion: 'Tamaulipas y guerrero #126'},
    {num: 4, sector: 'Noroeste', direccion: 'Tamaulipas y guerrero #126'},
    {num: 5, sector: 'Este', direccion: 'Tamaulipas y guerrero #126'},
    {num: 6, sector: 'Norte', direccion: 'Tamaulipas y guerrero #126'},
    {num: 8, sector: 'principal', direccion: 'Tamaulipas y guerrero #126'},
    {num: 10, sector: 'principal', direccion: 'Tamaulipas y guerrero #126'}
  ];

  constructor(public dialog: MatDialog) { 
    this.formBuilder();
  }

  ngOnInit(): void {
    this.inicializarTabla();
  }

  // Inicializa los controladores del formulario
  formBuilder(){
    this.cuadrillaForm = new FormControl('Todos');
    this.cuadrillaForm.valueChanges.subscribe(value => {
      console.log('se interactuo:', value);
    });
  }

  // Método para inicializar las variables que contienen los datos que se
  //  mostrarán en la tabla
  inicializarTabla(){
    this.datosTabla = [];
    this.datos.forEach(element => {
      this.datosTabla.push(Object.values(element));
    });
    this.headersTabla = ['No. Reporte', 'Sector', 'Dirección', 'Seleccionar'];
    console.log('datos tabla:', this.datosTabla);
    console.log('datos:', this.datos);
  }
  
 // Métodos get para obtener acceso a los campos del formulario
 get campoCuadrilla(){
   return this.cuadrillaForm;
 }

   // Agregar clases a las columnas 'th' según el contenido
  // que encabecen, para agregar estilos
  // También se añade un estilo general.
  tamanoColumna( encabezado: string): any{
    return {
      'id-col': encabezado === 'No. Reporte',
      'boton-seleccionar-col': encabezado === 'Seleccionar',
      'general-col': encabezado
    };
  }

   // Método que abre el dialog. Recibe la acción (ver, nuevo, editar o seleccionar, según la sección),
  // además recibe el dato de tipo Reporte, con la información que se muestra en el formulario
  // También contiene el método que se ejecuta cuando el diálogo se cierra.
  abrirDialogSeleccionar(accion: string, registro: object): void{
    const DIALOG_REF = this.dialog.open( DialogVerEditarNuevoCierreReportesComponent, {
      width: '900px',
      height: '600px',
      disableClose: true,
      data: {accion, registro}
    });
  }

  // Método que abre el dialog, al haber hecho click en botón "seleccionar" de la tabla
  // La tabla emite que botón fué el que quiere abrir el dialog
  seleccionarReporte(event: string, registro: object): void{
    this.abrirDialogSeleccionar(event, registro);
  }

    // Método para buscar en la base de datos los registros que coincidan con los
  // valores que se establescan en los campos
  buscar(): void{
    console.log('click buscar desde cierre reportes', this.cuadrillaForm.value);
  }

}
