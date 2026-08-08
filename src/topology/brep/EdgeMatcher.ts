import { Edge }
from "../core/Edge";

import { Vertex }
from "../core/Vertex";

import { Point }
from "../../geometry/core/Point";







export enum EdgeMatchType {


    None = "None",


    SameDirection = "SameDirection",


    OppositeDirection = "OppositeDirection"


}







export interface EdgeMatchResult {


    matched:boolean;


    type:EdgeMatchType;


    distance:number;


}







export class EdgeMatcher {







    constructor(

        public tolerance:number = 1e-6

    ){}



    







    match(

        edgeA:Edge,

        edgeB:Edge

    ):

    EdgeMatchResult {



        const distance =

        this.edgeDistance(

            edgeA,

            edgeB

        );





        if(

            distance >

            this.tolerance

        ){



            return {


                matched:false,


                type:

                EdgeMatchType.None,


                distance


            };

        }









        if(

            this.sameGeometry(

                edgeA,

                edgeB

            )

        ){



            return {


                matched:true,


                type:

                EdgeMatchType.SameDirection,


                distance


            };

        }









        if(

            this.oppositeGeometry(

                edgeA,

                edgeB

            )

        ){



            return {


                matched:true,


                type:

                EdgeMatchType.OppositeDirection,


                distance


            };

        }









        return {


            matched:false,


            type:

            EdgeMatchType.None,


            distance


        };

    }









    equals(

        a:Edge,

        b:Edge

    ):

    boolean {



        return this.match(

            a,

            b

        )

        .matched;

    }









    sameDirection(

        a:Edge,

        b:Edge

    ):

    boolean {



        return (

            this.match(

                a,

                b

            )

            .type

            ===

            EdgeMatchType.SameDirection

        );

    }









    oppositeDirection(

        a:Edge,

        b:Edge

    ):

    boolean {



        return (

            this.match(

                a,

                b

            )

            .type

            ===

            EdgeMatchType.OppositeDirection

        );

    }









    private sameGeometry(

        a:Edge,

        b:Edge

    ):

    boolean {



        return (

            this.sameVertex(

                a.start,

                b.start

            )

            &&

            this.sameVertex(

                a.end,

                b.end

            )

            &&

            this.sameCurve(

                a,

                b

            )

        );

    }









    private oppositeGeometry(

        a:Edge,

        b:Edge

    ):

    boolean {



        return (

            this.sameVertex(

                a.start,

                b.end

            )

            &&

            this.sameVertex(

                a.end,

                b.start

            )

            &&

            this.sameCurve(

                a,

                b

            )

        );

    }









    private sameVertex(

        a:Vertex,

        b:Vertex

    ):

    boolean {



        if(

            a === b

        ){

            return true;

        }





        return (

            a.position.distanceTo(

                b.position

            )

            <=

            this.tolerance

        );

    }









    private sameCurve(

        a:Edge,

        b:Edge

    ):

    boolean {



        const ca =

        a.getCurve();



        const cb =

        b.getCurve();





        if(

            !ca && !cb

        ){

            return true;

        }





        if(

            !ca || !cb

        ){

            return false;

        }





        if(

            ca === cb

        ){

            return true;

        }





        /*

            Curve karşılaştırma

            ileride:

            - LineCurve

            - CircleCurve

            - ArcCurve

            - NurbsCurve

            karşılaştırmaları eklenebilir.

        */





        return false;

    }









    private edgeDistance(

        a:Edge,

        b:Edge

    ):

    number {



        const direct =

        a.start.position.distanceTo(

            b.start.position

        )

        +

        a.end.position.distanceTo(

            b.end.position

        );





        const reverse =

        a.start.position.distanceTo(

            b.end.position

        )

        +

        a.end.position.distanceTo(

            b.start.position

        );





        return Math.min(

            direct,

            reverse

        );

    }









    findMatches(

        edge:Edge,

        edges:Edge[]

    ):

    Edge[] {



        return edges.filter(

            e =>

            this.equals(

                edge,

                e

            )

        );

    }









    findOpposite(

        edge:Edge,

        candidates:Edge[]

    ):

    Edge|null {



        for(

            const candidate of

            candidates

        ){



            if(

                this.oppositeDirection(

                    edge,

                    candidate

                )

            ){

                return candidate;

            }

        }





        return null;

    }









    findSameDirection(

        edge:Edge,

        candidates:Edge[]

    ):

    Edge|null {



        for(

            const candidate of

            candidates

        ){



            if(

                this.sameDirection(

                    edge,

                    candidate

                )

            ){

                return candidate;

            }

        }





        return null;

    }







}