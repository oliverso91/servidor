import { Node } from "../Abstract/Node";
import { Arbol } from "../TablaSimbolos/Arbol";
import { Tabla } from "../TablaSimbolos/Tabla";
import { Excepcion } from "../Excepcion/Excepcion";

export class Llamada extends Node {
    identificador: String;
    lista_expresiones: Array<Node>;
    nombre_funcion: String;
    constructor(identificador: String, lista_expresiones: Array<Node>, fila: number, columna: number) {
        super(null, fila, columna);
        this.identificador = identificador;
        this.lista_expresiones = lista_expresiones;
        this.nombre_funcion = '';
    }

    analizar(tabla: Tabla, arbol: Arbol) : any{
        this.nombre_funcion = this.identificador + '_';
        this.lista_expresiones.map(m => {
            const type = m.analizar(tabla, arbol);
            this.nombre_funcion += type.toString() + '_';
        });
        this.nombre_funcion = this.nombre_funcion.slice(0, this.nombre_funcion.length - 1);

        const existeFuncion = tabla.getFuncion(this.nombre_funcion);
        if (existeFuncion == null) {
            const excepcion = new Excepcion('Semantico', `No existe la funcion ${this.nombre_funcion}`, this.fila, this.columna);
            arbol.errores.push(excepcion);
            return excepcion;
        }
        this.tipo = existeFuncion.tipo;
        return this.tipo;
    }

    getC3D(tabla: Tabla, arbol: Arbol) : String{
        let codigo = '';

        // Calculando parametros
        const listParam: Array<String> = [];
        this.lista_expresiones.map((m, n) => {
            codigo += `// Calculo parametro ${n} func:${this.nombre_funcion}\n`
            codigo += m.getC3D(tabla, arbol);
            codigo += `// Fin calculo parametro ${n} func:${this.nombre_funcion}\n`
            listParam.push(tabla.getTemporalActual());
            tabla.AgregarTemporal(tabla.getTemporalActual());
        });

        codigo += `P = P + ${tabla.sizeActual[tabla.sizeActual.length - 1]}\n`;

        let temp = tabla.getTemporal();
        // GUARDANDO TEMPORALES
        codigo += `// GUARDANDO TEMP\n`
        tabla.tempStorage.map((m, n) => {
            codigo += `${temp} = P + ${n}\n`;
            codigo += `stack[${temp}] = ${m}\n`;
        });
        codigo += `// FIN GUARDANDO TEMP\n`

        codigo += `P = P + ${tabla.tempStorage.length}\n`;

        // PASANDO PARAMETROS
        listParam.map((m, n) => {
            codigo += `${temp} = P + ${n+1}\n`;
            codigo += `stack[${temp}] = ${m}\n`;
        });

        codigo += `call ${this.nombre_funcion}\n`;
        let temp2 = tabla.getTemporal();
        codigo += `${temp2} = stack[P]\n`; // obteniendo valor retornado

        codigo += `P = P - ${tabla.tempStorage.length}\n`;

        // RECUPERANDO TEMPORALES
        codigo += `// recuperando TEMP\n`
        tabla.tempStorage.map((m, n) => {
            codigo += `${temp} = P + ${n}\n`
            codigo += `${m} = stack[${temp}]\n`;
        });
        codigo += `// fin recuperando TEMP\n`
        codigo += `P = P - ${tabla.sizeActual[tabla.sizeActual.length - 1]}\n`;

        return codigo;
    }
}