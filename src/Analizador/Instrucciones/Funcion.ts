import { Node } from "../Abstract/Node";
import { Tipo } from "../utils/Tipo";
import { Tabla } from "../TablaSimbolos/Tabla";
import { Arbol } from "../TablaSimbolos/Arbol";
import { Excepcion } from "../Excepcion/Excepcion";
import { Declaracion } from "./Declaracion";

export class Funcion extends Node{
    nombre: String;
    parametros: Array<Declaracion>;
    instrucciones: Array<Node>;

    constructor(tipo: Tipo, nombre: String, parametros: Array<Declaracion>, instrucciones: Array<Node>, fila: number, columna: number) {
        super(tipo, fila, columna);
        this.nombre = this.getNombreFuncion(nombre, parametros);
        this.parametros = parametros;
        this.instrucciones = instrucciones;
    }

    analizar(tabla: Tabla, arbol: Arbol) : any{
        // Agregar los parametros a la TS
        this.parametros.map(m => {
            m.analizar(tabla, arbol);
        });

        // validar que todas las instrucciones son validas semanticamente
        console.log(this.instrucciones)
        this.instrucciones.map(m => {
            m.analizar(tabla, arbol);
        });
    }

    getC3D(tabla: Tabla, arbol: Arbol) : String {
        const existeFuncion = tabla.getFuncion(this.nombre);
        tabla.sizeActual.push(existeFuncion.size_function);
        tabla.ambito = true;
        let codigo = `proc ${this.nombre} begin\n`;
        this.instrucciones.map(m => {
            codigo += m.getC3D(tabla, arbol);
        });

        tabla.listaReturn.map(m => {
            codigo += `${m}:\n`
        });
        codigo += `end\n\n\n\n`
        tabla.ambito = false;
        tabla.listaReturn = [];
        tabla.sizeActual.pop();
        tabla.tempStorage = [];
        return codigo;
    }

    getNombreFuncion(nombre: String, parametros: Array<Node>) {
        // El nombre de la funcion va a estar dado por el nombre + el tipo de cada parametro
        // Esto con el fin de diferenciar mas facilmente las funciones y poder crear sobrecarga
        const tipos_parametros : Array<String> = [];
        parametros.map(m => {
            tipos_parametros.push(m.tipo.toString());
        });
        return tipos_parametros.length == 0 ?
            `${nombre}` :
            `${nombre}_${tipos_parametros.join('_')}`;
    }
}