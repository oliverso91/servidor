import { Node } from "../Abstract/Node";
import { Tabla } from "../TablaSimbolos/Tabla";
import { Arbol } from "../TablaSimbolos/Arbol";
import { Excepcion } from "../Excepcion/Excepcion";

export class Si extends Node {
    condicion: Node;
    listaIf: Array<Node>;
    listaElse: Array<Node>;

    constructor(condicion: Node, listaIf: Array<Node>, listaElse: Array<Node>, fila: number, columna: number) {
        super(null, fila, columna);
        this.condicion = condicion;
        this.listaIf = listaIf;
        this.listaElse = listaElse;
        this.fila = fila;
        this.columna = columna;
    }
    // (a < b)
    analizar(tabla: Tabla, arbol: Arbol) : any{
        let cond = this.condicion.analizar(tabla, arbol);
        if (cond.constructor.name === 'Excepcion') {
            return cond;
        }

        if (cond.toString() == 'boolean') {

        }
        this.listaIf.map(m => {
            let result = m.analizar(tabla, arbol);
            if (result instanceof Excepcion) {
                return result;;
            }
        });

        this.listaElse.map(m => {
            let result = m.analizar(tabla, arbol);
            if (result instanceof Excepcion) {
                return result;;
            }
        });
    }

    getC3D(tabla: Tabla, arbol: Arbol) : String{
        let codigo = '';
        let condicion = this.condicion.getC3D(tabla, arbol);
        codigo += condicion;

        let temp = tabla.getTemporalActual();
        let etiquetaV = tabla.getEtiqueta();
        let etiquetaF = tabla.getEtiqueta();
        codigo += `if(${temp} == 1) goto ${etiquetaV}\n`;
        tabla.QuitarTemporal(temp);
        this.listaElse.map(m => {
            codigo += m.getC3D(tabla, arbol);
        });
        codigo += `goto ${etiquetaF}\n`;

        codigo += `${etiquetaV}:\n`;
        this.listaIf.map(m => {
            codigo += m.getC3D(tabla, arbol);
        });

        codigo += `${etiquetaF}:\n`;

        return codigo;
    }

}