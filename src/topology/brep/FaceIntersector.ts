import { Face }
from "../core/Face";

import { Surface }
from "../../geometry/surface/Surface";

import { IntersectionCurve }
from "./IntersectionCurve";

import { Point }
from "../../geometry/core/Point";

import { Curve }
from "../../geometry/curve/Curve";







export enum FaceIntersectionType {


    NONE = "none",


    POINT = "point",


    CURVE = "curve"


}









export interface FaceIntersectionResult {


    type:FaceIntersectionType;


    curves:IntersectionCurve[];


    points:Point[];


    errors:string[];


}









export class FaceIntersector {







    constructor(

        public tolerance:number = 1e-6

    ){}



    







    intersect(

        faceA:Face,


        faceB:Face

    ):

    FaceIntersectionResult {



        const errors:

        string[] = [];





        const surfaceA =

        faceA.surface;



        const surfaceB =

        faceB.surface;









        if(

            !surfaceA

            ||

            !surfaceB

        ){



            return {


                type:

                FaceIntersectionType.NONE,


                curves:[],


                points:[],


                errors:[

                    "Missing surface geometry"

                ]

            };

        }









        const result =

        this.intersectSurfaces(

            surfaceA,

            surfaceB

        );









        if(

            result.curves.length > 0

        ){



            return {


                type:

                FaceIntersectionType.CURVE,


                curves:

                result.curves,


                points:

                result.points,


                errors

            };

        }









        if(

            result.points.length > 0

        ){



            return {


                type:

                FaceIntersectionType.POINT,


                curves:[],


                points:

                result.points,


                errors

            };

        }









        return {


            type:

            FaceIntersectionType.NONE,


            curves:[],


            points:[],


            errors

        };

    }









    private intersectSurfaces(

        a:Surface,


        b:Surface

    ):

    {

        curves:IntersectionCurve[];


        points:Point[];

    } {



        const curves:

        IntersectionCurve[] = [];



        const points:

        Point[] = [];









        /*


            Gerçek CAD kernel:

            

            Solve:

            

            S1(u,v)=S2(s,t)



            burada:

            

            4 bilinmeyenli nonlinear

            sistem çözülür.



            Newton iteration:

            

            F(x)=0



            Jacobian:

            

            [Su Sv -Tu -Tv]



        */







        const samples =

        this.sampleSurfaceIntersection(

            a,

            b

        );









        if(

            samples.length > 1

        ){



            const curve =

            new IntersectionCurve(

                null as any,

                null as any

            );





            for(

                let i = 0;

                i < samples.length;

                i++

            ){



                curve.addSample(

                    i /

                    (

                        samples.length - 1

                    ),


                    samples[i]

                );

            }





            curves.push(

                curve

            );

        }









        return {


            curves,


            points


        };

    }









    private sampleSurfaceIntersection(

        a:Surface,


        b:Surface

    ):

    Point[] {



        const result:

        Point[] = [];





        const samples =

        32;









        for(

            let i = 0;

            i <= samples;

            i++

        ){



            const u =

            a.uMin +

            (

                a.uMax -

                a.uMin

            )

            *

            i

            /

            samples;









            for(

                let j = 0;

                j <= samples;

                j++

            ){



                const v =

                a.vMin +

                (

                    a.vMax -

                    a.vMin

                )

                *

                j

                /

                samples;





                const p =

                a.evaluate(

                    u,

                    v

                );





                const closest =

                b.closestPoint(

                    p

                );





                if(

                    p.distanceTo(

                        closest

                    )

                    <

                    this.tolerance

                ){



                    result.push(

                        p

                    );

                }

            }

        }





        return this.removeDuplicatePoints(

            result

        );

    }









    private removeDuplicatePoints(

        points:Point[]

    ):

    Point[] {



        const result:

        Point[] = [];









        for(

            const point of

            points

        ){



            const exists =

            result.some(

                p =>

                p.distanceTo(

                    point

                )

                <

                this.tolerance

            );





            if(

                !exists

            ){



                result.push(

                    point

                );

            }

        }





        return result;

    }









    intersectCurveWithFace(

        curve:Curve,


        face:Face

    ):

    Point[] {



        if(

            !face.surface

        ){

            return [];

        }





        const hits:

        Point[] = [];





        const samples =

        100;





        for(

            let i = 0;

            i <= samples;

            i++

        ){



            const t =

            i /

            samples;





            const point =

            curve.evaluate(

                t

            );





            const projected =

            face.surface

            .closestPoint(

                point

            );





            if(

                point.distanceTo(

                    projected

                )

                <

                this.tolerance

            ){



                hits.push(

                    point

                );

            }

        }





        return hits;

    }







}