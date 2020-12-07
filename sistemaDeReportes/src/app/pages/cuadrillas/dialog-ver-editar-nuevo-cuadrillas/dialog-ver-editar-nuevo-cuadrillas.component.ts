import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { DialogService } from '../../../services/dialog-service.service';
import { Cuadrilla } from '../../../Interfaces/ICuadrilla';
import { CuadrillaService } from '../../../services/cuadrilla.service';
import { UsuarioService } from '../../../services/usuario.service';
import { Usuario } from '../../../Interfaces/IUsuario';
import { CuadrillaM } from '../../../Models/CuadrillaM';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-dialog-ver-editar-nuevo-cuadrillas',
  templateUrl: './dialog-ver-editar-nuevo-cuadrillas.component.html',
  styleUrls: ['./dialog-ver-editar-nuevo-cuadrillas.component.css']
})
export class DialogVerEditarNuevoCuadrillasComponent implements OnInit {
  accion: string;
  form: FormGroup;
  modificado: boolean;
  idListo: boolean;
  cuadrilla: Cuadrilla;
  jefesCuadrillaDisp: Usuario[] = [];
  tipoCuadrilla: any = [1, 2, 3, 4];

  constructor(public dialogRef: MatDialogRef<DialogVerEditarNuevoCuadrillasComponent>,
              @Inject (MAT_DIALOG_DATA) private data,
              private dialogService: DialogService,
              private formBuilder: FormBuilder,
              private cuadrillaService: CuadrillaService,
              private usuarioService: UsuarioService) {
                dialogRef.disableClose = true;
                this.buildForm();
               }

  ngOnInit(): void {
    this.accion = this.data.accion;
    this.obtenerObjetoCuadrilla();
    this.obtenerJefesCuadrilla();
    this.inicializarCampos();
    this.tipoFormularioAccion();
    }

