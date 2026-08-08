import { BRepParameter } from "./BRepParameter";
import { BRepParameterExpression } from "./BRepParameterExpression";

export class BRepParameterTable {

    private parameters = new Map<string, BRepParameter>();

    private expressions = new Map<string, BRepParameterExpression>();

    add(parameter:BRepParameter):void{

        this.parameters.set(

            parameter.id,

            parameter

        );

    }

    remove(id:string):boolean{

        this.expressions.delete(id);

        return this.parameters.delete(id);

    }

    get(id:string):BRepParameter|undefined{

        return this.parameters.get(id);

    }

    has(id:string):boolean{

        return this.parameters.has(id);

    }

    update(id:string,value:any):void{

        const p=this.parameters.get(id);

        if(!p){

            throw new Error(`Unknown parameter: ${id}`);
        }

        p.value=value;
    }

    setExpression(

        parameterId:string,

        expression:BRepParameterExpression

    ):void{

        if(!this.parameters.has(parameterId)){

            throw new Error(`Unknown parameter: ${parameterId}`);
        }

        this.expressions.set(

            parameterId,

            expression

        );
    }

    evaluateExpressions():void{

        const context={

            parameters:this.parameters

        };

        for(const [parameterId,expr] of this.expressions){

            const parameter=this.parameters.get(parameterId);

            if(!parameter){

                continue;
            }

            const value=expr.evaluate(context);

            parameter.setValue(value);

            parameter.clearDirty();
        }
    }

    parametersArray():BRepParameter[]{

        return Array.from(

            this.parameters.values()

        );
    }

    serialize(){

        return{

            parameters:

                this.parametersArray()

                    .map(

                        p=>p.serialize()

                    ),

            expressions:

                Array.from(

                    this.expressions.entries()

                ).map(

                    ([id,e])=>({

                        parameter:id,

                        expression:e.serialize()

                    })

                )

        };
    }

    clear():void{

        this.parameters.clear();

        this.expressions.clear();
    }

    info(){

        return{

            engine:"BRepParameterTable",

            parameterCount:this.parameters.size,

            expressionCount:this.expressions.size

        };
    }

}