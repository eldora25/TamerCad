export class Vector {

    private readonly values:number[];

    readonly size:number;

    constructor(values:number[]){

        this.values=[...values];

        this.size=values.length;

    }

    static zeros(size:number):Vector{

        return new Vector(

            new Array(size).fill(0)

        );

    }

    get(index:number):number{

        return this.values[index];

    }

    set(index:number,value:number):void{

        this.values[index]=value;

    }

    clone():Vector{

        return new Vector(this.values);

    }

    add(other:Vector):Vector{

        this.assertSameSize(other);

        const result=this.clone();

        for(let i=0;i<this.size;i++){

            result.set(

                i,

                this.get(i)+other.get(i)

            );

        }

        return result;

    }

    subtract(other:Vector):Vector{

        this.assertSameSize(other);

        const result=this.clone();

        for(let i=0;i<this.size;i++){

            result.set(

                i,

                this.get(i)-other.get(i)

            );

        }

        return result;

    }

    scale(value:number):Vector{

        const result=this.clone();

        for(let i=0;i<this.size;i++){

            result.set(

                i,

                result.get(i)*value

            );

        }

        return result;

    }

    dot(other:Vector):number{

        this.assertSameSize(other);

        let sum=0;

        for(let i=0;i<this.size;i++){

            sum+=

                this.get(i)*other.get(i);

        }

        return sum;

    }

    norm():number{

        return Math.sqrt(

            this.dot(this)

        );

    }

    normalize():Vector{

        const n=this.norm();

        if(n===0){

            return this.clone();

        }

        return this.scale(1/n);

    }

    max():number{

        return Math.max(...this.values);

    }

    min():number{

        return Math.min(...this.values);

    }

    toArray():number[]{

        return [...this.values];

    }

    serialize(){

        return{

            size:this.size,

            values:this.toArray()

        };

    }

    private assertSameSize(other:Vector){

        if(this.size!==other.size){

            throw new Error(

                "Vector size mismatch"

            );

        }

    }

    info(){

        return{

            size:this.size

        };

    }

}