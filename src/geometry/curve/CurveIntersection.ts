import { Curve }
from "./Curve";


import { LineCurve }
from "./LineCurve";


import { CircleCurve }
from "./CircleCurve";


import { Point }
from "../core/Point";



export interface IntersectionPoint {


    point:Point;


    parameterA:number;


    parameterB:number;


    distance:number;

}





export class CurveIntersection {



    static intersect(

        a:Curve,

        b:Curve

    ):

    IntersectionPoint[] {


        if(

            a instanceof LineCurve &&

            b instanceof LineCurve

        ){

            return this.intersectLineLine(

                a,

                b

            );

        }




        if(

            a instanceof LineCurve &&

            b instanceof CircleCurve

        ){

            return this.intersectLineCircle(

                a,

                b

            );

        }




        if(

            a instanceof CircleCurve &&

            b instanceof LineCurve

        ){

            const result =

            this.intersectLineCircle(

                b,

                a

            );



            return result.map(

                x => ({

                    point:x.point,

                    parameterA:x.parameterB,

                    parameterB:x.parameterA,

                    distance:x.distance

                })

            );

        }



        return this.intersectCurveCurve(

            a,

            b

        );

    }







    private static intersectLineLine(

        a:LineCurve,

        b:LineCurve

    ):

    IntersectionPoint[] {


        const p1 =

        a.startPoint();



        const p2 =

        b.startPoint();



        const d1 =

        a.derivative(0);



        const d2 =

        b.derivative(0);




        const cross =

        d1.cross(

            d2

        );



        if(

            cross.length() < 1e-10

        ){

            return [];

        }



        const t =

        (

            p2

            .subtract(p1)

            .cross(d2)

        )

        .length()

        /

        cross.length();




        const point =

        a.evaluate(t);



        return [

            {

                point,

                parameterA:t,

                parameterB:0,

                distance:0

            }

        ];

    }







    private static intersectLineCircle(

        line:LineCurve,

        circle:CircleCurve

    ):

    IntersectionPoint[] {



        const samples = 200;


        const result:

        IntersectionPoint[]=[];




        let previous =

        line.evaluate(-100);



        let previousDistance =

        previous.distanceTo(

            circle.center

        )

        -

        circle.radius;




        for(

            let i=1;

            i<=samples;

            i++

        ){


            const t =

            -100 +

            (

                200*i/samples

            );



            const current =

            line.evaluate(t);



            const distance =

            current.distanceTo(

                circle.center

            )

            -

            circle.radius;




            if(

                previousDistance *

                distance

                <

                0

            ){



                result.push({

                    point:current,

                    parameterA:t,

                    parameterB:0,

                    distance:Math.abs(distance)

                });


            }



            previous=current;

            previousDistance=distance;

        }




        return result;

    }







    private static intersectCurveCurve(

        a:Curve,

        b:Curve

    ):

    IntersectionPoint[] {



        const result:

        IntersectionPoint[]=[];



        const samples=200;




        for(

            let i=0;

            i<=samples;

            i++

        ){



            const ta =

            a.startParameter +

            (

                a.endParameter -

                a.startParameter

            )

            *

            i

            /

            samples;



            const pa =

            a.evaluate(ta);




            const pb =

            b.closestPoint(

                pa

            );



            if(

                pa.distanceTo(pb)

                <

                1e-5

            ){

                result.push({

                    point:pa,

                    parameterA:ta,

                    parameterB:0,

                    distance:

                    pa.distanceTo(pb)

                });

            }


        }



        return result;

    }



}