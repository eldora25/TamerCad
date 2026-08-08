import { BRepSolid } from "./BRepSolid";
import { BRepExtrude } from "./BRepExtrude";



export enum GearType {


    SPUR =
        "spur",


    HELICAL =
        "helical",


    INTERNAL =
        "internal"


}





export interface GearOptions {


    teeth:number;


    module:number;


    pressureAngle:number;


    width:number;


    type:GearType;


    helixAngle:number;


}





export interface GearPoint {


    x:number;


    y:number;


}





export interface GearResult {


    success:boolean;


    solid:BRepSolid|null;


    pitchDiameter:number;


    warnings:string[];

}





export class BRepGear {



    /**
     * Ana gear üretimi
     */
    static create(

        options:GearOptions

    ):GearResult {



        /*
            Pipeline:


            Gear Parameters


                 ↓


            Pitch Calculation


                 ↓


            Involute Tooth


                 ↓


            Tooth Pattern


                 ↓


            Extrude


                 ↓


            Solid


        */



        const profile =

            this.generateProfile(

                options

            );



        const solid =

            this.extrudeGear(

                profile,

                options

            );



        return {


            success:true,


            solid,


            pitchDiameter:

                this.pitchDiameter(

                    options

                ),


            warnings:[]

        };


    }





    /**
     * Pitch diameter
     *
     * d = z * m
     */
    static pitchDiameter(

        options:GearOptions

    ):number {



        return (

            options.teeth *

            options.module

        );

    }





    /**
     * Involute diş profili
     */
    static generateInvolute(

        options:GearOptions

    ):GearPoint[] {



        const points:

            GearPoint[] = [];



        const baseRadius =

            this.baseCircleRadius(

                options

            );



        for(

            let i=0;

            i<20;

            i++

        ){



            const t =

                i /

                19;



            const angle =

                t *

                Math.PI /

                3;



            points.push({


                x:

                    baseRadius *

                    (

                        Math.cos(angle)

                    ),


                y:

                    baseRadius *

                    (

                        Math.sin(angle)

                    )



            });



        }



        return points;

    }





    /**
     * Base circle
     */
    static baseCircleRadius(

        options:GearOptions

    ){



        const pitch =

            this.pitchDiameter(

                options

            ) / 2;



        return (

            pitch *

            Math.cos(

                options.pressureAngle *

                Math.PI /

                180

            )

        );

    }





    /**
     * Tooth profile
     */
    static generateProfile(

        options:GearOptions

    ){



        const involute =

            this.generateInvolute(

                options

            );



        return {


            points:

                involute,


            teeth:

                options.teeth


        };

    }





    /**
     * Diş çoğaltma
     */
    static patternTeeth(

        profile:any,

        count:number

    ){



        const teeth:any[] = [];



        for(

            let i=0;

            i<count;

            i++

        ){


            teeth.push({

                index:i,


                rotation:

                    i *

                    360 /

                    count

            });


        }



        return teeth;

    }





    /**
     * Gear extrusion
     */
    static extrudeGear(

        profile:any,

        options:GearOptions

    ):BRepSolid {



        /*
            Tooth profile

                 ↓

            Face

                 ↓

            Extrude width

                 ↓

            Gear Solid
        */


        return new BRepSolid();

    }





    /**
     * Spur gear
     */
    static spur(

        teeth:number,

        module:number,

        width:number

    ):GearResult {



        return this.create({

            teeth,


            module,


            width,


            pressureAngle:

                20,


            type:

                GearType.SPUR,


            helixAngle:

                0


        });

    }





    /**
     * Helical gear
     */
    static helical(

        teeth:number,

        module:number,

        width:number,

        helixAngle:number

    ):GearResult {



        return this.create({

            teeth,


            module,


            width,


            pressureAngle:

                20,


            type:

                GearType.HELICAL,


            helixAngle


        });

    }





    /**
     * Gear pair meshing
     */
    static gearPair(

        gearA:GearOptions,

        gearB:GearOptions

    ){



        return {


            ratio:

                gearB.teeth /

                gearA.teeth,


            distance:

                (

                    gearA.teeth +

                    gearB.teeth

                )

                *

                gearA.module

                /

                2


        };

    }





    /**
     * Validation
     */
    static validate(

        options:GearOptions

    ){



        return (

            options.teeth > 5 &&

            options.module > 0 &&

            options.width > 0

        );

    }





    /**
     * Debug
     */
    static info(){


        return {


            engine:

                "BRepGear",


            status:

                "READY"

        };

    }


}