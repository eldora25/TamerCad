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



export class BSplineCurve extends Curve {



    constructor(

        public controlPoints:Point[],

        public degree:number,

        public knots:number[]

    ){

        super();



        if(controlPoints.length < degree + 1){

            throw new Error(

                "Not enough control points"

            );

        }



        if(

            knots.length !==

            controlPoints.length + degree + 1

        ){

            throw new Error(

                "Invalid knot vector size"

            );

        }

    }





    get startParameter():

    number {

        return this.knots[this.degree];

    }





    get endParameter():

    number {

        return this.knots[

            this.knots.length -

            this.degree -

            1

        ];

    }





    /**
     * Cox-de Boor recursion
     */
    private basis(

        i:number,

        k:number,

        t:number

    ):

    number {



        if(k===0){


            return (

                this.knots[i] <= t &&

                t < this.knots[i+1]

            )

            ?

            1

            :

            0;

        }



        const leftDenom =

        this.knots[i+k]

        -

        this.knots[i];



        const rightDenom =

        this.knots[i+k+1]

        -

        this.knots[i+1];



        let left = 0;

        let right = 0;



        if(leftDenom !== 0){


            left =

            (

                t -

                this.knots[i]

            )

            /

            leftDenom

            *

            this.basis(

                i,

                k-1,

                t

            );

        }



        if(rightDenom !== 0){


            right =

            (

                this.knots[i+k+1]

                -

                t

            )

            /

            rightDenom

            *

            this.basis(

                i+1,

                k-1,

                t

            );

        }



        return left + right;

    }





    evaluate(

        t:number

    ):

    Point {



        let result =

        new Vector3(

            0,

            0,

            0

        );



        for(

            let i=0;

            i<this.controlPoints.length;

            i++

        ){


            const weight =

            this.basis(

                i,

                this.degree,

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


        const delta =

        0.000001;



        return this.evaluate(

            t+delta

        )

        .subtract(

            this.evaluate(t)

        )

        .toVector()

        .multiply(

            1/delta

        );

    }





    length():

    number {


        const samples = 200;


        let length = 0;



        let previous =

        this.evaluate(

            this.startParameter

        );



        for(

            let i=1;

            i<=samples;

            i++

        ){


            const t =

            this.startParameter +

            (

                (

                    this.endParameter -

                    this.startParameter

                )

                *

                i

                /

                samples

            );



            const current =

            this.evaluate(t);



            length +=

            previous.distanceTo(

                current

            );



            previous=current;

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

            box.expand(p);

        }



        return box;

    }





    closestPoint(

        point:Point

    ):

    Point {


        let closest =

        this.evaluate(

            this.startParameter

        );



        let minDistance =

        closest.distanceTo(

            point

        );



        const samples=200;



        for(

            let i=0;

            i<=samples;

            i++

        ){


            const t =

            this.startParameter +

            (

                (

                this.endParameter -

                this.startParameter

                )

                *

                i

                /

                samples

            );



            const p =

            this.evaluate(t);



            const d =

            p.distanceTo(point);



            if(d < minDistance){

                minDistance=d;

                closest=p;

            }

        }



        return closest;

    }





    reverse():

    BSplineCurve {


        return new BSplineCurve(

            [

                ...this.controlPoints

            ]

            .reverse(),


            this.degree,


            [

                ...this.knots

            ]

            .reverse()

        );

    }





    transform(

        transform:Transform

    ):

    BSplineCurve {


        return new BSplineCurve(

            this.controlPoints.map(

                p =>

                transform.applyToPoint(p)

            ),

            this.degree,

            [...this.knots]

        );

    }



}