export interface FEMResult {

    displacement:number[];

    stress:number[];

    strain?:number[];

    forces?:number[];

}



export interface FEMResponse {

    compliance:number;

    maxStress:number;

    maxDisplacement:number;

    strainEnergy:number;

}



export abstract class FEMResponseEvaluator {


    evaluate(

        result:FEMResult

    ):FEMResponse {


        return {

            compliance:

                this.computeCompliance(
                    result
                ),


            maxStress:

                this.computeMaxStress(
                    result
                ),


            maxDisplacement:

                this.computeMaxDisplacement(
                    result
                ),


            strainEnergy:

                this.computeStrainEnergy(
                    result
                )

        };

    }



    objective(

        response:FEMResponse

    ):number {


        return response.compliance;

    }



    constraints(

        response:FEMResponse

    ):number[]{


        return [

            response.maxStress,

            response.maxDisplacement

        ];

    }



    protected abstract

    computeCompliance(

        result:FEMResult

    ):number;



    protected abstract

    computeMaxStress(

        result:FEMResult

    ):number;



    protected abstract

    computeMaxDisplacement(

        result:FEMResult

    ):number;



    protected abstract

    computeStrainEnergy(

        result:FEMResult

    ):number;



    info(){

        return {

            engine:

            "FEMResponseEvaluator"

        };

    }

}