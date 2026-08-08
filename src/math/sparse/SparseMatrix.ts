import { Matrix } from "../core/Matrix";
import { Vector } from "../core/Vector";

export class SparseMatrix {

    readonly rows:number;
    readonly cols:number;

    readonly values:number[]=[];
    readonly columnIndices:number[]=[];
    readonly rowPointers:number[];

    constructor(

        rows:number,

        cols:number

    ){

        this.rows=rows;
        this.cols=cols;

        this.rowPointers=
            new Array(rows+1).fill(0);

    }

    static fromDense(

        matrix:Matrix

    ):SparseMatrix{

        const sparse=new SparseMatrix(

            matrix.rows,

            matrix.cols

        );

        let count=0;

        for(let i=0;i<matrix.rows;i++){

            sparse.rowPointers[i]=count;

            for(let j=0;j<matrix.cols;j++){

                const value=

                    matrix.get(i,j);

                if(value!==0){

                    sparse.values.push(value);

                    sparse.columnIndices.push(j);

                    count++;

                }

            }

        }

        sparse.rowPointers[matrix.rows]=count;

        return sparse;

    }

    get(

        row:number,

        col:number

    ):number{

        const start=

            this.rowPointers[row];

        const end=

            this.rowPointers[row+1];

        for(

            let i=start;

            i<end;

            i++

        ){

            if(

                this.columnIndices[i]===col

            ){

                return this.values[i];

            }

        }

        return 0;

    }

    multiply(

        vector:Vector

    ):Vector{

        const result=

            Vector.zeros(

                this.rows

            );

        for(

            let row=0;

            row<this.rows;

            row++

        ){

            let sum=0;

            const start=

                this.rowPointers[row];

            const end=

                this.rowPointers[row+1];

            for(

                let i=start;

                i<end;

                i++

            ){

                sum+=

                    this.values[i]*

                    vector.get(

                        this.columnIndices[i]

                    );

            }

            result.set(

                row,

                sum

            );

        }

        return result;

    }

    nonZeroCount():number{

        return this.values.length;

    }

    density():number{

        return this.values.length/

        (this.rows*this.cols);

    }

    toDense():Matrix{

        const dense=

            Matrix.zeros(

                this.rows,

                this.cols

            );

        for(

            let row=0;

            row<this.rows;

            row++

        ){

            const start=

                this.rowPointers[row];

            const end=

                this.rowPointers[row+1];

            for(

                let i=start;

                i<end;

                i++

            ){

                dense.set(

                    row,

                    this.columnIndices[i],

                    this.values[i]

                );

            }

        }

        return dense;

    }

    serialize(){

        return{

            rows:this.rows,

            cols:this.cols,

            values:this.values,

            columns:this.columnIndices,

            pointers:this.rowPointers

        };

    }

    info(){

        return{

            engine:"SparseMatrix",

            rows:this.rows,

            cols:this.cols,

            nonZeros:

                this.nonZeroCount(),

            density:

                this.density()

        };

    }

}