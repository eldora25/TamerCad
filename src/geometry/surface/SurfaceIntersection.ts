import { Surface }
from "./Surface";


import { Point }
from "../core/Point";


import { Vector3 }
from "../core/Vector3";


import { Curve }
from "../curve/Curve";


import { LineCurve }
from "../curve/LineCurve";





export class SurfaceIntersection {



    constructor(

        public surfaceA:Surface,


        public surfaceB:Surface,


        public tolerance:number = 1e-6

    ){}





    intersect():

    Curve[] {



        const curves:

        Curve[] = [];





        const points =

        this.sampleSearch();





        for(

            const point of points

        ){



            const curve =

            this.traceCurve(

                point

            );



            if(

                curve

            ){

                curves.push(

                    curve

                );

            }

        }





        return curves;

    }









    private sampleSearch():

    Point[] {



        const result:

        Point[] = [];





        const steps =

        40;





        for(

            let i = 0;

            i <= steps;

            i++

        ){



            for(

                let j = 0;

                j <= steps;

                j++

            ){



                const u =

                i /

                steps;



                const v =

                j /

                steps;





                const pointA =

                this.surfaceA.evaluate(

                    u,

                    v

                );



                const pointB =

                this.surfaceB.evaluate(

                    u,

                    v

                );





                if(

                    pointA.distanceTo(

                        pointB

                    )

                    <

                    this.tolerance

                ){



                    result.push(

                        pointA

                    );

                }

            }

        }





        return result;

    }









    private traceCurve(

        start:Point

    ):

    Curve|null {



        const tangent =

        this.computeTangent(

            start

        );





        if(

            tangent.length()

            <

            this.tolerance

        ){

            return null;

        }





        const length =

        1;





        const end =

        start.addVector(

            tangent.multiply(

                length

            )

        );





        return new LineCurve(

            start,

            end

        );

    }









    private computeTangent(

        point:Point

    ):

    Vector3 {



        const normalA =

        this.surfaceA

        .normalAtPoint(

            point

        );





        const normalB =

        this.surfaceB

        .normalAtPoint(

            point

        );





        const tangent =

        normalA.cross(

            normalB

        );





        return tangent.normalize();

    }



