import { Simbolo } from "../TablaSimbolos/Simbolo";
import { SimboloFuncion } from "../TablaSimbolos/SimboloFuncion";

/**
 * @class En esta clase es donde vamos a guardar y obtener las variables y funciones
 * Ademas de manejas distintos atributos que nos serviran de base para generar C3D
 */
export class Tabla {
    variables: Array<Simbolo>;
    funciones: Array<SimboloFuncion>;
    temporal: number;
    etiqueta: number;
    heap: number;
    stack: number;
    tempStorage: Array<String>;
    ambito: Boolean;
    listaReturn: Array<String>;
    sizeActual: Array<number>;

    /**
     * @constructor Nos devuelve un nuevo objeto con los elementos necesarios para compilar
     * @param {Array<Simbolo>} variables Aqui se van a almacenar todos los simbolos de las variables
     * @param {Array<Simbolo>} funciones Aqui se van a almacenar todos los simbolos de las funciones
     * @param {number} temporal Contador que sirve de base para generar temporales, cuando se crea un temporal aumenta en 1 este atributo
     * @param {number} etiqueta Contador que sirve de base para generar etiquetas, cuando se crea una etiqueta aumenta en 1 este atributo
     * @param {Array<String>} tempStorage Lista que almacena los temporales que vamos almacenando
     * @param {Boolean} ambito Si fuera falso indica que estamos en el ambito global y si es verdadero estamos en un local
     * @param {Array<String>} listaReturn Lista de etiquetas(String) que utilizamos para almacenar las etiquetas de destino para el return
     * @param {Array<number>} sizeActual Tamaño del ambito donde me encuentro actualmente (el global vale 0)
     */
    constructor() {
        this.variables = [];
        this.funciones = [];
        this.temporal = 0;
        this.etiqueta = 0;
        this.heap = 0;
        this.stack = 0;
        this.tempStorage = [];
        this.ambito = false; // false = global, true = local
        this.listaReturn = [];
        this.sizeActual = [];
    }

    /**
     * @function setVariable Almacena un nuevo simbolo en la tabla de variables
     * @param {Simbolo} simbolo Simbolo que se va almacenar
     * @return {String} Si la variable ya existe retorna un string con un mensaje de error 
     * caso contrario retorna null que significa que la variable se ha insertado
     */
    setVariable(simbolo: Simbolo): String {
        for (let i of this.variables) {
            if (i.identificador === simbolo.identificador) {
                return `La variable ${simbolo.identificador} ya existe.`
            }
        }
        this.variables.push(simbolo);
        return null;
    }

    /**
     * @function getVariable Obtiene una variable por medio de su identificador
     * @param {String} identificador Nombre de la variable que queremos obtener
     * @return {Simbolo} Retorna el simbolo con la información de la variable, 
     * si se obtiene null es que no se encontro la variable
     */
    getVariable(identificador: String): Simbolo {
        for (let i of this.variables) {
            if (i.identificador === identificador) {
                return i;
            }
        }
        return null;
    }

    /**
     * @function setFuncion Almacena un nuevo simbolo en la tabla de funciones
     * @param {SimboloFuncion} simbolo Simbolo que se va almacenar
     * @return {String} Si la funcion ya existe retorna un string con un mensaje de error 
     * caso contrario retorna null que significa que la funcion se ha insertado
     */
    setFuncion(simbolo: SimboloFuncion): String {
        for (let i of this.funciones) {
            if (i.identificador === simbolo.identificador) {
                return `La funcion ${simbolo.identificador} ya existe.`
            }
        }
        this.funciones.push(simbolo);
        return null;
    }

    /**
     * @function getFuncion Obtiene una funcion por medio de su identificador
     * @param {String} identificador Nombre de la funcion que queremos obtener
     * @return {SimboloFuncion} Retorna el simbolo con la información de la funcion, 
     * si se obtiene null es que no se encontro la funcion
     */
    getFuncion(identificador: String): SimboloFuncion {
        for (let i of this.funciones) {
            if (i.identificador === identificador) {
                return i;
            }
        }
        return null;
    }

    /**
     * @function getTemporal Obtiene un nuevo temporal
     * @return {String} devuelve un temporal con el siguiente formato ^t[0-9]+$
     */
    getTemporal(): String {
        return "t" + ++this.temporal;
    }

    /**
     * @function getTemporalActual Obtiene el ultimo temporal generado
     * @return {String} devuelve un temporal con el siguiente formato ^t[0-9]+$
     */
    getTemporalActual(): String {
        return "t" + this.temporal;
    }

    /**
    * @function getHeap Lleva control de las variables globales en el heap, 
    * en cada llamada a este metodo incrementa el valor del atributo heap. 
    * @return {number} devuelve el valor actual del contador heap
    */
    getHeap(): number {
        return this.heap++;
    }

    /**
    * @function getStack Lleva control de las variables locales en el stack, 
    * en cada llamada a este metodo incrementa el valor del atributo stack. 
    * @return {number} devuelve el valor actual del contador stack
    */
    getStack(): number {
        return this.stack++;
    }

    /**
    * @method setStack Cambia el valor del atributo stack 
    * @param {number} value nuevo valor que sera asignado al atributo stack
    */
    setStack(value: number): void {
        this.stack = value;
    }

    /**
     * @function getEtiqueta Obtiene una nueva etiqueta
     * @return {String} devuelve una etiqueta con el siguiente formato ^L[0-9]+$
     */
    getEtiqueta(): String {
        return "L" + ++this.etiqueta;
    }

    /**
     * @function getEtiquetaActual Obtiene la ultima etiqueta generada
     * @return {String} devuelve una etiqueta con el siguiente formato ^t[0-9]+$
     */
    getEtiquetaActual(): String {
        return "L" + this.etiqueta;
    }

    /**
     * @method AgregarTemporal Agrega un temporal a la lista de temporales no utilizados
     * @param {String} temp Temporal que sera almacenado en la lista de temporales
     *  
     */
    AgregarTemporal(temp: String): void {
        if (this.tempStorage.indexOf(temp) == -1) {
            this.tempStorage.push(temp);
        }
    }

    /**
     * @method AgregarTemporal Quita un temporal de la lista de temporales no utilizados
     * @param {String} temp Temporal que sera removido de la lista de temporales
     *  
     */
    QuitarTemporal(temp: String): void {
        let index = this.tempStorage.indexOf(temp);
        if (index > -1) {
            this.tempStorage.splice(index, 1);
        }
    }
}