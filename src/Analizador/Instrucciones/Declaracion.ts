import { Node } from "../Abstract/Node";
import { Tipo } from "../utils/Tipo";
import { Tabla } from "../TablaSimbolos/Tabla";
import { Arbol } from "../TablaSimbolos/Arbol";
import { Simbolo } from "../TablaSimbolos/Simbolo";
import { Excepcion } from "../Excepcion/Excepcion";

export class Declaracion extends Node {
    identificador: String;
    valor: Node;
    posicion: number;

    /**
     * @class Inserta una nueva variable en la tabla de simbolos
     * @param tipo Tipo de la variable
     * @param identificador nombre de la variable
     * @param valor valor de la variable
     * @param fila Linea de la sentencia
     * @param columna Columna de la sentencia
     */
    constructor(tipo: Tipo, identificador: String, valor: Node, fila: number, columna: number) {
        super(tipo, fila, columna);
        this.identificador = identificador;
        this.valor = valor;
        this.posicion = 0;
    }

    analizar(tabla: Tabla, arbol: Arbol) : any{
        // Buscar si la variable ya existe
        const exists = tabla.getVariable(this.identificador);
        if (exists !== null) {
            const excepcion = new Excepcion('Semantico', `La variable ${this.identificador} ya existe.`, this.fila, this.columna);
            arbol.errores.push(excepcion);
            return excepcion;
        }

        // Obtener el tipo de la variable
        if (this.valor != null) {
            const tipo = this.valor.analizar(tabla, arbol);

            // Verificar si el analisis del valor nos devuelve una excepcion
            if (tipo.constructor.name === 'Excepcion') {
                return tipo;
            }

            // Validar que el tipo del valor y el tipo de variable sean los mismos
            if (tipo.toString() !== this.tipo.toString()) {
                const excepcion = new Excepcion('Semantico', `El tipo de la variable no coincide con el tipo del valor ${this.tipo.toString()} = ${tipo.toString()}.`, this.fila, this.columna);
                arbol.errores.push(excepcion);
                return excepcion;
            }
        }

        // Si pasa por todas las validaciones, entonces se puede agregar a la ts
        tabla.setVariable(new Simbolo(this.tipo, this.identificador, this.posicion));
    }

    getC3D(tabla: Tabla, arbol: Arbol) : String {
        // Si llego a este punto de ejecutar, yo estoy seguro que la variable existe
        let codigo = '';
        let variable = tabla.getVariable(this.identificador);
        if (this.valor != null) {
            let valor3D = this.valor.getC3D(tabla, arbol);

            // Concatenamos el codigo generado del valor
            codigo += valor3D;

            // Almacenamos la variable en la posicion que reservamos, con el valor recien obtenido
            if (!tabla.ambito) {
                codigo += `heap[${variable.posicion}] = ${tabla.getTemporalActual()}\n`;
            } else {
                let temp = tabla.getTemporalActual();
                let temp2 = tabla.getTemporal();
                ///codigo += `${temp} = ${tabla.getTemporalActual()}\n`;
                codigo += `${temp2} = P\n`;
                codigo += `${temp2} = ${temp2} + ${variable.posicion}\n`;
                codigo += `stack[${temp2}] = ${temp}\n`;
            }
            tabla.QuitarTemporal(tabla.getTemporalActual());
        } else {
            let temp = tabla.getTemporal();
            if (['numeric', 'boolean'].includes(this.tipo.toString())) {
                codigo += `${temp} = 0\n`;
            } else {
                codigo += `${temp} = -1\n`;
            }
        }
        return codigo;
    }
}
