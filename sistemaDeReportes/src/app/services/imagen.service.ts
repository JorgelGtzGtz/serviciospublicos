import { Injectable } from '@angular/core';
import { Usuario } from '../Interfaces/IUsuario';
import { ImagenM } from '../Models/ImagenM';
import { UsuarioService } from './usuario.service';
import { HttpClient } from '@angular/common/http';
import { Imagen } from '../Interfaces/IImagen';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ImagenService {
  url = 'http://localhost:50255/api/Imagen';
  urlParaFotos = 'http://localhost:50255/';
  photosList: File[];
  listaImagenObjeto: ImagenM[];

  constructor(private http: HttpClient, private usuarioService: UsuarioService) { }


  // Entrada: FormData
  // Salida: Observable de tipo string.
  // Descripción: Petición de tipo POST para pasar las imágenes
  // seleccionadas en el input tipo file para ser guardadas en la API. Con este
  // se obtiene el path relativo de la imagen.
  obtenerPathImagen(formData: FormData): Observable<string>{
    return this.http.post<string>(this.url + '/SubirImagenApi', formData);
  }

  // Entrada: Lista tipo File
  // Salida: Vacio.
  // Descripción: Recibe la lista de Files con las imágenes
  // que se seleccionaron en el input type = file
  setListaImagenesSel(listaFiles: File[]): void{
    this.photosList = listaFiles;
  }

  // Entrada: Ninguna
  // Salida: Lista tipo File.
  // Descripción: Devuelve la variable photoList que contiene
  // la lista de imágenes que se seleccionaron en input type=file.
  getListaImagenesSel(): File[]{
    return this.photosList;
  }

  // Entrada: Objeto JSON con interface Imagen
  // Salida: Objeto ImagenM.
  // Descripción:Método que construye un objeto ImagenM, a partir de los datos
  // del objeto JSON.
  convertirDesdeJSON(imagen: Imagen): ImagenM{
    return ImagenM.imagenDesdeJson(imagen);
  }

  // Entrada: path de la imagen tipo string, tipo de imagen de tipo string, ID del reporte de tipo
  //          number,y ID del ticket de tipo number.
  // Salida: Objeto de tipo ImagenM.
  // Descripción: Método que construye un objeto ImagenM, con los datos proporcionados
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

  // Entrada: Objeto tipo File, index del mismo objeto de tipo string.
  // Salida: objeto FormaData.
  // Descripción: Método que a través de el File y el index de los parámetros
  // genera un nuevo formData que contiene los datos de la imagen, para 
  // poder ser enviados a la API
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
    const blob = new Blob([photo], { type: 'image/jpg'});
    formData.append('photo', blob, photoName);
    return formData;
  }

  // Entrada: lista de objetos tipos File
  // Salida: lista de tipo string con el url de la imagen.
  // Descripción: Método que obtiene las url de las imágenes que se seleccionaron
  //  en el input tipo file, para que el usuario visualize las imágenes que eligió.
  readThis(file: File[]): string[] {
    const urlImage: string[] = [];
    for (let i = 0; i < file.length ; i++){     
      if (file[i].type === 'image/jpeg' || file[i].type === 'image/png'){
          const myReader: FileReader = new FileReader();
          myReader.readAsDataURL(file[i]);
          myReader.onload = (event: any) => {
            urlImage.push( event.target.result);
        };
      }
    }
    return urlImage;
  }

  // Entrada: Objeto de tipo FormData con los datos del file seleccionado en el input.
  // Salida: Promesa de tipo string, con el path resultante.
  // Descripción: Método para transferir la imagen a la API, para posteriormente guardarse en la carpeta Photos.
  // regresa el path obtenido o en caso de algún error, regresa un path alternativo de errores.
  generarPathImagen(formData: FormData): Promise<string>{
    return new Promise((resolved, reject) => {
      this.obtenerPathImagen(formData).toPromise()
      .then((path: string) => {
        resolved(path);
      })
      .catch(error => {
        console.log('Error:' + error);
        reject('Photos/no-image.png');
      });
    });
  }

  // Entrada: Ninguna
  // Salida: promesa de tipo lista de tipo ImagenM, con los objetos ImagenM creados
  // Descripción: método para guardar las imágenes en la API y generar su path a 
  // partir de los archivos seleccionados en el input tipo file.
  async llenarListaImagen(tipo: number): Promise<ImagenM[]>{
    const photosList = this.photosList;
    const listaImagenObjeto: ImagenM [] = [];

    for (let i = 0; i < photosList.length; i++ ){
          const formData: FormData = this.generarFormData(photosList[i], i.toString());
          const path = await this.generarPathImagen(formData);
          const pathPhoto: string = path.toString();
          const imagen = this.generarObjImagen(pathPhoto, tipo, 0, 0);
          listaImagenObjeto.push(imagen);
    }
    return listaImagenObjeto;
  }

  // Entrada: Lista de tipo Imagen
  // Salida: lista de tipo string con los paths de las imágenes.
  // Descripción: método que verifica los paths de las imágenes y les da formato. En caso de no ser
  // un Path válido, pone el path con la imagen por default.
  llenarListaPathImagenes(imagenes: Imagen[]): string[]{
    const expresionRegular = /^Photos[\/].*\.(jpg|png)$/; // para buscar que tenga el formato correcto
    const listaPath: string[] = [];
    const defaultPhotoName = 'no-image.png';

    imagenes.forEach(imagen => {
      if (listaPath.length < 4){ // Solo se mostrarán 4 imágenes
        let path: string;
        const analisis: string [] = expresionRegular.exec(imagen.Path_imagen);
        if (analisis !== null){
          path = this.urlParaFotos + imagen.Path_imagen;
        }else{
          path = this.urlParaFotos + 'Photos/' + defaultPhotoName;
        }
        listaPath.push(path);
      }
      });
    return listaPath;
  }

  // // Entrada: Ninguna
  // // Salida: vacío.
  // // Descripción:
  // generarSrcAlterno(): string{
  //   const defaultPhotoName = 'no-image.png';
  //   return this.urlParaFotos + 'Photos/' + defaultPhotoName;
  // }

}
