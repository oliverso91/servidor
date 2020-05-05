import { Node } from "../Abstract/Node";
import { Tabla } from "../TablaSimbolos/Tabla";
import { Arbol } from "../TablaSimbolos/Arbol";
import { Tipo, Types } from "../utils/Tipo";
import { Excepcion } from "../Excepcion/Excepcion";

export class OperacionAritmetica extends Node {
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
        // -1+4
        if (this.derecho === undefined) {
            const tipoIzq = this.izquierdo.analizar(tabla, arbol);
            if (tipoIzq.constructor.name === 'Excepcion') {
                return tipoIzq;
            }

            if (tipoIzq.toString() == 'numeric') {
                this.tipo = new Tipo(Types.NUMERIC);
                return this.tipo;
            } else {
                const excepcion = new Excepcion('Semantico', `No se puede utilizar el operador ${this.operador} unario con el tipo ${tipoIzq.tipo}`, this.fila, this.columna);
                arbol.errores.push(excepcion);
                return excepcion;
            }
        } else {
            const tipoIzq = this.izquierdo.analizar(tabla, arbol);
            if (tipoIzq instanceof Excepcion) {
                return tipoIzq;
            }
            const tipoDer = this.derecho.analizar(tabla, arbol);
            if (tipoDer instanceof Excepcion) {
                return tipoDer;
            }

            if (this.operador === '+') {
                if (tipoIzq.toString() == 'numeric' && tipoDer.toString() == 'numeric' ||
                    tipoIzq.toString() == 'boolean' && tipoDer.toString() == 'numeric' ||
                    tipoIzq.toString() == 'numeric' && tipoDer.toString() == 'boolean' ||
                    tipoIzq.toString() == 'boolean' && tipoDer.toString() == 'boolean') {
                    this.tipo = new Tipo(Types.NUMERIC);
                    return this.tipo;
                } else if (tipoIzq.toString() == 'numeric' && tipoDer.toString() == 'string' ||
                    tipoIzq.toString() == 'string' && tipoDer.toString() == 'numeric' ||
                    tipoIzq.toString() == 'boolean' && tipoDer.toString() == 'string' ||
                    tipoIzq.toString() == 'string' && tipoDer.toString() == 'boolean') {
                    this.tipo = new Tipo(Types.STRING);
                    return this.tipo;
                } else {
                    const excepcion = new Excepcion('Semantico', `No se puede utilizar el operador ${this.operador} con los tipos ${tipoIzq.toString()} y ${tipoDer.toString()}`, this.fila, this.columna);
                    arbol.errores.push(excepcion);
                    return excepcion;
                }
            } else if (this.operador === '-' || this.operador === '*' || this.operador === '/') {
                if (tipoIzq.toString() == 'numeric' && tipoDer.toString() == 'numeric' ||
                    tipoIzq.toString() == 'boolean' && tipoDer.toString() == 'numeric' ||
                    tipoIzq.toString() == 'numeric' && tipoDer.toString() == 'boolean' ||
                    tipoIzq.toString() == 'boolean' && tipoDer.toString() == 'boolean') {
                    this.tipo = new Tipo(Types.NUMERIC);
                    return this.tipo;
                } else {
                    const excepcion = new Excepcion('Semantico', `No se puede utilizar el operador ${this.operador} con los tipos ${tipoIzq.toString()} y ${tipoDer.toString()}`, this.fila, this.columna);
                    arbol.errores.push(excepcion);
                    return excepcion;
                }
            }
        }
    }

    getC3D(tabla: Tabla, arbol: Arbol): String {
        let c3d = '';
        if (this.derecho === undefined) {
            c3d += this.izquierdo.getC3D(tabla, arbol);
            const temporalIzq = tabla.getTemporalActual();
            const temporal = tabla.getTemporal();

            c3d += `${temporal} = -1 * ${temporalIzq}\n`;
            tabla.QuitarTemporal(temporalIzq);
            tabla.AgregarTemporal(temporal);
            return c3d;
        } else {
            // 4 * 5
            c3d += this.izquierdo.getC3D(tabla, arbol);

            // tx = 4
            const temporalIzq = tabla.getTemporalActual();

            c3d += this.derecho.getC3D(tabla, arbol);

            // ty = 5
            const temporalDer = tabla.getTemporalActual();

            // tz
            const temporal = tabla.getTemporal();
            // tz= tx * ty
            c3d += `${temporal} = ${temporalIzq} ${this.operador} ${temporalDer} \n`;
            tabla.QuitarTemporal(temporalIzq);
            tabla.QuitarTemporal(temporalDer);
            tabla.AgregarTemporal(temporal);
            return c3d;
        }
    }
}