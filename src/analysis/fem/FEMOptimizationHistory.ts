export interface FEMOptimizationIteration {


    iteration:number;


    objective:number;


    constraints:number[];


    parameters:number[];


    converged:boolean;


}



export class FEMOptimizationHistory {



    private iterations:

    FEMOptimizationIteration[]=[];



    add(

        record:FEMOptimizationIteration

    ):void {


        this.iterations.push(

            {

                ...record,


                constraints:
                [
                    ...record.constraints
                ],


                parameters:
                [
                    ...record.parameters
                ]

            }

        );

    }




    latest():

    FEMOptimizationIteration | undefined {


        return (

            this.iterations[

                this.iterations.length-1

            ]

        );

    }




    best():

    FEMOptimizationIteration | undefined {


        if(
            this.iterations.length===0
        ){

            return undefined;

        }



        return this.iterations.reduce(

            (best,current)=>{


                return current.objective

                <

                best.objective

                ?

                current

                :

                best;


            }

        );

    }




    hasConverged():

    boolean {


        const last=

        this.latest();



        return last?

        last.converged

        :

        false;


    }




    objectiveHistory():

    number[]{


        return this.iterations.map(

            x=>x.objective

        );

    }




    rollback(

        index:number

    ):

    FEMOptimizationIteration | undefined {


        return this.iterations[index];

    }




    size():

    number {


        return this.iterations.length;

    }




    clear():void {


        this.iterations=[];

    }




    export(){


        return [

            ...this.iterations

        ];

    }




    info(){

        return {

            engine:

            "FEMOptimizationHistory",


            iterations:

            this.iterations.length

        };

    }


}