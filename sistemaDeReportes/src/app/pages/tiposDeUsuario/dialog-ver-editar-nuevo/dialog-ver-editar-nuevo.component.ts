import { Component, ElementRef, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DialogService } from '../../../services/dialog-service.service';
import { TipoUsuarioService } from '../../../services/tipo-usuario.service';
import { ProcesoPermisoService } from '../../../services/proceso-permiso.service';
import { TipoUsuario } from '../../../Interfaces/ITipoUsuario';
import { ProcesoPermiso } from 'src/app/Interfaces/IProcesoPermiso';
import { ProcesoPermisoM } from '../../../Models/ProcesoPermisoM';
import { Permiso } from '../../../Interfaces/IPermiso';
import { PermisoM } from '../../../Models/PermisoM';
import { PermisoService } from '../../../services/permiso.service';
import { TipoUsuarioM } from '../../../Models/TipoUsuarioM';
import { catchError } from 'rxjs/operators';


@Component({
  selector: 'app-dialog-ver-editar-nuevo',
  templateUrl: './dialog-ver-editar-nuevo.component.html',
  styleUrls: ['./dialog-ver-editar-nuevo.component.css']
})
export class DialogVerEditarNuevoComponent implements OnInit {
  listaProcesos: ProcesoPermiso[] = [];
  listaProcTipo: ProcesoPermiso[] = [];
  procesosSistema: ProcesoPermiso[] = [];
  elementoLista: ProcesoPermiso;
  accion: string;
  modificado: boolean;
  errorListas: boolean;
  form: FormGroup;
  tipoUsuario: TipoUsuario;

  constructor(public dialogRef: MatDialogRef<DialogVerEditarNuevoComponent> ,
              @Inject (MAT_DIALOG_DATA) private data,
              private dialogService: DialogService,
              private elementoReferencia: ElementRef,
              private formBuilder: FormBuilder,
              private tipoService: TipoUsuarioService,
              private procesoServicio: ProcesoPermisoService,
              private permisoService: PermisoService) {
    this.buildForm();
   }

   ngOnInit(): void {
     this.accion = this.data.accion;
     this.tipoFormularioAccion();
     this.inicializarCampos();
     this.obtenerProcesosSistema();
    }

