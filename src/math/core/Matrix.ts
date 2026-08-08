export class Matrix {

    private readonly values:number[][];

    readonly rows:number;

    readonly cols:number;

    constructor(values:number[][]){

        if(values.length===0){

            throw new Error("Matrix cannot be empty");

        }

        const cols=values[0].length;

        for(const row of values){

            if(row.length!==cols){

                throw new Error(
                    "Invalid matrix shape"
                );

            }

        }

        this.values=values.map(r=>[...r]);

        this.rows=values.length;

        this.cols=cols;

    }

    static zeros(

        rows:number,

        cols:number

    ):Matrix{

        return new Matrix(

            Array.from(

                {length:rows},

                ()=>new Array(cols).fill(0)

            )

        );

    }

    static identity(size:number):Matrix{

        const m=Matrix.zeros(size,size);

        for(let i=0;i<size;i++){

            m.values[i][i]=1;

        }

        return m;

    }

    get(

        row:number,

        col:number

    ):number{

        return this.values[row][col];

    }

    set(

        row:number,

        col:number,

        value:number

    ):void{

        this.values[row][col]=value;

    }

    clone():Matrix{

        return new Matrix(this.values);

    }

    transpose():Matrix{

        const result=

            Matrix.zeros(

                this.cols,

                this.rows

            );

        for(

            let i=0;

            i<this.rows;

            i++

        ){

            for(

                let j=0;

                j<this.cols;

                j++

            ){

                result.set(

                    j,

                    i,

                    this.get(i,j)

                );

            }

        }

        return result;

    }

    add(other:Matrix):Matrix{

        this.assertSameShape(other);

        const result=this.clone();

        for(let i=0;i<this.rows;i++){

            for(let j=0;j<this.cols;j++){

                result.set(

                    i,

                    j,

                    this.get(i,j)+other.get(i,j)

                );

            }

        }

        return result;

    }

    subtract(other:Matrix):Matrix{

        this.assertSameShape(other);

        const result=this.clone();

        for(let i=0;i<this.rows;i++){

            for(let j=0;j<this.cols;j++){

                result.set(

                    i,

                    j,

                    this.get(i,j)-other.get(i,j)

                );

            }

        }

        return result;

    }

    multiply(other:Matrix):Matrix{

        if(this.cols!==other.rows){

            throw new Error(
                "Invalid matrix multiplication"
            );

        }

        const result=

            Matrix.zeros(

                this.rows,

                other.cols

            );

        for(let i=0;i<this.rows;i++){

            for(let j=0;j<other.cols;j++){

                let sum=0;

                for(let k=0;k<this.cols;k++){

                    sum+=

                        this.get(i,k)*

                        other.get(k,j);

                }

                result.set(i,j,sum);

            }

        }

        return result;

    }

    scale(value:number):Matrix{

        const result=this.clone();

        for(let i=0;i<this.rows;i++){

            for(let j=0;j<this.cols;j++){

                result.set(

                    i,

                    j,

                    result.get(i,j)*value

                );

            }

        }

        return result;

    }

    trace():number{

        if(this.rows!==this.cols){

            throw new Error(
                "Trace requires square matrix"
            );

        }

        let t=0;

        for(let i=0;i<this.rows;i++){

            t+=this.get(i,i);

        }

        return t;

    }

    toArray():number[][]{

        return this.values.map(r=>[...r]);

    }

    serialize(){

        return{

            rows:this.rows,

            cols:this.cols,

            values:this.toArray()

        };

    }

    private assertSameShape(other:Matrix){

        if(

            this.rows!==other.rows ||

            this.cols!==other.cols

        ){

            throw new Error(
                "Matrix size mismatch"
            );

        }

    }

    info(){

        return{

            rows:this.rows,

            cols:this.cols

        };

    }

}