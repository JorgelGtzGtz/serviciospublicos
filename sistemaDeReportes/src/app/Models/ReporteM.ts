import { Reporte } from '../Interfaces/IReporte';

export class ReporteM implements Reporte{


static reporteDesdeJson(obj: Object){
    return new ReporteM(
        obj['ID_reporte'],
        obj['ID_tipoReporte'],
        obj['Latitud_reporte'],
        obj['Longitud_reporte'],
        obj['FechaRegistro_reporte'],
        obj['FechaCierre_reporte'],
        obj['NoTickets_reporte'],
        obj['Estatus_reporte'],
        obj['ID_sector'],
        obj['ID_cuadrilla'],
        obj['TiempoEstimado_reporte'],
        obj['TiempoRestante_reporte'],
        obj['Direccion_reporte'],
        obj['EntreCalles_reporte'],
        obj['Referencia_reporte'],
        obj['Colonia_reporte'],
        obj['Poblado_reporte'],
        obj['Observaciones_reporte'],
        obj['Origen']
    );
}

constructor(
    public ID_reporte: number,
    public ID_tipoReporte: number,
    public Latitud_reporte: number,
    public Longitud_reporte: number,
    public FechaRegistro_reporte: string,
    public FechaCierre_reporte: string,
    public NoTickets_reporte: number,
    public Estatus_reporte: number,
    public ID_sector: number,
    public ID_cuadrilla: number,
    public TiempoEstimado_reporte: number,
    public TiempoRestante_reporte: number,
    public Direccion_reporte: string,
    public EntreCalles_reporte: string,
    public Referencia_reporte: string,
    public Colonia_reporte: string,
    public Poblado_reporte: string,
    public Observaciones_reporte: string,
    public Origen: number
){

}
}