  // Inicializa el formulario reactivo, aquí es donde se crean los controladores de los inputs
  private buildForm(){
    this.form = this.formBuilder.group({
      id: [0],
      descripcion: ['', [Validators.required]],
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

  inicializarCampos(){
    if (this.accion !== 'nuevo'){
      this.campoId.setValue( this.tipoUsuario.ID_tipoUsuario);
      this.campoEstado.setValue(!this.tipoUsuario.Estatus_tipoUsuario);
      this.campoDescripcion.setValue(this.tipoUsuario.Descripcion_tipoUsuario);
    } else{
      this.campoEstado.setValue(false);
    }
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

  // Obtener procesos del sistema
  obtenerProcesosSistema(){
    this.procesoServicio.obtenerProcesosLista().subscribe( procesos => {
      console.log('Procesos:', procesos);
      this.listaProcesos = procesos;
      this.procesosSistema = procesos;
      if (this.accion !== 'nuevo'){
        this.obtenerPermisosActuales();
      }
    });
  }
  // Método para inicializar la lista de procesos
  // Según si es una actualización o nuevo registro
   obtenerProcesosDisponibles(){
     console.log('se ejecuta procesos disponibles');
     let aux = this.listaProcesos;
     this.listaProcesos = this.procesoServicio.procesosDisponibles(aux, this.listaProcTipo );
   }

   // Método para obtener los permisos actuales del tipo Usuario
   obtenerPermisosActuales(){
       this.permisoService.obtenerPermisosTipo(this.tipoUsuario.ID_tipoUsuario).subscribe( permisos => {
         console.log('Permisos', permisos);
         this.listaProcTipo = this.procesoServicio.descripcionPermiso(this.listaProcesos, permisos);
         if (this.accion !== 'nuevo'){
          this.obtenerProcesosDisponibles();
        }
       },
       err => {
         console.error(err);
         alert('Hubo un error al conseguir los permisos.');
       });
   }

 // Este método habilita o deshabilita el formulario según lo que se quiera hacer en el
//  ya sea ver información, crear nuevo registro o editar.
//  En "ver" todos los campos aparecen deshabilitados y en "nuevo" el único deshabilitado
//  es "activar"
tipoFormularioAccion(): void{
  switch (this.accion){
    case 'ver':
      this.form.disable();
      this.tipoUsuario = this.data.tipoU;
      break;
    case 'nuevo':
      this.campoEstado.disable();
      this.campoId.disable();
      break;
    default:
      this.form.enable();
      this.campoId.disable();
      this.tipoUsuario = this.data.tipoU;
  }
}

 // Devuelve true si el usuario interactuó con el formulario o false si no.
 obtenerEstadoFormulario(): boolean{
  return this.modificado;
}

listaTienePermisos(){
  if (this.listaProcTipo.length === 0){
    this.errorListas = true;
  } else{
    this.errorListas = false;
  }
}

// Función para recibir el item que fué seleccionado en una de las listas
  itemSeleccionado(e: Event): void{
    this.cambiarAspectoLista();
    const ELEMENT  = (e.target as Element);
    ELEMENT.classList.add('item-selected');
    this.elementoLista = this.procesoServicio.obtenerProceso(ELEMENT.innerHTML, this.procesosSistema);
    console.log('SE ASIGNA A ELEMENTO LISTA:', this.elementoLista);
    //this.elementoLista = ELEMENT.innerHTML;
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

  existenciaEnLista(listaOrigen: ProcesoPermiso[], listaDestino: ProcesoPermiso[]): boolean{
    let validacionExistencia: boolean;
    console.log('ELEMENTO EXISTENCIA:',this.elementoLista );
    console.log('LISTA A EVALUAR',listaOrigen );
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
    let validacion = this.existenciaEnLista(this.listaProcesos, this.listaProcTipo);
    if (validacion){
        this.modificarListas(this.listaProcesos, this.listaProcTipo);
        this.listaTienePermisos();
        this.modificado = true;
      }
  }

  // FUNCION QUE SE LLAMA PARA TRANFERIR ELEMENTO DE "LISTA B" A "LISTA A"
  cambiarListBListA(): void{
    let validacion = this.existenciaEnLista(this.listaProcTipo, this.listaProcesos);
    if (validacion){
      this.modificarListas(this.listaProcTipo, this.listaProcesos);
      this.listaTienePermisos();
      this.modificado = true;
      }
  }

  // Modificación de las listas cambiando el elemento de la lista de origen hacia
  // lista destino. Se verifica previamente existen de elemento en lista con función
  // existenciaEnLista(listaOrigen,listaDestino)
  modificarListas(listaOrigen: ProcesoPermiso[], listaDestino: ProcesoPermiso[]): void{
    console.log('lista origen:',listaOrigen, 'lista destino:', listaDestino);
    console.log('lista origen2:',this.listaProcesos, 'lista destino2:', this.listaProcTipo);
    listaDestino.push(this.elementoLista);
    const index: number = listaOrigen.indexOf(this.elementoLista);
    listaOrigen.splice(index, 1);
  }

  // Guarda las modificaciones o acciones hechas en el dialog
guardar() {
  // event.preventDefault();
  this.listaTienePermisos();
  if (this.form.valid && !this.errorListas){
    const tipo = this.generarTipo();
    this.accionGuardar(tipo);
    const value = this.form.value;
    alert('Datos guardados exitosamente');
    this.dialogRef.close();
    console.log(value);
  }else{
    this.form.markAllAsTouched();
    this.errorListas = true;
  }
}

generarTipo(){
  const estado = !this.campoEstado.value;
  return new TipoUsuarioM(
    this.campoId.value,
    this.campoDescripcion.value,
    estado
  );
}

// Método para saber si se actualizará o registrará un nuevo usuario
accionGuardar(tipo: TipoUsuario){
  if (this.accion === 'nuevo'){
      this.tipoService.insertarTipoUsuario(tipo, this.listaProcTipo).subscribe( res => {
        console.log('Registro respuesta: ', res);
      });
  }else if (this.accion === 'editar'){
      this.tipoService.actualizarTipoUsuario(tipo, this.listaProcTipo).subscribe(res => {
        console.log('Actualizar respuesta: ', res);
      });
  }
}


// Método que a través del método "verificarCambios" del servicio de DialogService
// verifica si el usuario interactuó con el formulario.
// Si la interacción sucedió se despliega un mensaje de confirmación.
cerrarDialog(): void{
  this.dialogService.verificarCambios(this.dialogRef);
}


}
