export class Matrix4 {

    public elements: number[];


    constructor(elements?: number[]) {

        this.elements = elements ?? [
            1,0,0,0,
            0,1,0,0,
            0,0,1,0,
            0,0,0,1
        ];
    }


    static identity(): Matrix4 {

        return new Matrix4();
    }


    static translation(
        x:number,
        y:number,
        z:number
    ):Matrix4 {

        return new Matrix4([
            1,0,0,x,
            0,1,0,y,
            0,0,1,z,
            0,0,0,1
        ]);
    }


    static scale(
        x:number,
        y:number,
        z:number
    ):Matrix4 {

        return new Matrix4([
            x,0,0,0,
            0,y,0,0,
            0,0,z,0,
            0,0,0,1
        ]);
    }


    multiply(
        m:Matrix4
    ):Matrix4 {


        const a = this.elements;
        const b = m.elements;

        const r:number[] = new Array(16).fill(0);


        for(let row=0; row<4; row++) {

            for(let col=0; col<4; col++) {


                for(let k=0;k<4;k++) {

                    r[row*4+col] +=
                        a[row*4+k] *
                        b[k*4+col];

                }
            }
        }


        return new Matrix4(r);
    }


    transformVector(
        x:number,
        y:number,
        z:number
    ) {


        const m=this.elements;


        return {

            x:
            m[0]*x +
            m[1]*y +
            m[2]*z +
            m[3],


            y:
            m[4]*x +
            m[5]*y +
            m[6]*z +
            m[7],


            z:
            m[8]*x +
            m[9]*y +
            m[10]*z +
            m[11]

        };
    }


    clone():Matrix4 {

        return new Matrix4(
            [...this.elements]
        );
    }
}