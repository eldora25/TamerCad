import { Optimizer } from "./Optimizer";

export abstract class BFGSOptimizer
extends Optimizer {

    protected parameters:number[]=[];

    protected initialize():void{

        this.parameters=

        this.initialParameters();

        this.initializeApproximation();

    }

    protected iterate():void{

        const step=

        this.computeStep();

        for(

            let i=0;

            i<this.parameters.length;

            i++

        ){

            this.parameters[i]-=

            step[i];

        }

        this.updateApproximation();

    }

    protected stopCriterion():boolean{

        return

        this.gradientNorm()

        <

        this.tolerance;

    }

    protected objective():number{

        return

        this.evaluateObjective();

    }

    protected abstract

    initialParameters():number[];

    protected abstract

    initializeApproximation():void;

    protected abstract

    updateApproximation():void;

    protected abstract

    computeStep():number[];

    protected abstract

    evaluateObjective():number;

    protected abstract

    gradientNorm():number;

    getParameters(){

        return

        [...this.parameters];

    }

    info(){

        return{

            engine:

            "BFGSOptimizer"

        };

    }

}