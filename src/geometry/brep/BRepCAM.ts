import {
    BRepSolid
}
from "./BRepSolid";


import {
    BRepToolPath
}
from "./BRepToolPath";





export enum MachineType {


    CNC_3_AXIS =
        "3_axis",


    CNC_5_AXIS =
        "5_axis",


    LATHE =
        "lathe",


    ROBOT_CELL =
        "robot_cell"


}





export enum CAMOperation {


    FACE_MILL =
        "face_mill",


    POCKET =
        "pocket",


    CONTOUR =
        "contour",


    DRILL =
        "drill",


    THREAD =
        "thread"


}





export interface MachineSetup {


    machine:MachineType;


    origin:{

        x:number;

        y:number;

        z:number;

    };


    tolerance:number;


}





export interface CAMTool {


    id:string;


    diameter:number;


    length:number;


    feed:number;


    rpm:number;


}





export interface CAMOperationResult {


    operation:CAMOperation;


    toolpath:BRepToolPath;


    estimatedTime:number;


}





export interface CAMResult {


    success:boolean;


    operations:number;


    gcode:string;


    warnings:string[];

}





export class BRepCAM {



    setup:MachineSetup;


    tools:CAMTool[];


    operations:CAMOperationResult[];


    part:BRepSolid|null;



    constructor(){



        this.setup={


            machine:

                MachineType.CNC_3_AXIS,


            origin:{

                x:0,

                y:0,

                z:0

            },


            tolerance:

                0.01


        };



        this.tools=[];


        this.operations=[];


        this.part=null;


    }





    /**
     * Manufacturing setup
     */
    configure(

        setup:MachineSetup

    ){


        this.setup=

            setup;


    }





    /**
     * Parça yükleme
     */
    loadPart(

        solid:BRepSolid

    ){


        this.part=

            solid;


    }





    /**
     * Tool ekleme
     */
    addTool(

        tool:CAMTool

    ){


        this.tools.push(

            tool

        );


    }





    /**
     * Face milling
     */
    faceMill(

        depth:number

    ){



        const path =

            new BRepToolPath(

                CAMOperation.FACE_MILL as any

            );



        this.operations.push({


            operation:

                CAMOperation.FACE_MILL,


            toolpath:

                path,


            estimatedTime:

                depth * 2


        });


    }





    /**
     * Pocket operasyonu
     */
    pocket(

        depth:number

    ){



        const path =

            new BRepToolPath(

                CAMOperation.POCKET as any

            );



        this.operations.push({


            operation:

                CAMOperation.POCKET,


            toolpath:

                path,


            estimatedTime:

                depth * 5


        });


    }





    /**
     * Drill operasyonu
     */
    drill(

        positions:any[]

    ){



        const path =

            new BRepToolPath(

                CAMOperation.DRILL as any

            );



        for(

            const p of positions

        ){



            path.drill(

                p,

                20

            );


        }



        this.operations.push({


            operation:

                CAMOperation.DRILL,


            toolpath:

                path,


            estimatedTime:

                positions.length

        });


    }





    /**
     * Contour machining
     */
    contour(){

        return {


            generated:true


        };


    }





    /**
     * Toolpath oluşturma
     */
    generateToolPaths(){



        return this.operations.map(

            op=>op.toolpath

        );


    }





    /**
     * Süre tahmini
     */
    estimateTime(){



        return this.operations.reduce(

            (sum,op)=>

                sum+

                op.estimatedTime,

            0

        );


    }





    /**
     * Post processor
     */
    postProcess(){



        let output="";



        for(

            const op of this.operations

        ){


            output +=

            op.toolpath.exportGCode()

            +

            "\n";


        }



        return output;


    }





    /**
     * CAM çalıştır
     */
    build():CAMResult {



        const gcode =

            this.postProcess();



        return {


            success:true,


            operations:

                this.operations.length,


            gcode,


            warnings:[]

        };


    }





    /**
     * Debug
     */
    info(){


        return {


            engine:

                "BRepCAM",


            operations:

                this.operations.length,


            tools:

                this.tools.length,


            status:

                "READY"


        };


    }


}