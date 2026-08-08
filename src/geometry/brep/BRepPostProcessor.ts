import {
    BRepToolPath
}
from "./BRepToolPath";





export enum CNCDialect {


    GENERIC =
        "generic",


    FANUC =
        "fanuc",


    HAAS =
        "haas",


    SIEMENS =
        "siemens",


    LINUXCNC =
        "linuxcnc"


}





export interface MachineProfile {


    name:string;


    dialect:CNCDialect;


    units:string;


    maxRPM:number;


    rapidSpeed:number;


}





export interface PostOptions {


    coolant:boolean;


    toolChange:boolean;


    compensation:boolean;


}





export interface GCodeResult {


    success:boolean;


    code:string;


    lines:number;


}





export class BRepPostProcessor {



    machine:MachineProfile;


    options:PostOptions;



    constructor(

        machine:MachineProfile

    ){


        this.machine = machine;



        this.options={


            coolant:true,


            toolChange:true,


            compensation:true


        };


    }





    /**
     * Ana post process
     */
    process(

        toolPath:BRepToolPath

    ):GCodeResult {



        const lines:string[]=[];



        lines.push(

            this.header()

        );



        lines.push(

            this.toolSetup()

        );



        lines.push(

            this.motion(

                toolPath

            )

        );



        lines.push(

            this.footer()

        );



        const code =

            lines.join(

                "\n"

            );



        return {


            success:true,


            code,


            lines:

                code.split(

                    "\n"

                ).length


        };


    }





    /**
     * CNC header
     */
    header(){



        switch(

            this.machine.dialect

        ){


            case CNCDialect.FANUC:


                return [

                    "%",

                    "G21",

                    "G17",

                    "G90"

                ].join("\n");



            case CNCDialect.SIEMENS:


                return [

                    "G71",

                    "G90"

                ].join("\n");



            default:


                return [

                    "G21",

                    "G90"

                ].join("\n");


        }


    }





    /**
     * Tool setup
     */
    toolSetup(){



        if(

            !this.options.toolChange

        )

            return "";



        return [

            "T01",

            "M06"

        ].join("\n");


    }





    /**
     * Motion command üretimi
     */
    motion(

        toolPath:BRepToolPath

    ){



        const output:string[]=[];



        for(

            const point of

            toolPath.points

        ){



            output.push(

                `G01 X${point.x} Y${point.y} Z${point.z} F${point.feed}`

            );


        }



        return output.join(

            "\n"

        );


    }





    /**
     * Spindle
     */
    spindle(

        rpm:number

    ){


        return `S${rpm} M03`;


    }





    /**
     * Coolant
     */
    coolant(

        enabled:boolean

    ){


        return enabled

            ?

            "M08"

            :

            "M09";


    }





    /**
     * Tool compensation
     */
    compensation(

        radius:number

    ){



        if(

            !this.options.compensation

        )

            return "";



        return `G41 D${radius}`;


    }





    /**
     * Feed optimization
     */
    optimizeFeed(

        feed:number

    ){



        return Math.min(

            feed,

            this.machine.rapidSpeed

        );


    }





    /**
     * CNC footer
     */
    footer(){


        return [

            "M05",

            "M09",

            "M30"

        ].join("\n");


    }





    /**
     * Debug
     */
    info(){


        return {


            engine:

                "BRepPostProcessor",


            machine:

                this.machine.name,


            dialect:

                this.machine.dialect,


            status:

                "READY"


        };


    }


}