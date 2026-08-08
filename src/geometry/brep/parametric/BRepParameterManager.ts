import { BRepParameter } from "./BRepParameter";
import { BRepParameterExpression } from "./BRepParameterExpression";
import { BRepParameterTable } from "./BRepParameterTable";
import { BRepParameterDependencyGraph } from "./BRepParameterDependencyGraph";
import { BRepParameterSolver } from "./BRepParameterSolver";
import { BRepParametricModel } from "./BRepParametricModel";

export class BRepParameterManager {

    readonly table:BRepParameterTable;

    readonly graph:BRepParameterDependencyGraph;

    readonly solver:BRepParameterSolver;

    readonly model:BRepParametricModel;

    constructor(model:BRepParametricModel){

        this.model=model;

        this.table=new BRepParameterTable();

        this.graph=new BRepParameterDependencyGraph();

        this.solver=new BRepParameterSolver(this.table);

    }

    addParameter(parameter:BRepParameter):void{

        this.table.add(parameter);

    }

    removeParameter(id:string):boolean{

        return this.table.remove(id);

    }

    updateParameter(id:string,value:any):void{

        this.table.update(id,value);

    }

    getParameter(id:string){

        return this.table.get(id);

    }

    registerExpression(

        parameterId:string,

        expression:BRepParameterExpression

    ):void{

        this.table.setExpression(

            parameterId,

            expression

        );

        for(const dependency of expression.getDependencies()){

            this.graph.addDependency(

                dependency,

                parameterId

            );

        }

    }

    evaluate():boolean{

        const result=this.solver.solve();

        if(result.success){

            this.model.revision++;

        }

        return result.success;

    }

    rebuild(parameterId:string):void{

        this.evaluate();

        const affected=

            this.graph.affectedParameters(parameterId);

        for(const parameter of affected){

            this.model.rebuild(parameter);

        }

    }

    serialize(){

        return{

            parameters:this.table.serialize(),

            graph:this.graph.info()

        };

    }

    reset():void{

        this.table.clear();

        this.graph.clear();

    }

    info(){

        return{

            engine:"BRepParameterManager",

            parameters:

                this.table.info(),

            graph:

                this.graph.info(),

            solver:

                this.solver.info()

        };

    }

}