export enum Types {
    NUMERIC,
    STRING,
    BOOLEAN,
    VOID
}

/**
 * 
 * @class Permite llevar el control de los tipos del lenguaje
 */
export class Tipo {
    tipo: Types;
    tipoExplicito: String;
    dimensiones: Number;
    
    /**
     * 
     * @constructor Crea un nuevo tipo con el tipo primitivo indicado en el enum
     * @param {Types} type Tipo seleccionado para la variable o funcion
     * @param {Number} dimensiones Cantidad de dimensiones de arreglo (Solo soporta 1 dim :( )
     * 
     */
    constructor(tipo: Types, dimensiones: Number = 0) {
        this.tipo = tipo;
        this.dimensiones = dimensiones;
        this.tipoExplicito = this.toString();
    }

    toString() {
        if (this.dimensiones == 0) {
            return (Types[this.tipo]).toLowerCase()
        } else {
            return ('arreglo_' + Types[this.tipo]).toLowerCase();
        }
    }
}