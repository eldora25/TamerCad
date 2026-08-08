import { Surface }
from "./Surface";


import { Point }
from "../core/Point";


import { Vector3 }
from "../core/Vector3";


import { BoundingBox }
from "../core/BoundingBox";


import { Transform }
from "../core/Transform";



export class BezierSurface

extends Surface {



    constructor(

        public controlPoints:Point[][]

    ){

        super();



        if(

            controlPoints.length < 2 ||

            controlPoints[0].length < 2

        ){

            throw new Error(

                "Invalid Bezier control grid"

            );

        }

    }







    private get degreeU():

    number {

        return this.controlPoints.length-1;

    }





    private get degreeV():

    number {

        return this.controlPoints[0].length-1;

    }





    get uMin():

    number {

        return 0;

    }





    get uMax():

    number {

        return 1;

    }





    get vMin():

    number {

        return 0;

    }





    get vMax():

    number {

        return 1;

    }







    private bernstein(

        n:number,

        i:number,

        t:number

    ):

    number {



        const coefficient =

        this.binomial(

            n,

            i

        );



        return coefficient *

        Math.pow(

            t,

            i

        )

        *

        Math.pow(

            1-t,

            n-i

        );

    }







    private binomial(

        n:number,

        k:number

    ):

    number {



        let result=1;



        for(

            let i=1;

            i<=k;

            i++

        ){

            result *=

            (

                n-i+1

            )

            /

            i;

        }



        return result;

    }







    evaluate(

        u:number,

        v:number

    ):

    Point {



        let result =

        new Vector3(

            0,

            0,

            0

        );



        const n =

        this.degreeU;



        const m =

        this.degreeV;



        for(

            let i=0;

            i<=n;

            i++

        ){



            for(

                let j=0;

                j<=m;

                j++

            ){



                const weight =

                this.bernstein(

                    n,

                    i,

                    u

                )

                *

                this.bernstein(

                    m,

                    j,

                    v

                );



                result =

                result.add(

                    this.controlPoints[i][j]

                    .toVector()

                    .multiply(

                        weight

                    )

                );

            }

        }



        return new Point(

            result.x,

            result.y,

            result.z

        );

    }







    derivativeU(

        u:number,

        v:number

    ):

    Vector3 {


        const delta =

        0.000001;



        return this.evaluate(

            u+delta,

            v

        )

        .subtract(

            this.evaluate(

                u,

                v

            )

        )

        .toVector()

        .multiply(

            1/delta

        );

    }







    derivativeV(

        u:number,

        v:number

    ):

    Vector3 {


        const delta =

        0.000001;



        return this.evaluate(

            u,

            v+delta

        )

        .subtract(

            this.evaluate(

                u,

                v

            )

        )

        .toVector()

        .multiply(

            1/delta

        );

    }







    boundingBox():

    BoundingBox {



        const box =

        BoundingBox.empty();



        for(

            const row of this.controlPoints

        ){

            for(

                const p of row

            ){

                box.expand(p);

            }

        }



        return box;

    }







    reverse():

    BezierSurface {


        return new BezierSurface(

            this.controlPoints

            .map(

                row =>

                [

                    ...row

                ]

                .reverse()

            )

            .reverse()

        );

    }







    transform(

        transform:Transform

    ):

    BezierSurface {



        return new BezierSurface(

            this.controlPoints.map(

                row =>

                row.map(

                    p =>

                    transform.applyToPoint(p)

                )

            )

        );

    }



}