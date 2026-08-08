import { Matrix } from "../core/Matrix";
import { Vector } from "../core/Vector";
import { LinearSystem } from "./LinearSystem";

export class CholeskySolver {

    solve(system:LinearSystem):Vector{

        const L=this.factorize(system.A);

        const y=this.forwardSolve(

            L,

            system.b

        );

        return this.backwardSolve(

            L,

            y

        );

    }

    protected factorize(A:Matrix):Matrix{

        const n=A.rows;

        const L=Matrix.zeros(n,n);

        for(let i=0;i<n;i++){

            for(let j=0;j<=i;j++){

                let sum=A.get(i,j);

                for(let k=0;k<j;k++){

                    sum-=

                        L.get(i,k)*

                        L.get(j,k);

                }

                if(i===j){

                    if(sum<=0){

                        throw new Error(

                            "Matrix is not SPD"

                        );

                    }

                    L.set(

                        i,

                        j,

                        Math.sqrt(sum)

                    );

                }else{

                    L.set(

                        i,

                        j,

                        sum/L.get(j,j)

                    );

                }

            }

        }

        return L;

    }

    protected forwardSolve(

        L:Matrix,

        b:Vector

    ):Vector{

        const n=L.rows;

        const y=Vector.zeros(n);

        for(let i=0;i<n;i++){

            let value=b.get(i);

            for(let j=0;j<i;j++){

                value-=

                    L.get(i,j)*

                    y.get(j);

            }

            value/=L.get(i,i);

            y.set(i,value);

        }

        return y;

    }

    protected backwardSolve(

        L:Matrix,

        y:Vector

    ):Vector{

        const n=L.rows;

        const x=Vector.zeros(n);

        for(

            let i=n-1;

            i>=0;

            i--

        ){

            let value=y.get(i);

            for(

                let j=i+1;

                j<n;

                j++

            ){

                value-=

                    L.get(j,i)*

                    x.get(j);

            }

            value/=L.get(i,i);

            x.set(i,value);

        }

        return x;

    }

    residual(

        system:LinearSystem,

        x:Vector

    ):number{

        return system.residual(x);

    }

    info(){

        return{

            engine:"CholeskySolver"

        };

    }

}