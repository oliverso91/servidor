import { Tabla } from "../TablaSimbolos/Tabla";
import { Arbol } from "../TablaSimbolos/Arbol";
import { Node } from "../Abstract/Node";
import { Excepcion } from "../Excepcion/Excepcion";

export class Identificador extends Node {
    identificador: String;
    constructor(identificador:String, fila: number, columna: number) {
        super(null, fila, columna);
        this.identificador = identificador;
        this.fila = fila;
        this.columna = columna;
    }

    analizar(tabla: Tabla, arbol: Arbol) : any{
        // Verificar que existe la variable
        const exists = tabla.getVariable(this.identificador);
        if (exists === null) {
            const excepcion = new Excepcion('Semantico', `No existe la variable ${this.identificador}`, this.fila, this.columna);
            arbol.errores.push(excepcion);
            return excepcion;
        }
        this.tipo = exists.tipo;
        return exists.tipo;
    }

    getC3D(tabla: Tabla, arbol: Arbol) : String{
        let codigo = '';
        let variable = tabla.getVariable(this.identificador);
        if (!tabla.ambito) {
            codigo += `${tabla.getTemporal()} = heap[${variable.posicion}]\n`;
        } else {
            let temp = tabla.getTemporal();
            codigo += `${temp} = P\n`;
            codigo += `${temp} = ${temp} + ${variable.posicion}\n`;
            codigo += `${tabla.getTemporal()} = stack[${temp}]\n`;
        }
        tabla.AgregarTemporal(tabla.getTemporalActual());
        return codigo;
    }
}