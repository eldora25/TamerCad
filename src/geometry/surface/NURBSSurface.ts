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



export class NURBSSurface

extends Surface {



    constructor(

        public controlPoints:Point[][],

        public weights:number[][],

        public degreeU:number,

        public degreeV:number,

        public knotsU:number[],

        public knotsV:number[]

    ){

        super();



        if(

            controlPoints.length===0 ||

            controlPoints[0].length===0

        ){

            throw new Error(

                "Invalid NURBS control grid"

            );

        }



        if(

            weights.length !==

            controlPoints.length

        ){

            throw new Error(

                "Weight size mismatch"

            );

        }

    }







    get uMin():

    number {


        return this.knotsU[

            this.degreeU

        ];

    }





    get uMax():

    number {


        return this.knotsU[

            this.knotsU.length -

            this.degreeU -

            1

        ];

    }





    get vMin():

    number {


        return this.knotsV[

            this.degreeV

        ];

    }





    get vMax():

    number {


        return this.knotsV[

            this.knotsV.length -

            this.degreeV -

            1

        ];

    }







    private basis(

        i:number,

        degree:number,

        knots:number[],

        t:number

    ):

    number {



        if(degree===0){


            return (

                knots[i] <= t &&

                t < knots[i+1]

            )

            ?

            1

            :

            0;

        }



        let a=0;

        let b=0;



        const d1 =

        knots[i+degree]

        -

        knots[i];



        const d2 =

        knots[i+degree+1]

        -

        knots[i+1];





        if(d1!==0){


            a =

            (

                t-knots[i]

            )

            /

            d1

            *

            this.basis(

                i,

                degree-1,

                knots,

                t

            );

        }






        if(d2!==0){


            b =

            (

                knots[i+degree+1]

                -

                t

            )

            /

            d2

            *

            this.basis(

                i+1,

                degree-1,

                knots,

                t

            );

        }



        return a+b;

    }







    evaluate(

        u:number,

        v:number

    ):

    Point {



        let numerator =

        new Vector3(

            0,

            0,

            0

        );



        let denominator =

        0;




        for(

            let i=0;

            i<this.controlPoints.length;

            i++

        ){



            const Nu =

            this.basis(

                i,

                this.degreeU,

                this.knotsU,

                u

            );




            for(

                let j=0;

                j<this.controlPoints[i].length;

                j++

            ){



                const Nv =

                this.basis(

                    j,

                    this.degreeV,

                    this.knotsV,

                    v

                );



                const w =

                this.weights[i][j];



                const factor =

                Nu *

                Nv *

                w;



                numerator =

                numerator.add(

                    this.controlPoints[i][j]

                    .toVector()

                    .multiply(

                        factor

                    )

                );



                denominator +=

                factor;

            }

        }




        if(

            denominator===0

        ){

            throw new Error(

                "Invalid NURBS evaluation"

            );

        }




        return new Point(

            numerator.x /

            denominator,


            numerator.y /

            denominator,


            numerator.z /

            denominator

        );

    }







    derivativeU(

        u:number,

        v:number

    ):

    Vector3 {



        const eps =

        1e-6;



        return this.evaluate(

            u+eps,

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

            1/eps

        );

    }







    derivativeV(

        u:number,

        v:number

    ):

    Vector3 {



        const eps =

        1e-6;



        return this.evaluate(

            u,

            v+eps

        )

        .subtract(

            this.evaluate(

                u,

                v

            )

        )

        .toVector()

        .multiply(

            1/eps

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

                const point of row

            ){

                box.expand(point);

            }

        }



        return box;

    }







    reverse():

    NURBSSurface {



        return new NURBSSurface(

            this.controlPoints

            .map(

                r =>

                [

                    ...r

                ]

                .reverse()

            )

            .reverse(),


            this.weights

            .map(

                r =>

                [

                    ...r

                ]

                .reverse()

            )

            .reverse(),


            this.degreeU,

            this.degreeV,

            this.knotsU,

            this.knotsV

        );

    }







    transform(

        transform:Transform

    ):

    NURBSSurface {



        return new NURBSSurface(

            this.controlPoints.map(

                row =>

                row.map(

                    p =>

                    transform.applyToPoint(p)

                )

            ),

            this.weights,

            this.degreeU,

            this.degreeV,

            this.knotsU,

            this.knotsV

        );

    }



}