import { Node } from "../Abstract/Node";
import { Arbol } from "../TablaSimbolos/Arbol";
import { Tabla } from "../TablaSimbolos/Tabla";
import { Excepcion } from "../Excepcion/Excepcion";
import { Tipo, Types } from "../utils/Tipo";

export class OperacionRelacional extends Node {
    izquierdo: Node;
    derecho: Node;
    operador: String;

    constructor(izquierdo: Node, derecho: Node, operador: String, fila: number, columna: number) {
        super(null, fila, columna);
        this.izquierdo = izquierdo;
        this.derecho = derecho;
        this.operador = operador;
    }

    analizar(tabla: Tabla, arbol: Arbol): any {
        const op1 = this.izquierdo.analizar(tabla, arbol);
        if (op1 instanceof Excepcion) {
            return op1;
        }

        const op2 = this.derecho.analizar(tabla, arbol);
        if (op2 instanceof Excepcion) {
            return op2;
        }

        if (op1.toString() == 'numeric' && op2.toString() == 'numeric') {
            this.tipo = new Tipo(Types.BOOLEAN);
            return this.tipo;
        }
    }

    getC3D(tabla: Tabla, arbol: Arbol): String {
        let c3d = '';

        c3d += this.izquierdo.getC3D(tabla, arbol);
        const temporalIzq = tabla.getTemporalActual();

        c3d += this.derecho.getC3D(tabla, arbol);
        const temporalDer = tabla.getTemporalActual();

        const etiquetaV = tabla.getEtiqueta();
        const etiquetaF = tabla.getEtiqueta();
        // 3 == 3
        const temp = tabla.getTemporal();
        c3d += `if(${temporalIzq} ${this.operador} ${temporalDer}) goto ${etiquetaV} \n`;
        c3d += `${temp} = 0\n`;
        c3d += `goto ${etiquetaF}\n`;
        c3d += `${etiquetaV}: \n`;
        c3d += `${temp} = 1\n`;
        c3d += `${etiquetaF}: \n`;

        tabla.AgregarTemporal(temp);
        tabla.QuitarTemporal(temporalIzq);
        tabla.QuitarTemporal(temporalDer);
        return c3d;
    }
}