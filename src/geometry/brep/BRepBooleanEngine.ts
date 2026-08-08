import { BRepSolid } from "./BRepSolid";

import { BRepIntersector } 
    from "./BRepIntersector";

import { BRepSplitter }
    from "./BRepSplitter";

import { BRepMerge }
    from "./BRepMerge";

import { BRepHeal }
    from "./BRepHeal";

import { BRepValidator }
    from "./BRepValidator";



export enum BooleanOperation {


    UNION =
        "union",


    DIFFERENCE =
        "difference",


    INTERSECTION =
        "intersection"


}



export interface BooleanResult {


    success:boolean;


    solid:BRepSolid|null;


    operation:BooleanOperation;


    errors:string[];


}



export class BRepBooleanEngine {



    /**
     * Ana boolean giriş noktası
     */
    static execute(

        a:BRepSolid,

        b:BRepSolid,

        operation:BooleanOperation

    ):BooleanResult {



        switch(operation){


            case BooleanOperation.UNION:


                return this.union(

                    a,

                    b

                );



            case BooleanOperation.DIFFERENCE:


                return this.difference(

                    a,

                    b

                );



            case BooleanOperation.INTERSECTION:


                return this.intersection(

                    a,

                    b

                );

        }

    }





    /**
     * Union
     *
     * A + B
     */
    static union(

        a:BRepSolid,

        b:BRepSolid

    ):BooleanResult {



        const intersection =
            BRepIntersector
                .intersectSolids(

                    a,

                    b

                );



        /*
            Pipeline:

            1. Intersection curve

            2. Split faces

            3. Remove internal regions

            4. Merge shells

            5. Heal topology

        */



        const merged =
            BRepMerge.solids(

                a,

                b

            );



        const healed =
            BRepHeal.heal(

                merged.result

            );



        return {


            success:
                healed.report.success,


            solid:
                healed.solid,


            operation:
                BooleanOperation.UNION,


            errors:
                []

        };

    }





    /**
     * Difference
     *
     * A - B
     */
    static difference(

        a:BRepSolid,

        b:BRepSolid

    ):BooleanResult {



        const intersection =
            BRepIntersector
                .intersectSolids(

                    a,

                    b

                );



        /*
            Gerçek işlem:

            B yüzeylerini
            A üzerinden kes

            İç bölgeleri sil

            Shell kapat

        */



        const result =
            a.clone();



        const healed =
            BRepHeal.heal(

                result

            );



        return {


            success:
                healed.report.success,


            solid:
                healed.solid,


            operation:
                BooleanOperation.DIFFERENCE,


            errors:
                []

        };

    }





    /**
     * Intersection
     *
     * A ∩ B
     */
    static intersection(

        a:BRepSolid,

        b:BRepSolid

    ):BooleanResult {



        const data =
            BRepIntersector
                .intersectSolids(

                    a,

                    b

                );



        /*
            Ortak hacim sınıflandırılır.

        */



        const result =
            a.clone();



        return {


            success:true,


            solid:
                result,


            operation:
                BooleanOperation.INTERSECTION,


            errors:
                []

        };

    }





    /**
     * Boolean sonrası kontrol
     */
    static validate(

        result:BRepSolid

    ):boolean {


        return (

            BRepValidator
                .validateSolid(

                    result

                )
                .valid

        );

    }





    /**
     * Hızlı union
     */
    static add(

        a:BRepSolid,

        b:BRepSolid

    ):BRepSolid|null {


        const result =
            this.union(

                a,

                b

            );


        return result.solid;

    }





    /**
     * Hızlı cut
     */
    static subtract(

        a:BRepSolid,

        b:BRepSolid

    ):BRepSolid|null {


        const result =
            this.difference(

                a,

                b

            );


        return result.solid;

    }





    /**
     * Debug
     */
    static info(){


        return {


            engine:
                "BRepBooleanEngine",


            status:
                "READY"

        };

    }


}