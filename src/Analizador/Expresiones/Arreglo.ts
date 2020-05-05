import { Node } from "../Abstract/Node";
import { Tipo } from "../utils/Tipo";
import { Tabla } from "../TablaSimbolos/Tabla";
import { Arbol } from "../TablaSimbolos/Arbol";
import { Excepcion } from "../Excepcion/Excepcion";

export class Arreglo extends Node {
    tipo: Tipo;
    dimensiones: Array<Node>;
    constructor(tipo: Tipo, dimensiones: Array<Node>, fila: number, columna: number) {
        super(tipo, fila, columna);
        this.dimensiones = dimensiones;
    }

    // integer[] a = new integer[5*4+7]
    analizar(tabla: Tabla, arbol: Arbol): any {
        const result = this.dimensiones[0].analizar(tabla, arbol);

        if (result instanceof Excepcion) {
            return result;
        }

        // Validar que el tipo sea numerico
        if (result.toString() !== 'numeric') {
            const excepcion = new Excepcion('Semantico', `El tipo de la dimension debe ser numerico.`, this.fila, this.columna);
            arbol.errores.push(excepcion);
            return excepcion;
        }

        return new Tipo(this.tipo.tipo, this.dimensiones.length);
    }

    getC3D(tabla: Tabla, arbol: Arbol): String {
        let codigo = '';
        let defaultValue = '';
        if (this.tipo.toString() === 'string') {
            defaultValue = '-1';
        } else {
            defaultValue = '0';
        }

        // Posicion inicial del arreglo
        let temp1 = tabla.getTemporal();
        codigo += `${temp1} = h\n`
        tabla.AgregarTemporal(temp1);

        // Tamaño del arreglo
        const size = this.dimensiones[0];
        codigo += size.getC3D(tabla, arbol);
        const temp2 = tabla.getTemporalActual();
        codigo += `heap[${temp1}] = ${temp2}\n`
        codigo += `h = h + 1\n` // aumentamos el puntero h

        // creamos cada posicion y adicionalmente guardamos su valor por defecto
        const temp3 = tabla.getTemporal(); // Temporal contador auxiliar
        const label = tabla.getEtiqueta();
        const label2 = tabla.getEtiqueta();

        codigo += `${temp3} = 0\n`
        tabla.AgregarTemporal(temp3);

        codigo += `${label2}:\n`
        codigo += `if(${temp3} >= ${temp2}) goto ${label}\n`
        tabla.QuitarTemporal(temp3);
        tabla.QuitarTemporal(temp2);
        codigo += `heap[h] = ${defaultValue}\n` // Asignamos valor por defecto
        codigo += `h = h + 1\n` // aumentamos el puntero h
        codigo += `${temp3} = ${temp3} + 1\n`
        codigo += `goto ${label2}\n`
        codigo += `${label}:\n`

        codigo += `${tabla.getTemporal()} = ${temp1}\n`;
        tabla.QuitarTemporal(temp1);
        return codigo;
    }
}