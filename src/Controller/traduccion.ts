import { Response, Request } from "express";
import { Tabla } from "../Analizador/TablaSimbolos/Tabla";
import { Arbol } from "../Analizador/TablaSimbolos/Arbol";
import { agregarFuncion, getFuncionSize } from "../Analizador/Utils/Common";
import { Declaracion } from "../Analizador/Instrucciones/Declaracion";
import { Funcion } from "../Analizador/Instrucciones/Funcion";
const parser = require('../Analizador/Gramatica/gramatica.js');

export function Traducir(req: Request, res: Response) {
    const { entrada } = req.body;
    if (!entrada || !entrada || /^\s*$/.test(entrada)) {
        res.status(400).json({
            success: false,
            errors: ['No se encontro la entrada en el cuerpo de la petición o posiblemente este vacia.']
        })
    }
    const arbol: Arbol = parser.parse(entrada);
    if (arbol.errores.length === 0) {
        const tabla = new Tabla();
        tabla.sizeActual.push(0);
        // Obteniendo funciones
        arbol.instrucciones.map(m => {
            if (m instanceof Funcion) {
                tabla.setStack(0);
                agregarFuncion(tabla, arbol, m);
            }
        });

        let cantidadGlobales = 0;
        arbol.instrucciones.map(m => {
            if (m instanceof Declaracion) {
                m.posicion = tabla.getHeap();
                cantidadGlobales++;
            }
        });

        arbol.instrucciones.map(m => {
            m.analizar(tabla, arbol);
        });

        let c3d = '';
        if (arbol.errores.length == 0) {
            for (let i = 0; i < cantidadGlobales; i++) {
                c3d += `heap[${i}] = 0\n`;
                c3d += `h = h + 1\n`
            }

            arbol.instrucciones.map(m => {
                c3d += m.getC3D(tabla, arbol);
            });
        }

        res.status(200).json({
            success: arbol.errores.length == 0,
            c3d,
            variables: tabla.variables,
            funciones: tabla.funciones,
            error: arbol.errores
        });
    } else {
        res.status(200).json({
            success: false,
            error: arbol.errores
        });
    }
}