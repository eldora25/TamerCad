export interface FEMObjectiveContext {

    displacement:number[];

    stress:number[];

    strain?:number[];

    temperature?:number[];

    mass?:number;

}



export abstract class FEMObjectiveFunction {


    protected weight=1.0;



    evaluate(

        context:FEMObjectiveContext

    ):number {


        return (

            this.weight *

            this.compute(context)

        );

    }



    gradient(

        context:FEMObjectiveContext

    ):number[]{


        return this.computeGradient(
            context
        );

    }



    setWeight(

        weight:number

    ):void{


        this.weight = weight;

    }



    getWeight():

    number{


        return this.weight;

    }



    protected abstract

    compute(

        context:FEMObjectiveContext

    ):number;



    protected abstract

    computeGradient(

        context:FEMObjectiveContext

    ):number[];



    info(){

        return {

            engine:

            "FEMObjectiveFunction",

            weight:

            this.weight

        };

    }

}