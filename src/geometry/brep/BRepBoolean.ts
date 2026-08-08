import { BRepSolid } from "./BRepSolid";
import { BRepValidator } from "./BRepValidator";



export enum BooleanOperation {


    UNION = "union",


    DIFFERENCE = "difference",


    INTERSECTION = "intersection"


}





export class BRepBoolean {



    /**
     * Union operasyonu
     *
     * A + B
     */
    static union(

        a:BRepSolid,

        b:BRepSolid

    ):BRepSolid {



        this.validateInput(
            a,
            b
        );



        const result =
            a.clone();



        /*
            Basit topology merge

            İleri aşamada:

            - face intersection
            - split
            - rebuild

            yapılacak.
        */



        for(
            const shell of b.shells
        ){

            result.addShell(
                shell.clone()
            );

        }



        return result;

    }





    /**
     * Difference operasyonu
     *
     * A - B
     */
    static difference(

        a:BRepSolid,

        b:BRepSolid

    ):BRepSolid {



        this.validateInput(
            a,
            b
        );



        const result =
            a.clone();



        /*
            Placeholder:

            Gerçek algoritma:

            1. Face intersection

            2. Split faces

            3. Remove inside faces

            4. Rebuild topology

        */



        return result;

    }





    /**
     * Intersection operasyonu
     *
     * A ∩ B
     */
    static intersection(

        a:BRepSolid,

        b:BRepSolid

    ):BRepSolid {



        this.validateInput(
            a,
            b
        );



        const result =
            new BRepSolid();



        /*
            Placeholder:

            Gerçek işlem:

            - Surface intersection
            - Region classification
            - Shell reconstruction

        */



        return result;

    }





    /**
     * Genel boolean çağrısı
     */
    static execute(

        operation:BooleanOperation,

        a:BRepSolid,

        b:BRepSolid

    ):BRepSolid {



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
     * Input doğrulama
     */
    private static validateInput(

        a:BRepSolid,

        b:BRepSolid

    ):void {



        const va =
            BRepValidator
                .validateSolid(
                    a
                );


        const vb =
            BRepValidator
                .validateSolid(
                    b
                );



        if(
            !va.valid
        ){

            throw new Error(

                "First solid is invalid"

            );

        }



        if(
            !vb.valid
        ){

            throw new Error(

                "Second solid is invalid"

            );

        }

    }





    /**
     * Boolean sonucu doğrulama
     */
    static validateResult(

        solid:BRepSolid

    ):boolean {


        return (

            BRepValidator
                .validateSolid(
                    solid
                )
                .valid

        );

    }





    /**
     * Debug bilgisi
     */
    static info(

        operation:BooleanOperation

    ){


        return {


            operation,


            engine:
                "BRepBoolean",


            status:
                "READY"


        };

    }


}