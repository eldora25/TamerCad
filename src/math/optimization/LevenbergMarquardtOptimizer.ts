import { Optimizer } from "./Optimizer";

export abstract class LevenbergMarquardtOptimizer
extends Optimizer {


    protected parameters:number[]=[];


    protected damping=1e-3;


    protected initialize():void{

        this.parameters=

        this.initialParameters();

    }


    protected iterate():void{


        const delta=

        this.computeLMUpdate();


        for(

            let i=0;

            i<this.parameters.length;

            i++

        ){

            this.parameters[i]+=

            delta[i];

        }


        this.updateDamping();

    }



    protected stopCriterion():boolean{


        return (

            this.residualNorm()

            <

            this.tolerance

        );


    }



    protected objective():number{


        const norm=

        this.residualNorm();


        return norm*norm;


    }



    protected abstract

    initialParameters():number[];



    protected abstract

    computeLMUpdate():number[];



    protected abstract

    updateDamping():void;



    protected abstract

    residualNorm():number;



    getParameters(){

        return [

            ...this.parameters

        ];

    }



    info(){

        return{

            engine:

            "LevenbergMarquardtOptimizer",

            damping:

            this.damping

        };

    }

}