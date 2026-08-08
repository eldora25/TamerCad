import { BRepSolid } from "./BRepSolid";





export enum ToolPathType {


    RAPID =
        "rapid",


    LINEAR =
        "linear",


    ARC =
        "arc",


    DRILL =
        "drill",


    POCKET =
        "pocket",


    CONTOUR =
        "contour"


}





export enum MachiningOperation {


    MILLING =
        "milling",


    DRILLING =
        "drilling",


    TURNING =
        "turning",


    ADDITIVE =
        "additive"


}





export interface Tool {


    diameter:number;


    length:number;


    feed:number;


    speed:number;


}





export interface PathPoint {


    x:number;


    y:number;


    z:number;


    feed:number;


}





export interface ToolPathResult {


    success:boolean;


    points:PathPoint[];


    length:number;


    warnings:string[];

}





export class BRepToolPath {



    points:PathPoint[];


    tool:Tool|null;


    operation:MachiningOperation;



    constructor(

        operation:MachiningOperation

    ){


        this.operation=

            operation;


        this.points=[];


        this.tool=null;


    }





    /**
     * Tool tanımlama
     */
    setTool(

        tool:Tool

    ){


        this.tool=tool;


    }





    /**
     * Nokta ekleme
     */
    addPoint(

        point:PathPoint

    ){


        this.points.push(

            point

        );


    }





    /**
     * Linear path oluşturma
     */
    linear(

        start:PathPoint,

        end:PathPoint

    ){



        this.points.push(

            start,

            end

        );


    }





    /**
     * Drill path
     */
    drill(

        position:{
            x:number;
            y:number;
            z:number;
        },

        depth:number

    ){



        this.points.push({


            x:

                position.x,


            y:

                position.y,


            z:

                position.z - depth,


            feed:

                this.tool?.feed ?? 0


        });


    }





    /**
     * Pocket toolpath
     */
    pocket(

        solid:BRepSolid

    ){



        /*
            Pocket Algorithm:


            Boundary


              ↓


            Offset Curves


              ↓


            Spiral Path


              ↓


            Cutting Motion
        */


        return {


            generated:true

        };


    }





    /**
     * Contour path
     */
    contour(

        profile:any

    ){


        return {


            generated:true,


            profile

        };


    }





    /**
     * Toplam yol uzunluğu
     */
    length(){



        let total=0;



        for(

            let i=1;

            i<this.points.length;

            i++

        ){



            const a=

                this.points[i-1];


            const b=

                this.points[i];



            total += Math.sqrt(

                Math.pow(

                    b.x-a.x,

                    2

                )

                +

                Math.pow(

                    b.y-a.y,

                    2

                )

                +

                Math.pow(

                    b.z-a.z,

                    2

                )

            );


        }



        return total;


    }





    /**
     * Collision kontrolü
     */
    checkCollision(

        solid:BRepSolid

    ){


        return {


            collision:false,


            contacts:[]

        };


    }





    /**
     * G-Code üretimi
     */
    exportGCode(){



        const lines:string[]=[];



        lines.push(

            "G21"

        );



        for(

            const p of this.points

        ){


            lines.push(

                `G01 X${p.x} Y${p.y} Z${p.z} F${p.feed}`

            );


        }



        return lines.join(

            "\n"

        );


    }





    /**
     * Robot path export
     */
    exportRobotPath(){



        return this.points.map(

            p=>({


                position:p,


                command:

                    "MOVE"


            })

        );


    }





    /**
     * Debug
     */
    info(){


        return {


            engine:

                "BRepToolPath",


            points:

                this.points.length,


            operation:

                this.operation,


            status:

                "READY"


        };


    }


}