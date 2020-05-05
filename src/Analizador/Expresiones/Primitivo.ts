import { Node } from "../Abstract/Node";
import { Tabla } from "../TablaSimbolos/Tabla";
import { Arbol } from "../TablaSimbolos/Arbol";
import { Tipo } from "../utils/Tipo";

export class Primitivo extends Node {
    valor: any;
    constructor(tipo:Tipo, valor:any, fila: number, columna: number) {
        super(tipo, fila, columna);
        this.valor = valor;
    }

    analizar(tabla: Tabla, arbol: Arbol): any {
        return this.tipo;
    }

    getC3D(tabla: Tabla, arbol: Arbol): String {
        const temporal = tabla.getTemporal();
        let c3d = `${temporal} = ${this.valor} \n`;
        tabla.AgregarTemporal(tabla.getTemporalActual());
        return c3d;
    }
}
