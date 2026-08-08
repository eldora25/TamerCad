import { Solid }
from "../core/Solid";

import { Face }
from "../core/Face";

import { FaceSewing }
from "./FaceSewing";

import { Splitter }
from "./Splitter";

import { BooleanResultBuilder }
from "./BooleanResultBuilder";

import { TopologyValidator }
from "./TopologyValidator";

import { SolidClassifier }
from "../SolidClassifier";







export type BooleanOperation =

    "union"

    |

    "difference"

    |

    "intersection";







export interface BooleanResult {


    solid:Solid|null;


    success:boolean;


    errors:string[];

}







export class BooleanOperations {







    private sewing:

    FaceSewing;



    private splitter:

    Splitter;



    private resultBuilder:

    BooleanResultBuilder;



    private validator:

    TopologyValidator;



    private classifier:

    SolidClassifier;







    constructor(

        tolerance:number = 1e-6

    ){



        this.sewing =

        new FaceSewing(

            tolerance

        );



        this.splitter =

        new Splitter(

            tolerance

        );



        this.resultBuilder =

        new BooleanResultBuilder(

            tolerance

        );



        this.validator =

        new TopologyValidator();



        this.classifier =

        new SolidClassifier(

            tolerance

        );

    }









    union(

        a:Solid,

        b:Solid

    ):

    BooleanResult {



        return this.execute(

            a,

            b,

            "union"

        );

    }









    difference(

        a:Solid,

        b:Solid

    ):

    BooleanResult {



        return this.execute(

            a,

            b,

            "difference"

        );

    }









    intersection(

        a:Solid,

        b:Solid

    ):

    BooleanResult {



        return this.execute(

            a,

            b,

            "intersection"

        );

    }









    private execute(

        a:Solid,

        b:Solid,

        operation:BooleanOperation

    ):

    BooleanResult {



        const va =

        this.validator.validate(

            a

        );



        const vb =

        this.validator.validate(

            b

        );





        if(

            !va.valid

            ||

            !vb.valid

        ){



            return {


                solid:null,


                success:false,


                errors:[

                    "Invalid BRep input"

                ]

            };

        }









        switch(

            operation

        ){



            case "union":

                return this.buildUnion(

                    a,

                    b

                );





            case "difference":

                return this.buildDifference(

                    a,

                    b

                );





            case "intersection":

                return this.buildIntersection(

                    a,

                    b

                );

        }

    }









    private buildUnion(

        a:Solid,

        b:Solid

    ):

    BooleanResult {



        const splitA =

        this.splitter

        .splitSolid(

            a,

            b

        );



        const splitB =

        this.splitter

        .splitSolid(

            b,

            a

        );









        const faces =

        [

            ...splitA.faces,

            ...splitB.faces

        ];









        /*

            İç yüzleri kaldırma

            aşaması burada:

            RegionSelector

        */







        return this.resultBuilder

        .buildFromFaces(

            faces

        );

    }









    private buildDifference(

        base:Solid,

        tool:Solid

    ):

    BooleanResult {



        const split =

        this.splitter

        .splitSolid(

            base,

            tool

        );





        const faces:

        Face[] = [];









        for(

            const face of

            split.faces

        ){



            const center =

            this.faceCenter(

                face

            );





            const classification =

            this.classifier

            .classifyPoint(

                center,

                tool

            );





            if(

                classification.classification

                !==

                "inside"

            ){



                faces.push(

                    face

                );

            }

        }









        return this.resultBuilder

        .buildFromFaces(

            faces

        );

    }









    private buildIntersection(

        a:Solid,

        b:Solid

    ):

    BooleanResult {



        const split =

        this.splitter

        .splitSolid(

            a,

            b

        );





        const faces:

        Face[] = [];









        for(

            const face of

            split.faces

        ){



            const center =

            this.faceCenter(

                face

            );





            const result =

            this.classifier

            .classifyPoint(

                center,

                b

            );





            if(

                result.classification

                ===

                "inside"

            ){



                faces.push(

                    face

                );

            }

        }









        return this.resultBuilder

        .buildFromFaces(

            faces

        );

    }









    private faceCenter(

        face:Face

    ){



        const points =

        face.getEdges()

        .map(

            e =>

            e.start.position

        );





        let x = 0;

        let y = 0;

        let z = 0;





        for(

            const p of

            points

        ){



            x += p.x;

            y += p.y;

            z += p.z;

        }





        return points.length

        ?

        new (points[0].constructor as any)(

            x / points.length,

            y / points.length,

            z / points.length

        )

        :

        null;

    }







}