import {
    VelocityBuffer
} from "./VelocityBuffer";

import {
    MotionVectorBuffer
} from "./MotionVectorBuffer";



export interface VelocityDilateOptions {


    radius?: number;


    depthThreshold?: number;


    enabled?: boolean;

}



export enum VelocityDilateMode {


    Nearest = "Nearest",


    MaxMagnitude = "MaxMagnitude",


    DepthAware = "DepthAware"

}



export class VelocityDilate {



    public enabled = true;



    /**
     * Komşuluk arama yarıçapı
     */
    public radius = 1;



    /**
     * Depth fark toleransı
     */
    public depthThreshold = 0.01;



    public mode:

        VelocityDilateMode =

        VelocityDilateMode.DepthAware;



    private source:

        VelocityBuffer | MotionVectorBuffer | null = null;



    private depthTexture:

        any = null;



    constructor(

        options:

            VelocityDilateOptions = {}

    ) {


        if (

            options.radius !== undefined

        ) {

            this.radius =

                options.radius;

        }



        if (

            options.depthThreshold !== undefined

        ) {

            this.depthThreshold =

                options.depthThreshold;

        }



        if (

            options.enabled !== undefined

        ) {

            this.enabled =

                options.enabled;

        }

    }





    setVelocitySource(

        buffer:

            VelocityBuffer |

            MotionVectorBuffer

    ):void {


        this.source =

            buffer;

    }





    setDepthTexture(

        texture:any

    ):void {


        this.depthTexture =

            texture;

    }





    setMode(

        mode:

            VelocityDilateMode

    ):void {


        this.mode =

            mode;

    }





    execute():

    any {


        if (

            !this.enabled ||

            !this.source

        ) {


            return null;

        }



        /**
         * GPU shader işlemi:
         *
         * Komşu velocity değerleri taranır.
         *
         * En güçlü hareket vektörü seçilir.
         */


        return {


            type:

                "DilatedVelocity",


            radius:

                this.radius,


            mode:

                this.mode

        };

    }





    dilatePixel(

        center:any,

        neighbors:any[]

    ):any {


        let selected =

            center;



        let maxLength =

            0;



        for (

            const velocity of

            neighbors

        ) {


            const length =

                Math.sqrt(

                    velocity.x *

                    velocity.x +

                    velocity.y *

                    velocity.y

                );



            if (

                length >

                maxLength

            ) {


                maxLength =

                    length;


                selected =

                    velocity;

            }

        }



        return selected;

    }





    reset():

    void {


        this.source =

            null;


        this.depthTexture =

            null;

    }





    debugInfo(){


        return {


            type:

                "VelocityDilate",


            enabled:

                this.enabled,


            radius:

                this.radius,


            mode:

                this.mode

        };

    }

}