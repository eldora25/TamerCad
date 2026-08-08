import { Solid }
from "../core/Solid";


import { Face }
from "../core/Face";


import { Point }
from "../../geometry/core/Point";


import { Vector3 }
from "../../geometry/core/Vector3";


import { BoundingBox }
from "../../geometry/core/BoundingBox";


import { FaceClassifier }
from "./FaceClassifier";







export enum SolidClassification {


    INSIDE = "inside",


    OUTSIDE = "outside",


    ON_BOUNDARY = "on_boundary",


    INTERSECTING = "intersecting"


}







export interface SolidClassificationResult {


    classification:SolidClassification;


    point?:Point;


    details?:string[];


}







export class SolidClassifier {







    private faceClassifier:

    FaceClassifier;







    constructor(

        public tolerance:number = 1e-6

    ){



        this.faceClassifier =

        new FaceClassifier(

            tolerance

        );

    }









    classifyPoint(

        point:Point,

        solid:Solid

    ):

    SolidClassificationResult {



        if(

            this.isPointOnBoundary(

                point,

                solid

            )

        ){



            return {


                classification:

                SolidClassification.ON_BOUNDARY,


                point

            };

        }









        const inside =

        this.isPointInside(

            point,

            solid

        );









        return {


            classification:

            inside

            ?

            SolidClassification.INSIDE

            :

            SolidClassification.OUTSIDE,


            point

        };

    }









    classifySolid(

        source:Solid,

        target:Solid

    ):

    SolidClassificationResult {



        const details:

        string[] = [];









        if(

            !this.boundingBoxesOverlap(

                source,

                target

            )

        ){



            return {


                classification:

                SolidClassification.OUTSIDE,


                details:[

                    "Bounding boxes do not overlap"

                ]

            };

        }









        let insideCount =

        0;



        let outsideCount =

        0;



        let boundaryCount =

        0;









        for(

            const vertex of

            source.getVertices()

        ){



            const result =

            this.classifyPoint(

                vertex.position,

                target

            );





            switch(

                result.classification

            ){



                case SolidClassification.INSIDE:


                    insideCount++;


                    break;





                case SolidClassification.OUTSIDE:


                    outsideCount++;


                    break;





                case SolidClassification.ON_BOUNDARY:


                    boundaryCount++;


                    break;

            }

        }









        if(

            boundaryCount > 0

        ){



            details.push(

                "Shared boundary detected"

            );

        }









        if(

            insideCount > 0

            &&

            outsideCount > 0

        ){



            return {


                classification:

                SolidClassification.INTERSECTING,


                details

            };

        }









        if(

            insideCount ===

            source.getVertices()

            .length

        ){



            return {


                classification:

                SolidClassification.INSIDE,


                details

            };

        }









        if(

            boundaryCount ===

            source.getVertices()

            .length

        ){



            return {


                classification:

                SolidClassification.ON_BOUNDARY,


                details

            };

        }









        return {


            classification:

            SolidClassification.OUTSIDE,


            details

        };

    }









    contains(

        container:Solid,

        object:Solid

    ):

    boolean {



        const result =

        this.classifySolid(

            object,

            container

        );





        return (

            result.classification ===

            SolidClassification.INSIDE

            ||

            result.classification ===

            SolidClassification.ON_BOUNDARY

        );

    }









    intersects(

        a:Solid,

        b:Solid

    ):

    boolean {



        const result =

        this.classifySolid(

            a,

            b

        );





        return (

            result.classification ===

            SolidClassification.INTERSECTING

            ||

            result.classification ===

            SolidClassification.ON_BOUNDARY

        );

    }









    private isPointInside(

        point:Point,

        solid:Solid

    ):

    boolean {



        let intersections =

        0;









        for(

            const face of

            solid.getFaces()

        ){



            if(

                this.rayIntersectsFace(

                    point,

                    face

                )

            ){



                intersections++;

            }

        }









        return (

            intersections %

            2

        )

        ===

        1;

    }









    private isPointOnBoundary(

        point:Point,

        solid:Solid

    ):

    boolean {



        for(

            const face of

            solid.getFaces()

        ){



            const result =

            this.faceClassifier

            .classifyPoint(

                point,

                face

            );





            if(

                result.classification ===

                "on_boundary"

            ){



                return true;

            }

        }





        return false;

    }









    private rayIntersectsFace(

        point:Point,

        face:Face

    ):

    boolean {



        if(

            !face.surface

        ){

            return false;

        }









        const normal =

        face.normalAt(

            0,

            0

        );





        if(

            !normal

        ){

            return false;

        }









        const direction =

        new Vector3(

            1,

            0,

            0

        );









        const edges =

        face.getEdges();





        if(

            edges.length === 0

        ){

            return false;

        }









        const planePoint =

        edges[0]

        .start

        .position;









        const denominator =

        normal.dot(

            direction

        );









        if(

            Math.abs(

                denominator

            )

            <

            this.tolerance

        ){

            return false;

        }









        const t =

        normal.dot(

            planePoint.subtract(

                point

            )

        )

        /

        denominator;









        if(

            t < 0

        ){

            return false;

        }









        const hitPoint =

        new Point(

            point.x + t,

            point.y,

            point.z

        );









        return this.pointInsideFaceBoundary(

            hitPoint,

            face

        );

    }









    private pointInsideFaceBoundary(

        point:Point,

        face:Face

    ):

    boolean {



        const edges =

        face.getEdges();





        let crossings =

        0;









        for(

            const edge of

            edges

        ){



            const a =

            edge.start.position;



            const b =

            edge.end.position;









            if(

                (

                    a.y > point.y

                )

                !==

                (

                    b.y > point.y

                )

            ){



                const x =

                (

                    b.x-a.x

                )

                *

                (

                    point.y-a.y

                )

                /

                (

                    b.y-a.y

                )

                +

                a.x;





                if(

                    point.x < x

                ){

                    crossings++;

                }

            }

        }









        return (

            crossings %

            2

        )

        ===

        1;

    }









    private boundingBoxesOverlap(

        a:Solid,

        b:Solid

    ):

    boolean {



        const boxA =

        this.getBoundingBox(

            a

        );



        const boxB =

        this.getBoundingBox(

            b

        );









        if(

            !boxA

            ||

            !boxB

        ){

            return true;

        }









        return boxA.intersects(

            boxB

        );

    }









    private getBoundingBox(

        solid:Solid

    ):

   