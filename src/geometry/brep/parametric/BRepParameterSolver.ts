import { BRepParameterTable } from "./BRepParameterTable";
import { BRepParameterExpression } from "./BRepParameterExpression";

export interface SolverResult {

    success:boolean;

    evaluated:string[];

    cycles:string[][];

    errors:string[];

}

export class BRepParameterSolver {

    readonly table:BRepParameterTable;

    constructor(table:BRepParameterTable){

        this.table=table;

    }

    solve():SolverResult{

        const expressions:any[] =

            (this.table.serialize().expressions ?? []);

        const graph=new Map<string,string[]>();

        for(const item of expressions){

            const expr=BRepParameterExpression.deserialize(item.expression);
            graph.set(item.parameter,expr.getDependencies());
        }

        const order=this.topologicalSort(graph);

        const errors:string[]=[];

        const evaluated:string[]=[];

        if(order.cycles.length===0){

            this.table.evaluateExpressions();

            evaluated.push(...order.order);
        }else{

            errors.push("Circular parameter dependency detected");
        }

        return{

            success:order.cycles.length===0,

            evaluated,

            cycles:order.cycles,

            errors

        };

    }

    private topologicalSort(

        graph:Map<string,string[]>

    ){

        const visited=new Set<string>();
        const visiting=new Set<string>();
        const order:string[]=[];
        const cycles:string[][]=[];

        const dfs=(node:string,path:string[])=>{

            if(visiting.has(node)){
                cycles.push([...path,node]);
                return;
            }

            if(visited.has(node)){
                return;
            }

            visiting.add(node);

            const deps=graph.get(node) ?? [];

            for(const dep of deps){
                if(graph.has(dep)){
                    dfs(dep,[...path,node]);
                }
            }

            visiting.delete(node);
            visited.add(node);
            order.push(node);
        };

        for(const node of graph.keys()){
            dfs(node,[]);
        }

        return{
            order,
            cycles
        };
    }

    validate():boolean{

        return this.solve().success;

    }

    info(){

        return{

            engine:"BRepParameterSolver",

            parameterCount:
                this.table.serialize().parameters.length,

            expressionCount:
                this.table.serialize().expressions.length

        };

    }

}