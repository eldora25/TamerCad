import { BRepParameterManager } from "../brep/parametric/BRepParameterManager";

export interface SketchConstraint {

    id:string;

    type:string;

    enabled:boolean;

    solve():boolean;

}

export interface SketchSolverResult {

    success:boolean;

    iterations:number;

    solved:number;

    failed:number;

    message?:string;

}

export class SketchConstraintSolver {

    private constraints:SketchConstraint[]=[];

    readonly parameterManager:BRepParameterManager;

    maxIterations=50;

    tolerance=1e-6;

    constructor(parameterManager:BRepParameterManager){

        this.parameterManager=parameterManager;

    }

    addConstraint(

        constraint:SketchConstraint

    ):void{

        this.constraints.push(

            constraint

        );

    }

    removeConstraint(id:string):void{

        this.constraints=

            this.constraints.filter(

                c=>c.id!==id

            );

    }

    solve():SketchSolverResult{

        this.parameterManager.evaluate();

        let solved=0;

        let failed=0;

        let iterations=0;

        let changed=true;

        while(

            changed &&

            iterations<this.maxIterations

        ){

            changed=false;

            iterations++;

            for(const constraint of this.constraints){

                if(!constraint.enabled){

                    continue;

                }

                const ok=

                    constraint.solve();

                if(ok){

                    solved++;

                    changed=true;

                }else{

                    failed++;

                }

            }

        }

        return{

            success:

                failed===0,

            iterations,

            solved,

            failed,

            message:

                failed===0

                ?

                "Solved"

                :

                "Constraint conflicts detected"

        };

    }

    validate():boolean{

        return this.solve().success;

    }

    degreesOfFreedom():number{

        let active=0;

        for(const c of this.constraints){

            if(c.enabled){

                active++;

            }

        }

        return Math.max(

            0,

            100-active

        );

    }

    clear():void{

        this.constraints=[];

    }

    info(){

        return{

            engine:"SketchConstraintSolver",

            constraints:

                this.constraints.length,

            dof:

                this.degreesOfFreedom()

        };

    }

}