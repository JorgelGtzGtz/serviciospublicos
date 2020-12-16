import { ReadVarExpr } from '@angular/compiler';
import { Injectable } from '@angular/core';
import { Usuario } from '../Interfaces/IUsuario';
import { ImagenM } from '../Models/ImagenM';
import { UsuarioService } from './usuario.service';
import { HttpClient } from '@angular/common/http';
import { Imagen } from '../Interfaces/IImagen';

@Injectable({
  providedIn: 'root'
})
export class ImagenService {
  url = 'http://localhost:50255/api/Imagen';
  urlParaFotos = 'http://localhost:50255/';
  photosList: File[];
  listaImagenObjeto: ImagenM[];

  constructor(private http: HttpClient,private usuarioService: UsuarioService) { }


  obtenerPathImagen(formData: FormData){
    return this.http.post(this.url + '/SubirImagenApi', formData);
  }  
              
  // Recibe la lista de Files con las imágenes
  // que se seleccionaron en el input type = file
  // no devuelve nada.
  setListaImagenesSel(listaFiles: File[]){
    this.photosList = listaFiles;    
  }

  // No recibe argumentos
  // Devuelve la variable photoList que contiene 
  // la lista de imágenes que se seleccionaron en input type=file.
  getListaImagenesSel(): File[]{
    return this.photosList;
  }

  getListaImagenObjeto(){
    return this.listaImagenObjeto;
  }

  convertirDesdeJSON(imagen: Imagen){
    return ImagenM.imagenDesdeJson(imagen);
  }

  generarObjImagen(pathPhoto: string, tipo: number, idReporte: number, idTicket: number): ImagenM{
    const imagen = new ImagenM (
      0,
      pathPhoto,
      idReporte,
      idTicket,
      tipo
    );
    return imagen;
  }

  generarFormData(photo: File, index: string): FormData{
    const usuario: Usuario = this.usuarioService.obtenerUsuarioLogueado();
    const formData = new FormData();
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth();
    const year = date.getFullYear();
    const hour = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();
    const photoName =
    index + '-' +
    usuario.Login_usuario + '-' +
    day + '-' +
    month + '-' +
    year + '-' +
    hour + '-' +
    minutes + '-' +
    seconds + 
    '.jpg';
    var blob = new Blob([photo], { type: "image/jpg"});
    formData.append('photo', blob, photoName);
    return formData;
  }

  readThis(file: File[]): string[] {
    console.log('ENTRO AL READER CON EL ARCHIVO:', file);
    let urlImage: string[] = [];
    for (let i = 0; i < file.length ; i++){
      const myReader: FileReader = new FileReader();
      myReader.readAsDataURL(file[i]);
      myReader.onload = (event: any) => {
        urlImage.push( event.target.result);
      } 
    }   
   return urlImage;
  }

  generarPathImagen(formData: FormData): Promise<string>{
    return new Promise((resolved, reject) => {
      this.obtenerPathImagen(formData).toPromise()
      .then((path:string) => {
        console.log('path exitoso:', path);
        resolved(path);
      })
      .catch(error =>{
        console.log('Error:' + error);        
        reject(error);
      });
    });     
  }

  async llenarListaImagenApertura(): Promise<ImagenM[]>{
    const photosList = this.photosList;
    const listaImagenObjeto: ImagenM [] = [];

    for (let i = 0; i < photosList.length; i++ ){
          const formData: FormData = this.generarFormData(photosList[i], i.toString());
          const path = await this.generarPathImagen(formData);
          console.log('PATH:', path);
          const pathPhoto: string = path.toString();
          console.log('pathPhoto:', pathPhoto);          
          const imagen = this.generarObjImagen(pathPhoto, 1, 0, 0);
          listaImagenObjeto.push(imagen);
    }

    return listaImagenObjeto;
  }
  
}
