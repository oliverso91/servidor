import {Tipo} from "../utils/Tipo";

/**
 * @class Esta clase me permite almacenar información relevante de variables
 */
export class Simbolo {
    tipo: Tipo;
    identificador: String;
    posicion: number;
    
    /**
     * @constructor Devuelve un simbolo para almacenar en mi tabla
     * @param {Tipo} type Tipo de la varible
     * @param {String} identifier Nombre de la variable
     * @param {number} posicion Posicion que ocupa la variable en el heap o stack
     */
    constructor(tipo: Tipo, identificador: String, posicion: number) {
        this.tipo = tipo;
        // this.type = tipo.toString();
        this.identificador = identificador;
        this.posicion = posicion;
    }
}