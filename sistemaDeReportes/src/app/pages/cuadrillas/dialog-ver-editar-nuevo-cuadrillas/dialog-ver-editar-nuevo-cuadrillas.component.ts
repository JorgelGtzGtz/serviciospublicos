import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
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
                this.obtenerJefesCuadrilla();
               }

  ngOnInit(): void {
    this.accion = this.data.accion;
    this.inicializarPantalla();
    }

  private buildForm(){
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
      console.log('Value:', value);
    });
  }

  inicializarPantalla(){
    if (this.accion !== 'nuevo'){
      this.obtenerCuadrilla();
    }
    this.obtenerJefesCuadrilla();
    this.tipoFormularioAccion();
  }

  obtenerCuadrilla(){
    let auxC: Cuadrilla = this.data.cuadrilla;
    this.cuadrillaService.obtenerCuadrilla(auxC.ID_cuadrilla).subscribe( cuadrillaRes => {
      this.cuadrilla = cuadrillaRes;
      console.log('Cuadrilla', cuadrillaRes);
    });
  }

  llenarCampos(){
    this.campoId.setValue(this.cuadrilla.ID_cuadrilla);
    this.campoEstado.setValue(this.cuadrilla.Estatus_cuadrilla);
    this.campoNombreCuadrilla.setValue(this.cuadrilla.Nombre_cuadrilla);
    this.campoTipoCuadrilla.setValue(this.cuadrilla.Tipo_cuadrilla);
  }

// funcion para indicar al selector tipoUsuario si debe mostrar
// el tipo de usuario de un usuario, cuando se está editando
inicializarSelJefe(idJefe: number){
  let valor = false;
  if (this.cuadrilla !== undefined){
      if (idJefe === this.cuadrilla.ID_JefeCuadrilla){
           valor =  true;
         }
  }
  return valor;
}

  obtenerJefesCuadrilla(){
    this.usuarioService.obtenerJefesCuadrilla().subscribe( jefes => {
      this.jefesCuadrillaDisp = jefes;
    });
  }

  get campoId(){
    return this.form.get('id');
  }

  get campoEstado(){
    return this.form.get('estado');
  }

  get campoNombreCuadrilla(){
    return this.form.get('nombreC');
  }

  get campoNombreEncargado(){
    return this.form.get('encargado');
  }

  get campoTipoCuadrilla(){
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

  obtenerJefeSeleccionado(){
    let idJefe: number;
    this.jefesCuadrillaDisp.forEach(jefe => {
      if (jefe.Nombre_usuario === this.campoNombreEncargado.value ){
        idJefe = jefe.ID_usuario;
      }
    });
    return idJefe;
  }
  // Metodo para crear un nuevo objeto cuadrilla para ser registrado
  generarNuevaCuadrilla(){
    return new CuadrillaM(
      this.campoId.value,
      this.campoNombreCuadrilla.value,
      this.campoEstado.value,
      this.campoTipoCuadrilla.value,
      this.obtenerJefeSeleccionado()
    );
  }

// Método que se llama cuando se le da click en guardar en el formulario.
guardar() {
  // event.preventDefault();
  if (this.form.valid){
    this.accionGuardar();
    this.dialogRef.close(this.data);
  } else{
    this.form.markAllAsTouched();
  }
}

accionGuardar(){
  const cuadrilla = this.generarNuevaCuadrilla();
  console.log('Cuadrilla a guardar:', cuadrilla);

  if (this.accion === 'nuevo'){
    this.cuadrillaService.insertarCuadrilla(cuadrilla).subscribe( res => {
      alert('¡Registro de cuadrilla ' + cuadrilla.Nombre_cuadrilla + ' exitoso!');
    }, (error: HttpErrorResponse) => {
          alert('El registro no pudo ser completado. Error:' );
          console.log('Error: ' + error.message);
    });
  } else{
    this.cuadrillaService.actualizarCuadrilla(cuadrilla).subscribe( res => {
      alert('¡Cuadrilla ' + cuadrilla.Nombre_cuadrilla  + ' se han actualizado exitosamente!');
    }, (error:HttpErrorResponse) => {
          alert('Cuadrilla no pudo ser actualizado. Error:' );
          console.log('Error: ' + error.message);
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
