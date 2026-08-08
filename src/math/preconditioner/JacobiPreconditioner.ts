import { SparseVector } from "../sparse/SparseVector";
import { Preconditioner } from "./Preconditioner";

export class JacobiPreconditioner
extends Preconditioner {

    private inverseDiagonal:number[]=[];

    protected onBuild():void{

        if(!this.matrix){

            return;

        }

        this.inverseDiagonal=[];

        for(

            let i=0;

            i<this.matrix.rows;

            i++

        ){

            const value=

                this.matrix.get(i,i);

            if(

                Math.abs(value)<1e-12

            ){

                this.inverseDiagonal.push(0);

            }else{

                this.inverseDiagonal.push(

                    1/value

                );

            }

        }

    }

    apply(

        vector:SparseVector

    ):SparseVector{

        const result=

            new SparseVector(

                vector.size

            );

        for(

            let i=0;

            i<vector.size;

            i++

        ){

            const value=

                vector.get(i);

            if(value!==0){

                result.set(

                    i,

                    value*

                    this.inverseDiagonal[i]

                );

            }

        }

        return result;

    }

    info(){

        return{

            engine:

                "JacobiPreconditioner",

            initialized:

                this.isInitialized()

        };

    }

}