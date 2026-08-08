export interface OptimizationVariable {

    name:string;

    value:number;

    min?:number;

    max?:number;

}



export interface OptimizationConstraint {

    name:string;

    evaluate(
        variables:number[]
    ):number;

}



export class OptimizationProblem {


    private variables:
    OptimizationVariable[]=[];


    private constraints:
    OptimizationConstraint[]=[];



    private objectiveFunction?:

    (
        variables:number[]
    )=>number;



    addVariable(

        variable:
        OptimizationVariable

    ):void {


        this.variables.push(variable);

    }



    setObjective(

        objective:

        (
            variables:number[]
        )=>number

    ):void {


        this.objectiveFunction =
        objective;

    }



    addConstraint(

        constraint:
        OptimizationConstraint

    ):void {


        this.constraints.push(
            constraint
        );

    }



    evaluate(

        values:number[]

    ):number {


        if(!this.objectiveFunction){

            throw new Error(
                "Objective not defined"
            );

        }


        return this.objectiveFunction(
            values
        );

    }



    validate(

        values:number[]

    ):boolean {


        for(

            let i=0;

            i<this.variables.length;

            i++

        ){

            const variable =
            this.variables[i];


            if(
                variable.min !== undefined &&
                values[i] < variable.min
            ){

                return false;

            }


            if(
                variable.max !== undefined &&
                values[i] > variable.max
            ){

                return false;

            }

        }


        return true;

    }



    getVariables(){

        return [
            ...this.variables
        ];

    }



    getConstraints(){

        return [
            ...this.constraints
        ];

    }



    info(){

        return {

            engine:
            "OptimizationProblem",

            variables:
            this.variables.length,

            constraints:
            this.constraints.length

        };

    }

}