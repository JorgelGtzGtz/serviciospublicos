import { Component, ElementRef, Inject, OnInit, HostListener } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { NavigationStart, Router, RouterEvent } from '@angular/router';


@Component({
  selector: 'app-dialog-ver-editar-nuevo',
  templateUrl: './dialog-ver-editar-nuevo.component.html',
  styleUrls: ['./dialog-ver-editar-nuevo.component.css']
})
export class DialogVerEditarNuevoComponent implements OnInit {
  listA: string[];
  listB: string[];
  elementoLista: string;
  accion: string;
  modificado: boolean;
  errorListas: boolean;
  form: FormGroup;

  constructor(public dialogRef: MatDialogRef<DialogVerEditarNuevoComponent> ,
              @Inject (MAT_DIALOG_DATA) private data,
              private elementoReferencia: ElementRef,
              private formBuilder: FormBuilder) {
    dialogRef.disableClose = true;
    this.buildForm();

   }

   ngOnInit(): void {
     this.accion = this.data.accion;
     this.listA = ['prueba', 'prueba2', 'prueba3', 'prueba4', 'prueba5', 'prueba6', 'prueba7', 'prueba8'];
     this.listB = [];
     this.tipoFormularioAccion();
    }

      // Inicializa el formulario reactivo, aquí es donde se crean los controladores de los inputs
  private buildForm(){
    this.form = this.formBuilder.group({
      id: [''],
      descripcion: ['',[Validators.required]],
      estado: ['']
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

  get campoId(){
    return this.form.get('id');
  }

  get campoDescripcion(){
    return this.form.get('descripcion');
  }

  get campoEstado(){
    return this.form.get('estado');
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
      this.campoEstado.disable();
      break;
    default:
      this.form.enable();
  }
}

 // Devuelve true si el usuario interactuó con el formulario o false si no.
 obtenerEstadoFormulario(): boolean{
  return this.modificado;
}

listaTienePermisos(){
  if (this.listB.length === 0){
    this.errorListas = true;
  } else{
    this.errorListas = false;
  }
}

// Guarda las modificaciones o acciones hechas en el dialog
guardar() {
  // event.preventDefault();
  if (this.form.valid && !this.errorListas){
    const value = this.form.value;
    alert('Datos guardados exitosamente');
    console.log(value);
  }else{
    this.form.markAllAsTouched();
    this.errorListas = true;
  }
}

cerrarDialog(): void{
  this.dialogRef.close();
}

// Función para recibir el item que fué seleccionado en una de las listas
  itemSeleccionado(e: Event): void{
    this.cambiarAspectoLista();
    const ELEMENT  = (e.target as Element);
    ELEMENT.classList.add('item-selected');
    this.elementoLista = ELEMENT.innerHTML;
  }

  // Cambia el aspecto de los elementos de la lista. Al seleccionar uno nuevo, quita la clase
  // .item-selected de aquellos elementos que lo tenían
  cambiarAspectoLista(): void{
    let coincidenciasQuery = this.elementoReferencia.nativeElement.querySelectorAll('li.item-selected');
    if (coincidenciasQuery.lenght !== null){
      for (let li of coincidenciasQuery){
        li.classList.remove('item-selected');
      }
    }
  }

  // FUNCION QUE VERIFICA SI EL ELEMENTO SELECCIONADO SE ENCUENTRA EN LA LISTA DE ORIGEN
  // CON EL FIN, POR EJEMPLO,DE QUE SI SE SELECCIONA ELEMENTO DE "LISTA A" Y SE DA CLICK EN BOTON
  // QUE TRANSFIERE DE "LISTA B" A "LISTA A" LE INDIQUE ERROR,  PUESTO QUE DICHO ELEMENTO
  // NO PERTENECE A LA LISTA DE ORIGEN Y YA EXISTE EN LA DE DESTINO.

  existenciaEnLista(listaOrigen: string[], listaDestino: string[]): boolean{
    let validacionExistencia: boolean;
    if (listaOrigen.includes(this.elementoLista)){
      validacionExistencia =  true;
    }else{
      alert('OPERACION INVALIDA; debe seleccionar elemento de lista contraria para transferir.');
      validacionExistencia = false;
    }
    return validacionExistencia;
  }

  // FUNCION QUE SE LLAMA PARA TRANFERIR ELEMENTO DE "LISTA A" A "LISTA B"
  cambiarListAListB(): void{
    let validacion = this.existenciaEnLista(this.listA, this.listB);
    if (validacion){
        this.modificarListas(this.listA, this.listB);
        this.listaTienePermisos();
      }
  }

  // FUNCION QUE SE LLAMA PARA TRANFERIR ELEMENTO DE "LISTA B" A "LISTA A"
  cambiarListBListA(): void{
    let validacion = this.existenciaEnLista(this.listB, this.listA);
    if (validacion){
      this.modificarListas(this.listB, this.listA);
      this.listaTienePermisos();
      }
  }

  // Modificación de las listas cambiando el elemento de la lista de origen hacia
  // lista destino. Se verifica previamente existen de elemento en lista con función
  // existenciaEnLista(listaOrigen,listaDestino)
  modificarListas(listaOrigen: string[], listaDestino: string[]): void{
      listaDestino.push(this.elementoLista);
      const index: number = listaOrigen.indexOf(this.elementoLista);
      listaOrigen.splice(index, 1);
  }


}
