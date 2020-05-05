import { Node } from "../Abstract/Node";
import { Tabla } from "../TablaSimbolos/Tabla";
import { Arbol } from "../TablaSimbolos/Arbol";
import { Excepcion } from "../Excepcion/Excepcion";

export class Mientras extends Node{
    condicion: Node;
    instrucciones: Array<Node>;
    constructor(condicion:Node, instrucciones:Array<Node>, fila: number, columna: number) {
        super(null, fila, columna);
        this.condicion = condicion;
        this.instrucciones = instrucciones;
    }

    analizar(tabla: Tabla, arbol: Arbol) : any{
        let cond = this.condicion.analizar(tabla, arbol);
        if (cond instanceof Excepcion) {
            return cond;
        }

        this.instrucciones.map(m => {
            let result = m.analizar(tabla, arbol);
            if (result instanceof Excepcion) {
                return result;
            }
        });
    }

    getC3D(tabla: Tabla, arbol: Arbol) : String{
        let codigo = '';
        let etiqueta = tabla.getEtiqueta();
        let condicion = this.condicion.getC3D(tabla, arbol);
        codigo += `${etiqueta}:\n`; // L1: 
        codigo += condicion;

        let temp = tabla.getTemporalActual();

        let etiqueta1 = tabla.getEtiqueta();
        let etiqueta2 = tabla.getEtiqueta();

        codigo += `if(${temp} == 1) goto ${etiqueta1}\n`
        codigo += `goto ${etiqueta2}\n`
        tabla.QuitarTemporal(temp);
        codigo += `${etiqueta1}:`
        this.instrucciones.map(m => {
            codigo += m.getC3D(tabla, arbol);
        });
        codigo += `goto ${etiqueta}\n`;

        codigo += `${etiqueta2}:\n`

        return codigo;
    }

}