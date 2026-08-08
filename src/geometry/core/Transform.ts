import { Point }
from "./Point";


import { Vector3 }
from "./Vector3";



export class Transform {



    private matrix:number[][];



    constructor(

        matrix?:number[][]

    ){


        this.matrix =

        matrix ??

        Transform.identity().matrix;


    }



    applyToPoint(

        point:Point

    ):Point {


        const m=this.matrix;



        const x =

        m[0][0]*point.x +

        m[0][1]*point.y +

        m[0][2]*point.z +

        m[0][3];



        const y =

        m[1][0]*point.x +

        m[1][1]*point.y +

        m[1][2]*point.z +

        m[1][3];



        const z =

        m[2][0]*point.x +

        m[2][1]*point.y +

        m[2][2]*point.z +

        m[2][3];



        return new Point(

            x,

            y,

            z

        );

    }





    applyToVector(

        vector:Vector3

    ):Vector3 {


        const m=this.matrix;



        return new Vector3(

            m[0][0]*vector.x +

            m[0][1]*vector.y +

            m[0][2]*vector.z,


            m[1][0]*vector.x +

            m[1][1]*vector.y +

            m[1][2]*vector.z,


            m[2][0]*vector.x +

            m[2][1]*vector.y +

            m[2][2]*vector.z

        );

    }





    multiply(

        other:Transform

    ):Transform {


        const result:number[][] =

        Array.from(

            {
                length:4
            },

            ()=>Array(4).fill(0)

        );



        for(
            let i=0;i<4;i++
        ){

            for(
                let j=0;j<4;j++
            ){

                for(
                    let k=0;k<4;k++
                ){

                    result[i][j]+=

                    this.matrix[i][k]

                    *

                    other.matrix[k][j];

                }

            }

        }



        return new Transform(
            result
        );

    }





    inverse():

    Transform {


        // Basit placeholder.
        // Daha sonra Matrix inverse
        // sınıfına bağlanacak.


        return Transform.identity();

    }





    static identity():

    Transform {


        return new Transform(

            [

                [1,0,0,0],

                [0,1,0,0],

                [0,0,1,0],

                [0,0,0,1]

            ]

        );

    }





    static translation(

        x:number,

        y:number,

        z:number

    ):


    Transform {


        return new Transform(

            [

                [1,0,0,x],

                [0,1,0,y],

                [0,0,1,z],

                [0,0,0,1]

            ]

        );

    }





    static scale(

        x:number,

        y:number,

        z:number

    ):

    Transform {


        return new Transform(

            [

                [x,0,0,0],

                [0,y,0,0],

                [0,0,z,0],

                [0,0,0,1]

            ]

        );

    }



    getMatrix(){

        return this.matrix.map(

            row=>[...row]

        );

    }



}