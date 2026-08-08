import { Curve }
from "./Curve";


import { Point }
from "../core/Point";


import { Vector3 }
from "../core/Vector3";


import { BoundingBox }
from "../core/BoundingBox";


import { Transform }
from "../core/Transform";



export class NURBSCurve extends Curve {



    constructor(

        public controlPoints:Point[],

        public weights:number[],

        public degree:number,

        public knots:number[]

    ){

        super();



        if(

            controlPoints.length !==

            weights.length

        ){

            throw new Error(

                "Control point and weight count mismatch"

            );

        }



        if(

            knots.length !==

            controlPoints.length

            +

            degree

            +

            1

        ){

            throw new Error(

                "Invalid knot vector"

            );

        }

    }





    get startParameter():

    number {


        return this.knots[this.degree];

    }





    get endParameter():

    number {


        return (

            this.knots[

                this.knots.length -

                this.degree -

                1

            ]

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

            result*=

            (

                n-i+1

            )

            /

            i;

        }


        return result;

    }





    private basis(

        i:number,

        k:number,

        t:number

    ):

    number {



        if(k===0){


            return (

                this.knots[i] <= t

                &&

                t < this.knots[i+1]

            )

            ?

            1

            :

            0;

        }



        let left=0;

        let right=0;



        const leftDenom =

        this.knots[i+k]

        -

        this.knots[i];



        const rightDenom =

        this.knots[i+k+1]

        -

        this.knots[i+1];



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


        let numerator =

        new Vector3(

            0,

            0,

            0

        );


        let denominator = 0;



        for(

            let i=0;

            i<this.controlPoints.length;

            i++

        ){


            const basis =

            this.basis(

                i,

                this.degree,

                t

            );



            const rationalWeight =

            basis *

            this.weights[i];



            numerator =

            numerator.add(

                this.controlPoints[i]

                .toVector()

                .multiply(

                    rationalWeight

                )

            );



            denominator +=

            rationalWeight;

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


        const samples=200;


        let result=0;



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

            this.startParameter

            +

            (

                this.endParameter

                -

                this.startParameter

            )

            *

            i

            /

            samples;



            const current =

            this.evaluate(t);



            result +=

            previous.distanceTo(

                current

            );



            previous=current;

        }



        return result;

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



        let min =

        closest.distanceTo(

            point

        );



        const samples=300;



        for(

            let i=0;

            i<=samples;

            i++

        ){


            const t =

            this.startParameter +

            (

                this.endParameter -

                this.startParameter

            )

            *

            i

            /

            samples;



            const p=

            this.evaluate(t);



            const d=

            p.distanceTo(point);



            if(d<min){

                min=d;

                closest=p;

            }

        }



        return closest;

    }





    reverse():

    NURBSCurve {


        return new NURBSCurve(

            [

                ...this.controlPoints

            ]

            .reverse(),


            [

                ...this.weights

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

    NURBSCurve {


        return new NURBSCurve(

            this.controlPoints.map(

                p =>

                transform.applyToPoint(p)

            ),

            [

                ...this.weights

            ],

            this.degree,

            [

                ...this.knots

            ]

        );

    }



}