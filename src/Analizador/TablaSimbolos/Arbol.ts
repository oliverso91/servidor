import {Node} from "../Abstract/Node";
import {Excepcion} from "../Excepcion/Excepcion";
/**
 * @class Almacena el ast y la lista de excepciones
 */
export class Arbol {
    instrucciones: Array<Node>
    errores: Array<Excepcion>
    console: Array<String>

     /**
     * Retorna un arbol con 2 atributos: 1 ast y 1 lista de excepciones
     * @param instrucciones AST generado por la gramatica
     */
    constructor(instrucciones : Array<Node>) {
        this.instrucciones = instrucciones;
        this.errores = new Array<Excepcion>();
        this.console = new Array<String>();
    }
}