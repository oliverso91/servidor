import { Node } from "../Abstract/Node";
import { Tabla } from "../TablaSimbolos/Tabla";
import { Arbol } from "../TablaSimbolos/Arbol";
import { Excepcion } from "../Excepcion/Excepcion";

export class Return extends Node {
    valor: Node;
    constructor(valor:Node, fila: number, columna: number) {
        super(null, fila, columna);
        this.valor = valor;
    }

    analizar(tabla: Tabla, arbol: Arbol): any {
        const result = this.valor.analizar(tabla, arbol);
        if (result instanceof Excepcion) {
            return result;
        }
        this.tipo = result;
        return this.tipo;
    }

    getC3D(tabla: Tabla, arbol: Arbol): String {
        let codigo = '';
        codigo += this.valor.getC3D(tabla, arbol);
        const etiqueta = tabla.getEtiqueta();
        codigo += `stack[P] = ${tabla.getTemporalActual()}\n`
        tabla.QuitarTemporal(tabla.getTemporalActual());
        codigo += `goto ${etiqueta}\n`;
        tabla.listaReturn.push(etiqueta);
        return codigo;
    }
}