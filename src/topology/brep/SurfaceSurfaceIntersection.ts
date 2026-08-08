import { Surface }
from "../surface/Surface";

import { Point }
from "../core/Point";

import { Vector3 }
from "../core/Vector3";

import { Curve }
from "../curve/Curve";

import { LineCurve }
from "../curve/LineCurve";







export interface SurfaceIntersectionResult {


    intersect:boolean;


    curves:Curve[];


    points:Point[];


    errors:string[];


}







export class SurfaceSurfaceIntersection {







    constructor(

        public tolerance:number = 1e-6

    ){}





    







    intersect(

        surfaceA:Surface,

        surfaceB:Surface

    ):

    SurfaceIntersectionResult {



        const errors:

        string[] = [];





        const curves:

        Curve[] = [];





        const points:

        Point[] = [];









        const planeResult =

        this.intersectPlanes(

            surfaceA,

            surfaceB

        );









        if(

            planeResult

        ){



            curves.push(

                planeResult

            );





            return {


                intersect:true,


                curves,


                points,


                errors


            };

        }









        return {


            intersect:false,


            curves:[],


            points:[],


            errors:[

                "Surface intersection not implemented"

            ]

        };

    }









    private intersectPlanes(

        a:Surface,

        b:Surface

    ):

    Curve|null {



        const normalA =

        a.normal(

            0,

            0

        );



        const normalB =

        b.normal(

            0,

            0

        );









        if(

            !normalA

            ||

            !normalB

        ){

            return null;

        }









        const cross =

        normalA.cross(

            normalB

        );









        const length =

        this.vectorLength(

            cross

        );









        if(

            length <

            this.tolerance

        ){

            return null;

        }









        const pointA =

        a.evaluate(

            0,

            0

        );



        const pointB =

        b.evaluate(

            0,

            0

        );









        const direction =

        this.normalize(

            cross

        );









        const linePoint =

        this.planePlanePoint(

            pointA,

            normalA,

            pointB,

            normalB

        );









        if(

            !linePoint

        ){

            return null;

        }









        const start =

        new Point(

            linePoint.x -

            direction.x * 10000,


            linePoint.y -

            direction.y * 10000,


            linePoint.z -

            direction.z * 10000

        );









        const end =

        new Point(

            linePoint.x +

            direction.x * 10000,


            linePoint.y +

            direction.y * 10000,


            linePoint.z +

            direction.z * 10000

        );









        return new LineCurve(

            start,

            end

        );

    }









    private planePlanePoint(

        p1:Point,

        n1:Vector3,

        p2:Point,

        n2:Vector3

    ):

    Point|null {



        const d1 =

        n1.dot(

            p1.subtract(

                new Point()

            )

        );



        const d2 =

        n2.dot(

            p2.subtract(

                new Point()

            )

        );









        const direction =

        n1.cross(

            n2

        );









        const denom =

        this.vectorLengthSquared(

            direction

        );









        if(

            denom <

            this.tolerance

        ){

            return null;

        }









        const term1 =

        n2.cross(

            direction

        )

        .multiply(

            d1

        );









        const term2 =

        direction.cross(

            n1

        )

        .multiply(

            d2

        );









        const result =

        term1.add(

            term2

        )

        .divide(

            denom

        );









        return new Point(

            result.x,

            result.y,

            result.z

        );

    }









    closestPoints(

        surfaceA:Surface,

        surfaceB:Surface

    ):

    {

        a:Point;

        b:Point;

        distance:number;

    } {



        let bestA =

        surfaceA.evaluate(

            surfaceA.uMin,

            surfaceA.vMin

        );



        let bestB =

        surfaceB.evaluate(

            surfaceB.uMin,

            surfaceB.vMin

        );









        let distance =

        bestA.distanceTo(

            bestB

        );









        const samples =

        20;









        for(

            let i=0;

            i<=samples;

            i++

        ){



            const u =

            surfaceA.uMin +

            (

                surfaceA.uMax -

                surfaceA.uMin

            )

            *

            i /

            samples;









            for(

                let j=0;

                j<=samples;

                j++

            ){



                const v =

                surfaceA.vMin +

                (

                    surfaceA.vMax -

                    surfaceA.vMin

                )

                *

                j /

                samples;









                const p =

                surfaceA.evaluate(

                    u,

                    v

                );









                const q =

                surfaceB.closestPoint(

                    p

                );









                const d =

                p.distanceTo(

                    q

                );









                if(

                    d < distance

                ){



                    distance = d;


                    bestA = p;


                    bestB = q;

                }

            }

        }









        return {


            a:bestA,


            b:bestB,


            distance


        };

    }









    private normalize(

        v:Vector3

    ):

    Vector3 {



        const l =

        this.vectorLength(

            v

        );









        return new Vector3(

            v.x / l,

            v.y / l,

            v.z / l

        );

    }









    private vectorLength(

        v:Vector3

    ):

    number {



        return Math.sqrt(

            v.x*v.x +

            v.y*v.y +

            v.z*v.z

        );

    }









    private vectorLengthSquared(

        v:Vector3

    ):

    number {



        return (

            v.x*v.x +

            v.y*v.y +

            v.z*v.z

        );

    }







}