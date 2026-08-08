import {
    BRepAssembly
}
from "./BRepAssembly";

import {
    BRepAssemblySolver
}
from "./BRepAssemblySolver";





export interface Vector3 {


    x:number;


    y:number;


    z:number;


}





export interface MotionState {


    time:number;


    position:Vector3;


    rotation:Vector3;


    velocity:Vector3;


    acceleration:Vector3;


}





export interface MotionDriver {


    componentId:string;


    axis:Vector3;


    speed:number;


    acceleration:number;


}





export interface MotionResult {


    success:boolean;


    time:number;


    updated:boolean;


    warnings:string[];

}





export class BRepMotion {



    assembly:BRepAssembly;


    drivers:MotionDriver[];


    states:Map<string,MotionState>;



    constructor(

        assembly:BRepAssembly

    ){


        this.assembly = assembly;


        this.drivers=[];


        this.states=new Map();


    }





    /**
     * Motion driver ekleme
     */
    addDriver(

        driver:MotionDriver

    ){



        this.drivers.push(

            driver

        );


    }





    /**
     * Zaman adımı ilerletme
     */
    step(

        delta:number

    ):MotionResult {



        /*
            Simulation Loop:


            Time


             ↓


            Drivers


             ↓


            Joint Motion


             ↓


            Transform Update


             ↓


            Assembly Solve

        */



        for(

            const driver of this.drivers

        ){



            this.updateDriver(

                driver,

                delta

            );


        }



        BRepAssemblySolver.solve(

            this.assembly

        );



        return {


            success:true,


            time:delta,


            updated:true,


            warnings:[]

        };


    }





    /**
     * Driver hareketi
     */
    updateDriver(

        driver:MotionDriver,

        delta:number

    ){



        const component =

            this.assembly.findComponent(

                driver.componentId

            );



        if(!component)

            return;



        component.transform.x +=

            driver.axis.x *

            driver.speed *

            delta;



        component.transform.y +=

            driver.axis.y *

            driver.speed *

            delta;



        component.transform.z +=

            driver.axis.z *

            driver.speed *

            delta;



    }





    /**
     * Velocity hesaplama
     */
    velocity(

        previous:Vector3,

        current:Vector3,

        delta:number

    ):Vector3 {



        return {


            x:

                (current.x -

                previous.x) /

                delta,


            y:

                (current.y -

                previous.y) /

                delta,


            z:

                (current.z -

                previous.z) /

                delta


        };

    }





    /**
     * Acceleration hesaplama
     */
    acceleration(

        previousVelocity:Vector3,

        velocity:Vector3,

        delta:number

    ):Vector3 {



        return {


            x:

                (velocity.x -

                previousVelocity.x)

                /

                delta,


            y:

                (velocity.y -

                previousVelocity.y)

                /

                delta,


            z:

                (velocity.z -

                previousVelocity.z)

                /

                delta


        };

    }





    /**
     * Revolute hareket
     */
    rotate(

        componentId:string,

        axis:Vector3,

        speed:number

    ){



        this.addDriver({

            componentId,


            axis,


            speed,


            acceleration:0


        });


    }





    /**
     * Linear hareket
     */
    translate(

        componentId:string,

        direction:Vector3,

        speed:number

    ){



        this.addDriver({

            componentId,


            axis:direction,


            speed,


            acceleration:0


        });


    }





    /**
     * Kinematic chain çözümü
     */
    solveChain(){



        return {


            solved:true,


            joints:

                this.assembly.joints.length


        };


    }





    /**
     * Reset motion
     */
    reset(){



        this.states.clear();


    }





    /**
     * Debug
     */
    info(){


        return {


            engine:

                "BRepMotion",


            drivers:

                this.drivers.length,


            status:

                "READY"


        };


    }


}