import {
    HistoryBuffer
} from "./HistoryBuffer";

import {
    VelocityBuffer
} from "./VelocityBuffer";



export interface TemporalAAOptions {


    enabled?: boolean;


    feedback?: number;


    jitterScale?: number;


    clampStrength?: number;

}



export class TemporalAA {



    public enabled = true;



    /**
     * Önceki frame katkı oranı
     */
    public feedback = 0.95;



    /**
     * Subpixel jitter miktarı
     */
    public jitterScale = 1.0;



    /**
     * Ghosting azaltma
     */
    public clampStrength = 0.9;



    private history:

        HistoryBuffer | null = null;



    private velocity:

        VelocityBuffer | null = null;



    private frameIndex = 0;



    private jitter:

        {

            x:number,

            y:number

        } = {


            x:0,


            y:0

        };



    constructor(

        options:

            TemporalAAOptions = {}

    ) {


        if (

            options.enabled !== undefined

        ) {

            this.enabled =

                options.enabled;

        }



        if (

            options.feedback !== undefined

        ) {

            this.feedback =

                options.feedback;

        }



        if (

            options.jitterScale !== undefined

        ) {

            this.jitterScale =

                options.jitterScale;

        }



        if (

            options.clampStrength !== undefined

        ) {

            this.clampStrength =

                options.clampStrength;

        }

    }





    setHistoryBuffer(

        buffer:

            HistoryBuffer

    ):void {


        this.history =

            buffer;

    }





    setVelocityBuffer(

        buffer:

            VelocityBuffer

    ):void {


        this.velocity =

            buffer;

    }





    private halton(

        index:number,

        base:number

    ):number {


        let result = 0;


        let fraction =

            1 / base;



        while (

            index > 0

        ) {


            result +=

                (index % base) *

                fraction;



            index =

                Math.floor(

                    index / base

                );



            fraction /= base;

        }



        return result;

    }





    updateJitter(

        width:number,

        height:number

    ):void {


        this.frameIndex++;



        const x =

            this.halton(

                this.frameIndex,

                2

            ) - 0.5;



        const y =

            this.halton(

                this.frameIndex,

                3

            ) - 0.5;



        this.jitter = {


            x:

                (x *

                this.jitterScale)

                / width,


            y:

                (y *

                this.jitterScale)

                / height

        };

    }





    getJitter():

    {

        x:number,

        y:number

    } {


        return this.jitter;

    }





    resolve(

        currentFrame:any,

        historyFrame:any,

        velocityTexture:any

    ):any {


        if (

            !this.enabled

        ) {


            return currentFrame;

        }



        /**
         * Gerçek shader tarafı:
         *
         * previousUV =
         * currentUV - velocity
         *
         * historySample =
         * texture(history, previousUV)
         *
         * blend(current, history)
         */


        return {


            type:

                "TemporalResolvedFrame",


            current:

                currentFrame,


            history:

                historyFrame,


            velocity:

                velocityTexture,


            feedback:

                this.feedback

        };

    }





    clampHistory(

        color:any

    ):any {


        /**
         * Neighborhood clamp
         *
         * ghosting azaltma
         */


        return color;

    }





    reset():

    void {


        this.frameIndex =

            0;



        this.jitter = {


            x:0,


            y:0

        };

    }





    dispose():

    void {


        this.history =

            null;



        this.velocity =

            null;

    }





    debugInfo(){


        return {


            enabled:

                this.enabled,


            feedback:

                this.feedback,


            jitter:

                this.jitter,


            frame:

                this.frameIndex

        };

    }

}