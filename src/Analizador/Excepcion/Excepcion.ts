/**
 * @class Nodo para almacenar errores ya sean lexicos, sintacticos o semanticos
 */
export class Excepcion {

    tipo: String;
    descripcion: String;
    fila: Number;
    columna: Number;

    /**
     * Devuelve un objeto con un nuevo objeto excepcion
     * @param tipo Tipo de error, e.g. (lexico, sintactico, semantico)
     * @param descripcion Descripcion del error, e.g. (No se encontro la variable X)
     * @param fila Fila donde ocurrio el error
     * @param columna Columna donde ocurrio el error
     */
    constructor(tipo: String, descripcion: String, fila: Number, columna: Number) {
        this.tipo = tipo;
        this.descripcion = descripcion;
        this.fila = fila;
        this.columna = columna;
    }

    toString(){
        return `${this.tipo} ${this.descripcion} ${this.fila} ${this.columna}`;
    }
}