  // Método que inicializa el Form Reactive
  private buildForm(): void{
    this.form = this.formBuilder.group({
      id: [0, [Validators.required]],
      estado: [''],
      nombreC: ['', [Validators.required]],
      encargado: ['', [Validators.required]],
      tipoCuadrilla: ['', [Validators.required]]
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

  obtenerObjetoCuadrilla(): void{
    if (this.accion !== 'nuevo'){
      this.cuadrilla = this.cuadrillaService.convertirDesdeJSON(this.data.cuadrilla);
    }
  }

  // Método para inicializar los valores de los campos
  inicializarCampos(): void{
    if (this.accion !== 'nuevo'){
      this.campoNombreCuadrilla.setValue(this.cuadrilla.Nombre_cuadrilla);
      this.campoId.setValue(this.cuadrilla.ID_cuadrilla);
      this.campoEstado.setValue(!this.cuadrilla.Estatus_cuadrilla);
      this.campoTipoCuadrilla.setValue(this.cuadrilla.Tipo_cuadrilla);
      this.obtenerObjetoJefeActual();
    }else{
      this.campoEstado.setValue(false);
      this.obtenerIDNuevo();

    }
  }

  // Función para obtener el ID del nuevo registro
  obtenerIDNuevo(): void{
    this.cuadrillaService.obtenerIDRegistro().subscribe( (id: number) => {
      this.campoId.setValue(id);
      this.idListo = true;
    });
  }

// funcion para indicar al selector  si debe mostrar
// el nombre del usuario asignado como jefe a una cuadrilla
inicializarSelJefe(jefe: Usuario): boolean{
  let valor = false;
  if (this.cuadrilla !== undefined){
      if (jefe.ID_usuario === this.cuadrilla.ID_JefeCuadrilla){
          valor =  true;
         }
  }
  return valor;
}

// funcion para indicar al selector si debe mostrar el tipo
// de cuadrilla de una cuadrilla que se ve o edita
inicializarSelTipo(tipo: number): boolean{
  let valor = false;
  if (this.cuadrilla !== undefined){
       if (tipo === this.cuadrilla.Tipo_cuadrilla){
         valor =  true;
       }
    }
  return valor;
}

// Función para obtener la lista de los usuarios
// de tipo Jefe de cuadrilla que pueden ser asignados
  obtenerJefesCuadrilla(): void{
    this.usuarioService.obtenerJefesCuadrilla().subscribe( jefes => {
      jefes.forEach(jefe => {
        this.jefesCuadrillaDisp.push(jefe);
      });
    });
    console.log('Jefes', this.jefesCuadrillaDisp);
  }

  // Método que obtiene el objeto Usuario del ID_JefeCuadrilla que la cuadrilla tiene asociado
  // Y lo agrega a la lista de jefes de cuadrilla disponibles
  obtenerObjetoJefeActual(): void{
    this.usuarioService.obtenerUsuario(this.cuadrilla.ID_JefeCuadrilla).subscribe( usuario => {
      this.jefesCuadrillaDisp.push(usuario);
    });
  }

  get campoId(): AbstractControl{
    return this.form.get('id');
  }

  get campoEstado(): AbstractControl{
    return this.form.get('estado');
  }

  get campoNombreCuadrilla(): AbstractControl{
    return this.form.get('nombreC');
  }

  get campoEncargado(): AbstractControl{
    return this.form.get('encargado');
  }

  get campoTipoCuadrilla(): AbstractControl{
    return this.form.get('tipoCuadrilla');
  }

  // Devuelve true si el usuario interactuó con el formulario o false si no.
obtenerEstadoFormulario(): boolean{
  return this.modificado;
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
        this.campoEstado.setValue(false);
        this.campoEstado.disable();
        this.campoId.disable();
        break;
      default:
        this.form.enable();
        this.campoId.disable();
    }
  }

  // Método para obtener el ID del usuario jefe de cuadrilla
  // que se seleccionó
  jefeSeleccionado(nombre: string): number{
    let idJefe: number;
    this.jefesCuadrillaDisp.forEach(usuarioJefe => {
      if (nombre === usuarioJefe.Nombre_usuario){
        idJefe = usuarioJefe.ID_usuario;
      }
    });
    return idJefe;
  }

  // Metodo para crear un nuevo objeto cuadrilla para ser registrado
  generarNuevaCuadrilla(): CuadrillaM{
    return new CuadrillaM(
      this.campoId.value,
      this.campoNombreCuadrilla.value,
      this.campoEstado.value,
      this.campoTipoCuadrilla.value,
      this.jefeSeleccionado(this.campoEncargado.value)
    );
  }

// Método que se llama cuando se le da click en guardar en el formulario.
guardar(): void {
  // event.preventDefault();
  if (this.form.valid){
    this.accionGuardar();
    this.dialogRef.close(this.data);
  } else{
    this.form.markAllAsTouched();
  }
}

// Método que llama al servicio Cuadrilla para peticiones HTTP
accionGuardar(): void{
  const cuadrilla = this.generarNuevaCuadrilla();
  if (this.accion === 'nuevo'){
    this.cuadrillaService.insertarCuadrilla(cuadrilla).subscribe( res => {
      alert('¡Registro de cuadrilla ' + cuadrilla.Nombre_cuadrilla + ' exitoso!');
    }, (error: HttpErrorResponse) => {
          alert('El registro no pudo ser completado. Error:' );
    });
  } else{
    this.cuadrillaService.actualizarCuadrilla(cuadrilla).subscribe( res => {
      alert('¡Cuadrilla ' + cuadrilla.Nombre_cuadrilla  + ' se han actualizado exitosamente!');
    }, (error: HttpErrorResponse) => {
          alert('Cuadrilla no pudo ser actualizado. Error:' );
    });
  }
}

// Método que muestra un mensaje, al dar click en guardar.
// El contenido del mensaje depende de si está actualizando datos o creando nuevo registro
mensajeDeGuardado(): void{
  if (this.accion === 'editar'){
    alert('¡Los datos se han actualizado exitosamente!');
  } else{
    alert('¡Registro exitoso!');
  }
}

// Método que a través del método "verificarCambios" del servicio de DialogService
// verifica si el usuario interactuó con el formulario.
// Si la interacción sucedió se despliega un mensaje de confirmación.
cerrarDialog(): void{
  this.dialogService.verificarCambios(this.dialogRef);
}

}
