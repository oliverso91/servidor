import { Node } from "../Abstract/Node";
import { Arreglo } from "./Arreglo";
import { Arbol } from "../TablaSimbolos/Arbol";
import { Tabla } from "../TablaSimbolos/Tabla";
import { Tipo, Types } from "../utils/Tipo";

export class Cadena extends Node{
    cadena: String;
    arreglo: Arreglo;

    constructor(cadena: String, arreglo: Arreglo, fila: number, columna: number) {
        super(new Tipo(Types.STRING), fila, columna);
        this.cadena = cadena;
        this.arreglo = arreglo;
    }

    analizar(tabla: Tabla, arbol: Arbol) : any{
        return this.tipo;
    }

    getC3D(tabla: Tabla, arbol: Arbol) : String{
        let codigo = this.arreglo.getC3D(tabla, arbol);
        let temporal = tabla.getTemporalActual(); // Posicion de inicio de arreglo
        let temporal1 = tabla.getTemporal(); // TempAux
        codigo += `${temporal1} = ${temporal}\n`;
        tabla.AgregarTemporal(temporal1);
        codigo += `${temporal} = ${temporal} + 1\n`
        tabla.QuitarTemporal(temporal);
        for (let i = 0; i < this.cadena.length; i++) {
            console.log(this.cadena[i].charCodeAt(0));
            codigo += `heap[${temporal}] = ${this.cadena[i].charCodeAt(0)}\n`
            codigo += `${temporal} = ${temporal} + 1\n`
        }
        return codigo;
    }
}