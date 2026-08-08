import { Optimizer } from "./Optimizer";

export abstract class LBFGSOptimizer
extends Optimizer {

    protected parameters:number[]=[];

    protected historySize=10;

    protected initialize():void{

        this.parameters=

        this.initialParameters();

        this.clearHistory();

    }

    protected iterate():void{

        const direction=

        this.computeDirection();

        for(

            let i=0;

            i<this.parameters.length;

            i++

        ){

            this.parameters[i]-=

            direction[i];

        }

        this.updateHistory();

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

    clearHistory():void;

    protected abstract

    updateHistory():void;

    protected abstract

    computeDirection():number[];

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

            "LBFGSOptimizer",

            historySize:

            this.historySize

        };

    }

}