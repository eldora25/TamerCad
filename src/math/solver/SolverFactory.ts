import { LinearSystem } from "../linear/LinearSystem";
import { SparseLinearSystem } from "../sparse/SparseLinearSystem";

import { LUSolver } from "../linear/LUSolver";
import { CholeskySolver } from "../linear/CholeskySolver";

import { ConjugateGradientSolver } from "../iterative/ConjugateGradientSolver";
import { GMRESSolver } from "../iterative/GMRESSolver";

import { JacobiPreconditioner } from "../preconditioner/JacobiPreconditioner";
import { ILUPreconditioner } from "../preconditioner/ILUPreconditioner";
import { ICPreconditioner } from "../preconditioner/ICPreconditioner";

export class SolverFactory {

    static create(

        system:

        LinearSystem|

        SparseLinearSystem

    ){

        if(

            system instanceof SparseLinearSystem

        ){

            return this.createSparse(system);

        }

        return this.createDense(system);

    }

    protected static createDense(

        system:LinearSystem

    ){

        return new LUSolver();

    }

    protected static createSparse(

        system:SparseLinearSystem

    ){

        return{

            solver:

                new GMRESSolver(),

            preconditioner:

                new ILUPreconditioner()

        };

    }

    static info(){

        return{

            engine:"SolverFactory"

        };

    }

}