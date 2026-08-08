import { Optimizer } from "./Optimizer";

export abstract class NewtonOptimizer
extends Optimizer {

    protected parameters:number[]=[];

    protected initialize():void{

        this.parameters=
        this.initialParameters();

    }

    protected iterate():void{

        const step=
        this.computeNewtonStep();

        for(

            let i=0;

            i<this.parameters.length;

            i++

        ){

            this.parameters[i]-=

            step[i];

        }

    }

    protected stopCriterion():boolean{

        return

        this.stepNorm()<

        this.tolerance;

    }

    protected objective():number{

        return

        this.evaluateObjective();

    }

    protected abstract

    initialParameters():number[];

    protected abstract

    computeNewtonStep():number[];

    protected abstract

    evaluateObjective():number;

    protected abstract

    stepNorm():number;

    getParameters(){

        return

        [...this.parameters];

    }

    info(){

        return{

            engine:

            "NewtonOptimizer"

        };

    }

}