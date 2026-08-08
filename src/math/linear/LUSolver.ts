export class LUSolver {

    solve(

        A:number[][],

        b:number[]

    ):number[]{

        const n=A.length;

        const LU=A.map(

            row=>[...row]

        );

        const piv=[...Array(n).keys()];

        for(let k=0;k<n;k++){

            let max=k;

            for(let i=k+1;i<n;i++){

                if(

                    Math.abs(LU[i][k])>

                    Math.abs(LU[max][k])

                ){

                    max=i;

                }

            }

            if(

                Math.abs(LU[max][k])<1e-12

            ){

                throw new Error(

                    "Singular matrix"

                );

            }

            [LU[k],LU[max]]=

                [LU[max],LU[k]];

            [piv[k],piv[max]]=

                [piv[max],piv[k]];

            for(

                let i=k+1;

                i<n;

                i++

            ){

                LU[i][k]/=LU[k][k];

                for(

                    let j=k+1;

                    j<n;

                    j++

                ){

                    LU[i][j]-=

                        LU[i][k]*LU[k][j];

                }

            }

        }

        const y=new Array(n).fill(0);

        for(let i=0;i<n;i++){

            y[i]=b[piv[i]];

            for(let j=0;j<i;j++){

                y[i]-=LU[i][j]*y[j];

            }

        }

        const x=new Array(n).fill(0);

        for(

            let i=n-1;

            i>=0;

            i--

        ){

            x[i]=y[i];

            for(

                let j=i+1;

                j<n;

                j++

            ){

                x[i]-=

                    LU[i][j]*x[j];

            }

            x[i]/=LU[i][i];

        }

        return x;

    }

    residual(

        A:number[][],

        x:number[],

        b:number[]

    ):number{

        let sum=0;

        for(

            let i=0;

            i<A.length;

            i++

        ){

            let value=0;

            for(

                let j=0;

                j<A.length;

                j++

            ){

                value+=

                    A[i][j]*x[j];

            }

            const r=value-b[i];

            sum+=r*r;

        }

        return Math.sqrt(sum);

    }

    info(){

        return{

            engine:"LUSolver"

        };

    }

}