import {Tipo} from "../utils/Tipo";
import {Funcion} from "../Instrucciones/Funcion";
/**
 * @class SimboloFuncion Representa un nodo de la tabla de funciones
 */
export class SimboloFuncion {
    tipo: Tipo;
    identificador: String;
    parametros: number;
    size_function: number;
    funcion: Funcion;

    /**
     * 
     * Crea un nodo para almacenar en la tabla de funciones, ademas estos 
     * datos son los que se van a visualizar en el reporte de funciones en el front
     * 
     * @constructor
     * @param {Tipo} tipo Tipo de la funcion
     * @param {String} identificador Nombre de la función
     * @param {Number} parametros Cantidad de parametros de la función
     * @param {Number} size_function Cantidad de variables locales que la función posee
     * @param {Funcion} funcion El objeto completo de la funcion
     */
    constructor(tipo: Tipo, identificador: String, parametros: number, size_function: number, funcion: Funcion) {
        this.tipo = tipo;
        this.identificador = identificador;
        this.parametros = parametros;
        this.size_function = size_function;
        this.funcion = funcion;
    }
}