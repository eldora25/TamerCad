import {
    BRepAssembly
}
from "./BRepAssembly";


import {
    BRepKinematics
}
from "./BRepKinematics";


import {
    BRepMotion
}
from "./BRepMotion";





export enum RobotType {


    CARTESIAN =
        "cartesian",


    SCARA =
        "scara",


    SIX_AXIS =
        "six_axis",


    COLLABORATIVE =
        "collaborative"


}





export interface RobotJoint {


    id:string;


    min:number;


    max:number;


    current:number;


}





export interface ToolCenterPoint {


    x:number;


    y:number;


    z:number;


    rx:number;


    ry:number;


    rz:number;


}





export interface RobotPathPoint {


    x:number;


    y:number;


    z:number;


    speed:number;


}





export interface RobotResult {


    success:boolean;


    position:ToolCenterPoint;


    warnings:string[];

}





export class BRepRobot {



    name:string;


    type:RobotType;


    assembly:BRepAssembly;


    kinematics:BRepKinematics;


    motion:BRepMotion;


    joints:RobotJoint[];


    tcp:ToolCenterPoint;





    constructor(

        name:string,

        type:RobotType,

        assembly:BRepAssembly

    ){


        this.name=name;


        this.type=type;


        this.assembly=assembly;


        this.kinematics=

            new BRepKinematics(

                assembly

            );


        this.motion=

            new BRepMotion(

                assembly

            );


        this.joints=[];


        this.tcp={


            x:0,

            y:0,

            z:0,

            rx:0,

            ry:0,

            rz:0

        };


    }





    /**
     * Joint ekleme
     */
    addJoint(

        joint:RobotJoint

    ){


        this.joints.push(

            joint

        );


    }





    /**
     * TCP ayarlama
     */
    setToolCenterPoint(

        tcp:ToolCenterPoint

    ){


        this.tcp=tcp;


    }





    /**
     * Robot pozisyon çözümü
     */
    moveTo(

        target:ToolCenterPoint

    ):RobotResult {



        const pose =

            this.kinematics.inverse({

                x:

                    target.x,


                y:

                    target.y,


                z:

                    target.z


            });



        return {


            success:true,


            position:target,


            warnings:[]

        };


    }





    /**
     * Forward robot hareketi
     */
    forward(

        joints:number[]

    ){



        return this.kinematics.forward(

            joints

        );


    }





    /**
     * Path çalıştırma
     */
    executePath(

        path:RobotPathPoint[]

    ){



        for(

            const point of path

        ){


            this.moveTo({

                x:point.x,

                y:point.y,

                z:point.z,

                rx:0,

                ry:0,

                rz:0

            });


        }



        return {


            executed:true,


            points:

                path.length


        };


    }





    /**
     * Work envelope
     */
    workspace(){



        return {


            radius:

                1000,


            height:

                800


        };


    }





    /**
     * Servo hareketi
     */
    servo(

        jointId:string,

        value:number

    ){



        const joint =

            this.joints.find(

                j=>j.id===jointId

            );



        if(!joint)

            return false;



        joint.current =

            Math.max(

                joint.min,

                Math.min(

                    joint.max,

                    value

                )

            );



        return true;


    }





    /**
     * Reset robot
     */
    reset(){



        for(

            const joint of this.joints

        ){


            joint.current=0;


        }


    }





    /**
     * Debug
     */
    info(){


        return {


            engine:

                "BRepRobot",


            name:

                this.name,


            type:

                this.type,


            joints:

                this.joints.length,


            status:

                "READY"


        };

    }


}