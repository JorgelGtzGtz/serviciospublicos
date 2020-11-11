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
  datosCierreReportes: any;
  datos: ReporteCierre[] = [
    {num: 0, sector: 'principal', direccion: 'Tamaulipas y guerrero #126'},
    {num: 0, sector: 'principal', direccion: 'Tamaulipas y guerrero #126'},
    {num: 0, sector: 'principal', direccion: 'Tamaulipas y guerrero #126'},
    {num: 0, sector: 'principal', direccion: 'Tamaulipas y guerrero #126'},
    {num: 0, sector: 'principal', direccion: 'Tamaulipas y guerrero #126'},
    {num: 0, sector: 'principal', direccion: 'Tamaulipas y guerrero #126'},
    {num: 0, sector: 'principal', direccion: 'Tamaulipas y guerrero #126'}
  ];

  constructor(public dialog: MatDialog) { 
    this.formBuilder();
  }

  ngOnInit(): void {
    let dataArray = [];
    this.datos.forEach(element => {
      dataArray.push(Object.values(element));
    });
    this.datosCierreReportes = {
      pagina: 'cierreReportes',
      headers: ['No. Reporte', 'Sector', 'Dirección', 'Seleccionar'],
      data: dataArray
    };
  }

  // Inicializa los controladores del formulario
  formBuilder(){
    this.cuadrillaForm = new FormControl('');
    this.cuadrillaForm.valueChanges.subscribe(value => {
      console.log('se interactuo:', value);
    });
  }
  
 // Métodos get para obtener acceso a los campos del formulario
 get campoCuadrilla(){
   return this.cuadrillaForm;
 }

   // Método que abre el dialog. Recibe la acción (ver, nuevo, editar o seleccionar, según la sección),
  // además recibe el dato de tipo Reporte, con la información que se muestra en el formulario
  // También contiene el método que se ejecuta cuando el diálogo se cierra.
  abrirDialogSeleccionar(accion: string): void{
    const DIALOG_REF = this.dialog.open( DialogVerEditarNuevoCierreReportesComponent, {
      width: '900px',
      height: '600px',
      disableClose: true,
      data: {accion}
    });
  }

  // Método que abre el dialog, al haber hecho click en botón "seleccionar" de la tabla
  // La tabla emite que botón fué el que quiere abrir el dialog
  seleccionarReporte(event: string): void{
    this.abrirDialogSeleccionar(event);
  }

    // Método para buscar en la base de datos los registros que coincidan con los
  // valores que se establescan en los campos
  buscar(): void{
    console.log('click buscar desde cierre reportes', this.cuadrillaForm.value);
  }

}
