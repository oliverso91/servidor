import {Tabla} from "../TablaSimbolos/Tabla";
import {Arbol} from "../TablaSimbolos/Arbol";
import {Tipo} from "../utils/Tipo";
import {Types} from "../utils/Tipo";
export abstract class Node {
    fila: Number;
    columna: Number;
    tipo: Tipo;

    /**
     * @abstract Sirve para validar la semantica de las intrucciones, este metodo se debe
     * sobreescribir en cada clase donde sea implementado
     * @param {Tabla} tabla Tabla de simbolos global
     * @param {Arbol} arbol Arbol que contiene las instrucciones y excepciones
     * @return {Tipo} Si se implementa en una expresion debe devolver tipo, si estuviera en expresion devuelve nada
     */
    abstract analizar(tabla: Tabla, arbol: Arbol): any;

    /**
     * @abstract Sirve para generar codigo en direcciones dependiendo de la instruccion o expresion 
     * @param {Tabla} tabla Tabla de simbolos global
     * @param {Arbol} arbol Arbol que contiene las instrucciones y excepciones
     * @param arbol 
     */
    abstract getC3D(tabla: Tabla, arbol: Arbol): String;
 
    /**
     * 
     * @constructor Base para cualquier instruccion o expresion, omitir tipo si fuera una instruccion
     * @param tipo Tipo de la expresion, si fuera una expresion poner valor de nulo
     * @param fila Linea de la instruccion o expresion
     * @param columna columna de la instruccion o expresion
     */
    constructor(tipo: Tipo, fila: Number, columna: number) {
        this.tipo = tipo;
        this.fila = fila;
        this.columna = columna;
    }
}