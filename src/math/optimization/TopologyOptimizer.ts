import { Optimizer } from "./Optimizer";


export interface TopologyResult {

    converged:boolean;

    iterations:number;

    volumeFraction:number;

}



export abstract class TopologyOptimizer
extends Optimizer {


    protected densities:number[]=[];


    protected volumeFraction=0.5;


    protected penalty=3.0;



    protected initialize():void {


        this.densities =

        this.initialDensity();


    }



    protected iterate():void {


        const sensitivities =

        this.computeSensitivity();



        this.updateDensity(
            sensitivities
        );


    }



    protected stopCriterion():boolean {


        return

        this.changeNorm()

        <

        this.tolerance;


    }



    protected objective():number {


        return

        this.computeCompliance();


    }



    protected abstract

    initialDensity():

    number[];



    protected abstract

    computeSensitivity():

    number[];



    protected abstract

    updateDensity(

        sensitivity:number[]

    ):void;



    protected abstract

    computeCompliance():

    number;



    protected abstract

    changeNorm():

    number;



    getDensity():

    number[]{


        return [

            ...this.densities

        ];

    }



    info(){

        return {

            engine:

            "TopologyOptimizer",

            penalty:

            this.penalty,

            volumeFraction:

            this.volumeFraction

        };

    }


}