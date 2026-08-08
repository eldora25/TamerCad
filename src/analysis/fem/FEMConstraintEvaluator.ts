export interface FEMConstraint {

    name:string;

    limit:number;

    evaluate(
        response:any
    ):number;

}



export interface ConstraintEvaluation {

    values:number[];

    satisfied:boolean;

    violations:number[];

}



export abstract class FEMConstraintEvaluator {


    protected constraints:
    FEMConstraint[]=[];



    addConstraint(

        constraint:FEMConstraint

    ):void {


        this.constraints.push(
            constraint
        );

    }



    evaluate(

        response:any

    ):ConstraintEvaluation {


        const values:number[]=[];


        const violations:number[]=[];



        for(

            const constraint of
            this.constraints

        ){


            const value=

            constraint.evaluate(
                response
            );


            values.push(value);



            if(value>0){

                violations.push(value);

            }

        }



        return {

            values,

            satisfied:

            violations.length===0,


            violations

        };

    }



    getConstraints(){

        return [

            ...this.constraints

        ];

    }



    protected abstract

    normalize(

        value:number

    ):number;



    info(){

        return {

            engine:

            "FEMConstraintEvaluator",

            constraints:

            this.constraints.length

        };

    }

}