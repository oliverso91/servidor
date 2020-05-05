import { Node } from "../Abstract/Node";
import { Tipo } from "../utils/Tipo";
import { Tabla } from "../TablaSimbolos/Tabla";
import { Arbol } from "../TablaSimbolos/Arbol";
import { Excepcion } from "../Excepcion/Excepcion";

export class Imprimir extends Node{
    expresion: Node;
    constructor(expresion: Node, fila: number, columna: number) {
        super(null, fila, columna);
        this.expresion = expresion;
    }

    analizar(tabla: Tabla, arbol: Arbol) : any{
        const result = this.expresion.analizar(tabla, arbol);
        this.tipo = result;
        console.log(this.tipo)
        if (this.tipo instanceof Excepcion) {
            return result;
        }
    }

    getC3D(tabla: Tabla, arbol: Arbol) : String{
        let estructura = 'heap';

        let codigo = '';
        let condicion = this.expresion.getC3D(tabla, arbol);
        codigo += condicion;

        let temp = tabla.getTemporalActual();

        if (this.tipo.toString() === 'numeric' || this.tipo.toString() == 'boolean') {
            codigo += `print(%e, ${temp})\n`;
            tabla.QuitarTemporal(temp);
        } else {
            let temp1 = tabla.getTemporal();
            let temp2 = tabla.getTemporal();
            let temp3 = tabla.getTemporal();
            let label = tabla.getEtiqueta();
            let label2 = tabla.getEtiqueta();
            codigo += `${temp1} = ${estructura}[${temp}]\n`
            tabla.AgregarTemporal(temp1);
            tabla.QuitarTemporal(temp);

            codigo += `${temp2} = ${temp} + 1\n`
            tabla.AgregarTemporal(temp2);
            tabla.QuitarTemporal(temp1);

            codigo += `${temp3} = 0\n`
            tabla.AgregarTemporal(temp3);

            codigo += `${label2}:\n`
            codigo += `if(${temp3} >= ${temp1}) goto ${label}\n`
            tabla.QuitarTemporal(temp3);
            tabla.QuitarTemporal(temp1);


            let temp4 = tabla.getTemporal();
            codigo += `${temp4} = ${estructura}[${temp2}]\n`
            tabla.AgregarTemporal(temp4);
            tabla.QuitarTemporal(temp3);


            codigo += `print(%c, ${temp4})\n`
            tabla.QuitarTemporal(temp4);

            codigo += `${temp2} = ${temp2} + 1\n`
            tabla.AgregarTemporal(temp2);

            codigo += `${temp3} = ${temp3} + 1\n`
            tabla.AgregarTemporal(temp3);

            codigo += `${temp4} = ${temp4} + 1\n`
            tabla.AgregarTemporal(temp4);

            codigo += `goto ${label2}\n`
            codigo += `${label}:\n`
        }
        return codigo;
    }

}