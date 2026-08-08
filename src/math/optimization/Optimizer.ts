export interface OptimizationResult{

    converged:boolean;

    iterations:number;

    objective:number;

}

export abstract class Optimizer{

    tolerance=1e-8;

    maxIterations=1000;

    protected iteration=0;

    optimize():OptimizationResult{

        this.initialize();

        while(

            this.iteration<

            this.maxIterations &&

            !this.stopCriterion()

        ){

            this.iterate();

            this.iteration++;

        }

        return{

            converged:

                this.stopCriterion(),

            iterations:

                this.iteration,

            objective:

                this.objective()

        };

    }

    protected abstract initialize():void;

    protected abstract iterate():void;

    protected abstract stopCriterion():boolean;

    protected abstract objective():number;

    reset():void{

        this.iteration=0;

    }

    info(){

        return{

            engine:"Optimizer",

            tolerance:

                this.tolerance,

            maxIterations:

                this.maxIterations

        };

    }

}