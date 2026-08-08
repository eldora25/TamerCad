import { BRepParameter } from "./BRepParameter";

export interface ExpressionContext{

    parameters:Map<string,BRepParameter>;

}

export interface SerializedExpression{

    expression:string;

}

export class BRepParameterExpression{

    readonly expression:string;

    private dependencies:Set<string>;

    constructor(expression:string){

        this.expression=expression;

        this.dependencies=new Set();

        this.extractDependencies();

    }

    private extractDependencies(){

        const regex=/[A-Za-z_][A-Za-z0-9_]*/g;

        const reserved=new Set([
            "PI",
            "E",
            "sin",
            "cos",
            "tan",
            "asin",
            "acos",
            "atan",
            "sqrt",
            "pow",
            "abs",
            "min",
            "max",
            "floor",
            "ceil",
            "round",
            "log",
            "exp"
        ]);

        const tokens=this.expression.match(regex);

        if(!tokens){

            return;

        }

        for(const token of tokens){

            if(!reserved.has(token)){

                this.dependencies.add(token);

            }

        }

    }

    getDependencies():string[]{

        return Array.from(this.dependencies);

    }

    evaluate(context:ExpressionContext):number{

        let expr=this.expression;

        for(const id of this.dependencies){

            const parameter=context.parameters.get(id);

            if(!parameter){

                throw new Error(`Unknown parameter ${id}`);
            }

            expr=expr.replaceAll(
                id,
                String(parameter.value)
            );

        }

        expr=expr.replaceAll("PI",String(Math.PI));
        expr=expr.replaceAll("E",String(Math.E));

        const fn=new Function(
            "sin",
            "cos",
            "tan",
            "asin",
            "acos",
            "atan",
            "sqrt",
            "pow",
            "abs",
            "min",
            "max",
            "floor",
            "ceil",
            "round",
            "log",
            "exp",
            `return (${expr});`
        );

        return fn(
            Math.sin,
            Math.cos,
            Math.tan,
            Math.asin,
            Math.acos,
            Math.atan,
            Math.sqrt,
            Math.pow,
            Math.abs,
            Math.min,
            Math.max,
            Math.floor,
            Math.ceil,
            Math.round,
            Math.log,
            Math.exp
        );

    }

    validate(context:ExpressionContext):boolean{

        try{

            this.evaluate(context);

            return true;

        }

        catch{

            return false;

        }

    }

    serialize():SerializedExpression{

        return{

            expression:this.expression

        };

    }

    static deserialize(

        data:SerializedExpression

    ){

        return new BRepParameterExpression(

            data.expression

        );

    }

    info(){

        return{

            expression:this.expression,

            dependencies:this.getDependencies()

        };

    }

}