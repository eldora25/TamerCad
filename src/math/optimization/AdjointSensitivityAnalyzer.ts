import { SensitivityAnalyzer }
from "./SensitivityAnalyzer";


export interface AdjointResult {

    gradient:number[];

    adjoint:number[];

}



export abstract class AdjointSensitivityAnalyzer
extends SensitivityAnalyzer {



    protected adjointVariables:number[]=[];



    analyzeAdjoint():

    AdjointResult {


        this.solveAdjoint();



        return {

            adjoint:

            [
                ...this.adjointVariables
            ],


            gradient:

            this.computeAdjointGradient()

        };

    }



    protected abstract

    solveAdjoint():

    void;



    protected abstract

    computeAdjointGradient():

    number[];



    protected abstract

    assembleAdjointSystem():

    unknown;



    getAdjointVariables():

    number[]{


        return [

            ...this.adjointVariables

        ];

    }



    info(){

        return {

            engine:

            "AdjointSensitivityAnalyzer"

        };

    }

}