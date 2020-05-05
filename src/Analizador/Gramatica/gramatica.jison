
%{
    const {Primitivo} = require('../Expresiones/Primitivo');
    const {OperacionAritmetica} = require('../Expresiones/OperacionAritmetica');
    const {OperacionRelacional} = require('../Expresiones/OperacionRelacional');
    const {Identificador} = require('../Expresiones/Identificador');
    const {Cadena} = require('../Expresiones/Cadena');
    const {Arreglo} = require('../Expresiones/Arreglo');
    const {Llamada} = require('../Expresiones/Llamada');
    const {Return} = require('../Expresiones/Return');
    const {Imprimir} = require('../Instrucciones/Imprimir');
    const {Si} = require('../Instrucciones/Si');
    const {Funcion} = require('../Instrucciones/Funcion');
    const {Mientras} = require('../Instrucciones/Mientras');
    const {HacerMientras} = require('../Instrucciones/HacerMientras');
    const {Declaracion} = require('../Instrucciones/Declaracion');
    const {Asignacion} = require('../Instrucciones/Asignacion');
    const {Excepcion} = require('../Excepcion/Excepcion');
    const {Tipo, Types} = require('../utils/Tipo');
    const {Arbol} = require('../TablaSimbolos/Arbol');
%}

%lex
%options case-insensitive
entero [0-9]+
decimal {entero}"."{entero}
identificador ([a-zA-Z])[a-zA-Z0-9_]*
escapechar [\'\"\\bfnrtv]
escape \\{escapechar}
acceptedquote [^\"\\]+
stringliteral (\"({escape}|{acceptedquote})*\")
caracterliteral (\'([a-zA-Z0-9])\')
%%

\s+                   /* skip whitespace */
"//".*										// comentario simple línea
[/][*][^*]*[*]+([^/*][^*]*[*]+)*[/]			// comentario multiple líneas

{decimal}             return 'DECIMAL'
{entero}              return 'ENTERO'
{stringliteral}       return 'STRING_LITERAL'
{caracterliteral}       return 'CHAR_LITERAL'
"*"                   return '*'
"/"                   return '/'
";"                   return 'pcoma'
"-"                   return '-'
"+"                   return '+'
"||"                  return '||'
"&&"                  return '&&'
"<"                   return '<'
">"                   return '>'
"<="                  return '<='
">="                  return '>='
"=="                  return '=='
"!="                  return '!='
"="                   return '='
"("                   return '('
")"                   return ')'
"["                   return '['
"]"                   return ']'
"}"                   return 'llaveD'
"{"                   return 'llaveI'
","                   return ','
"numeric"             return 'numeric'
"integer"             return 'integer'
"double"             return 'double'
"string"              return 'string'
"char"              return 'char'
"boolean"             return 'boolean'
"true"                return 'verdadero'
"false"               return 'falso'
"new"                 return 'nuevo'
"if"                  return 'si'
"else"                return 'sino'
"void"                return 'vacio'
"while"               return 'mientras'
"do"                  return 'hacer'
"print"               return 'print'
"return"              return 'return'
"import"              return 'import'


{identificador}       return 'identificador'
<<EOF>>				  return 'EOF'

/lex

%left 'else'
%left '||'
%left '&&'
%left '==' '!='
%left '<' '>' '<=' '>='
%left '+' '-'
%left '*' '/'
%left UMENOS
%left '(' ')'

%start INICIO

%%

INICIO : INSTRUCCIONES EOF {return new Arbol($$);}
;


INSTRUCCIONES : INSTRUCCIONES INSTRUCCION {$$ = $1; $$.push($2);}
              | INSTRUCCION               { $$ = [$1]; }
              ;

INSTRUCCION : DECLARACION {$$ = $1;}
            | ASIGNACION {$$ = $1;}
            | IF {$$ = $1;}
            | PRINT pcoma{$$ = $1;}
            | DOWHILE pcoma{$$ = $1;}
            | WHILE {$$ = $1;}
            | FUNCION {$$ = $1;}
            | LLAMADA pcoma {$$ = $1;}
            | 'return' EXPRESION pcoma {$$ = new Return($2);}
            ;

TIPO : TIPO_PRIMITIVO DIM  {$$ = new Tipo($1.tipo, $2);}
     | TIPO_PRIMITIVO {$$ = $1;}
     ;

TIPO_PRIMITIVO : 'integer' {$$ = new Tipo(Types.NUMERIC);}
               | 'double' {$$ = new Tipo(Types.NUMERIC);}
               | 'string' {$$ = new Tipo(Types.STRING);}
               | 'char' {$$ = new Tipo(Types.STRING);}
               | 'boolean' {$$ = new Tipo(Types.BOOLEAN);}
               ;

DECLARACION : TIPO identificador '=' EXPRESION pcoma { $$ = new Declaracion($1, $2, $4, this._$.first_line, this._$.first_column);}
            | TIPO identificador pcoma { $$ = new Declaracion($1, $2, null, this._$.first_line, this._$.first_column);}
            ;

ASIGNACION : identificador '=' EXPRESION pcoma {$$ = new Asignacion($1, $3, this._$.first_line, this._$.first_column);}
           ;

DIM : DIM '[' ']' {$$ = $1 + 1;}
    | '[' ']' {$$ = 1;}
    ;

ARREGLO : nuevo TIPO_PRIMITIVO DIMENSIONES {$$ = new Arreglo($2, $3, this._$.first_line, this._$.first_column);}
        ;

DIMENSIONES : DIMENSIONES '[' EXPRESION ']' {$$ = $1; $$.push($3);}
            | '[' EXPRESION ']' {$$ = [$2];}
            ;

IF : si '(' EXPRESION ')' BLOQUE_INSTRUCCIONES {$$ = new Si($3, $5, []); }
   | si '(' EXPRESION ')' BLOQUE_INSTRUCCIONES sino IF {$$ = new Si($3, $5, [$7]);}
   | si '(' EXPRESION ')' BLOQUE_INSTRUCCIONES sino BLOQUE_INSTRUCCIONES {$$ = new Si($3, $5, $7, this._$.first_line, this._$.first_column);}
   ;

WHILE : mientras '(' EXPRESION ')' BLOQUE_INSTRUCCIONES {$$ = new Mientras($3, $5, this._$.first_line, this._$.first_column);}
      ;

DOWHILE : hacer BLOQUE_INSTRUCCIONES mientras '(' EXPRESION ')'  { $$ = new HacerMientras($5, $2, this._$.first_line, this._$.first_column); }
      ;

PRINT : 'print' '(' EXPRESION ')' {$$ = new Imprimir($3);}
      ;

LLAMADA : identificador '(' LISTA_EXPRESION ')' {$$ = new Llamada($1, $3, this._$.first_line, this._$.first_column);}
        | identificador '(' ')' {$$ = new Llamada($1, [], this._$.first_line, this._$.first_column);}

        ;

FUNCION : TIPO identificador '(' LISTA_PARAMETROS ')' BLOQUE_INSTRUCCIONES  {$$ = new Funcion($1, $2, $4, $6, this._$.first_line, this._$.first_column);}
        | vacio identificador '(' LISTA_PARAMETROS ')' BLOQUE_INSTRUCCIONES {$$ = new Funcion(new Tipo('void'), $2, $4, $6, this._$.first_line, this._$.first_column);}
        | TIPO identificador '(' ')' BLOQUE_INSTRUCCIONES {$$ = new Funcion($1, $2, [], $5, this._$.first_line, this._$.first_column);}
        | vacio identificador '(' ')' BLOQUE_INSTRUCCIONES {$$ = new Funcion(new Tipo('void'), $2, [], $5, this._$.first_line, this._$.first_column);}
        ;

LISTA_PARAMETROS : LISTA_PARAMETROS ',' PARAMETRO {$$ = $1; $$.push($3);}
                 | PARAMETRO {$$ = [$1];}
                 ;

LISTA_EXPRESION : LISTA_EXPRESION ',' EXPRESION {$$ = $1; $$.push($3);}
                 | EXPRESION {$$ = [$1];}
                 ;

PARAMETRO : TIPO identificador {$$ = new Declaracion($1, $2, null, this._$.first_line, this._$.first_column)}
          ;

BLOQUE_INSTRUCCIONES : llaveI INSTRUCCIONES llaveD {$$ = $2;}
                     | llaveI llaveD {$$ = [];}
                     ;

EXPRESION : '-' EXPRESION %prec UMENOS	    { $$ = new OperacionAritmetica($2, undefined, '-', this._$.first_line, this._$.first_column); }
          | EXPRESION '+' EXPRESION		    { $$ = new OperacionAritmetica($1, $3, '+', this._$.first_line, this._$.first_column); }
          | EXPRESION '-' EXPRESION		    { $$ = new OperacionAritmetica($1, $3, '-', this._$.first_line, this._$.first_column); }
          | EXPRESION '*' EXPRESION		    { $$ = new OperacionAritmetica($1, $3, '*', this._$.first_line, this._$.first_column); }
          | EXPRESION '/' EXPRESION	          { $$ = new OperacionAritmetica($1, $3, '/', this._$.first_line, this._$.first_column); }
          | EXPRESION '<' EXPRESION		    { $$ = new OperacionRelacional($1, $3, '<', this._$.first_line, this._$.first_column); }
          | EXPRESION '>' EXPRESION		    { $$ = new OperacionRelacional($1, $3, '>', this._$.first_line, this._$.first_column); }
          | EXPRESION '<=' EXPRESION	    { $$ = new OperacionRelacional($1, $3, '<=', this._$.first_line, this._$.first_column); }
          | EXPRESION '>=' EXPRESION	    { $$ = new OperacionRelacional($1, $3, '>=', this._$.first_line, this._$.first_column); }
          | EXPRESION '==' EXPRESION	    { $$ = new OperacionRelacional($1, $3, '==', this._$.first_line, this._$.first_column); }
          | EXPRESION '!=' EXPRESION	    { $$ = new OperacionRelacional($1, $3, '!=', this._$.first_line, this._$.first_column); }
          | identificador                     { $$ = new Identificador($1, this._$.first_line, this._$.first_column); }
          | ARREGLO				    { $$ = $1; }
          | LLAMADA				    { $$ = $1; }
          | ENTERO				    { $$ = new Primitivo(new Tipo(Types.NUMERIC), $1, this._$.first_line, this._$.first_column); }
          | DECIMAL				    { $$ = new Primitivo(new Tipo(Types.NUMERIC), $1, this._$.first_line, this._$.first_column); }
          | verdadero				    { $$ = new Primitivo(new Tipo(Types.BOOLEAN), 1, this._$.first_line, this._$.first_column); }
          | falso	     				    { $$ = new Primitivo(new Tipo(Types.BOOLEAN), 0, this._$.first_line, this._$.first_column); }
          | STRING_LITERAL      { $1 = $1.slice(1, $1.length-1); $$ = new Cadena($1, new Arreglo(new Tipo(Types.STRING), [new Primitivo(new Tipo(Types.NUMERIC), $1.length, this._$.first_line, this._$.first_column)], this._$.first_line, this._$.first_column), this._$.first_line, this._$.first_column); }
          | CHAR_LITERAL        { $1 = $1.slice(1, $1.length-1); $$ = new Cadena($1, new Arreglo(new Tipo(Types.STRING), [new Primitivo(new Tipo(Types.NUMERIC), $1.length, this._$.first_line, this._$.first_column)], this._$.first_line, this._$.first_column), this._$.first_line, this._$.first_column); }
          | '(' EXPRESION ')'		{ $$ = $2; }
          ;
