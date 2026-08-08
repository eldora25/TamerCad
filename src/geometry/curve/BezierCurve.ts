import { Curve }
from "./Curve";


import { Point }
from "../core/Point";


import { Vector3 }
from "../core/Vector3";


import { Direction }
from "../core/Direction";


import { BoundingBox }
from "../core/BoundingBox";


import { Transform }
from "../core/Transform";



export class BezierCurve extends Curve {



    constructor(

        public controlPoints:Point[]

    ){

        super();



        if(

            controlPoints.length < 2

        ){

            throw new Error(

                "Bezier curve needs at least two control points"

            );

        }

    }





    get degree():

    number {

        return this.controlPoints.length - 1;

    }





    get startParameter():

    number {

        return 0;

    }





    get endParameter():

    number {

        return 1;

    }





    /**
     * Bernstein polynomial
     */
    private bernstein(

        n:number,

        i:number,

        t:number

    ):

    number {


        return (

            this.binomial(

                n,

                i

            )

            *

            Math.pow(

                1-t,

                n-i

            )

            *

            Math.pow(

                t,

                i

            )

        );

    }





    private binomial(

        n:number,

        k:number

    ):

    number {


        let result = 1;


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

        t:number

    ):

    Point {


        if(

            t<0 ||

            t>1

        ){

            throw new Error(

                "Bezier parameter must be between 0 and 1"

            );

        }



        let result =

        new Vector3(

            0,

            0,

            0

        );



        const n =

        this.degree;



        for(

            let i=0;

            i<=n;

            i++

        ){


            const weight =

            this.bernstein(

                n,

                i,

                t

            );


            result =

            result.add(

                this.controlPoints[i]

                .toVector()

                .multiply(

                    weight

                )

            );


        }



        return new Point(

            result.x,

            result.y,

            result.z

        );

    }





    derivative(

        t:number

    ):

    Vector3 {


        const n =

        this.degree;



        let result =

        new Vector3(

            0,

            0,

            0

        );



        for(

            let i=0;

            i<n;

            i++

        ){


            const delta =

            this.controlPoints[i+1]

            .subtract(

                this.controlPoints[i]

            );



            result =

            result.add(

                delta.toVector()

                .multiply(

                    n *

                    this.bernstein(

                        n-1,

                        i,

                        t

                    )

                )

            );

        }



        return result;

    }





    length():

    number {


        const samples = 100;


        let length = 0;



        let previous =

        this.evaluate(0);



        for(

            let i=1;

            i<=samples;

            i++

        ){


            const current =

            this.evaluate(

                i/samples

            );



            length +=

            previous.distanceTo(

                current

            );



            previous = current;

        }



        return length;

    }





    boundingBox():

    BoundingBox {


        const box =

        BoundingBox.empty();



        for(

            const p of this.controlPoints

        ){

            box.expand(

                p

            );

        }


        return box;

    }





    closestPoint(

        point:Point

    ):

    Point {


        let closest =

        this.evaluate(0);



        let distance =

        closest.distanceTo(

            point

        );



        const samples = 100;



        for(

            let i=1;

            i<=samples;

            i++

        ){

            const p =

            this.evaluate(

                i/samples

            );


            const d =

            p.distanceTo(

                point

            );



            if(

                d < distance

            ){

                distance = d;

                closest = p;

            }

        }



        return closest;

    }





    reverse():

    BezierCurve {


        return new BezierCurve(

            [

                ...this.controlPoints

            ]

            .reverse()

        );

    }





    transform(

        transform:Transform

    ):

    BezierCurve {


        return new BezierCurve(

            this.controlPoints.map(

                p =>

                transform.applyToPoint(

                    p

                )

            )

        );

    }





}