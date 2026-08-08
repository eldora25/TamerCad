import {
    PostProcess,
    PostProcessType
} from "./PostProcess";

import { ShaderProgram } from "../shader/ShaderProgram";

import { RenderContext } from "../RenderContext";



export interface MotionBlurOptions {


    enabled?: boolean;


    intensity?: number;


    samples?: number;


    velocityScale?: number;

}



export class MotionBlur extends PostProcess {


    /**
     * Bulanıklık yoğunluğu
     */
    public intensity = 0.5;



    /**
     * Motion sample sayısı
     *
     * Kalite arttıkça maliyet artar
     */
    public samples = 8;



    /**
     * Velocity etkisi
     */
    public velocityScale = 1.0;



    private velocityTexture:

        any = null;



    private previousViewProjection:

        any = null;



    constructor(

        options:

            MotionBlurOptions = {}

    ) {


        super({

            type:

                PostProcessType.None,


            enabled:

                options.enabled

        });



        if (

            options.intensity !== undefined

        ) {

            this.intensity =

                options.intensity;

        }



        if (

            options.samples !== undefined

        ) {

            this.samples =

                options.samples;

        }



        if (

            options.velocityScale !== undefined

        ) {

            this.velocityScale =

                options.velocityScale;

        }

    }





    override initialize(

        context:

            RenderContext

    ):void {


        super.initialize(

            context

        );


        this.createVelocityBuffer();

    }





    private createVelocityBuffer():

    void {


        /**
         * Hareket vektörleri buffer
         *
         * Velocity pass sonucu
         */

        this.velocityTexture = {


            type:

                "VelocityTexture"

        };

    }





    setVelocityTexture(

        texture:any

    ):void {


        this.velocityTexture =

            texture;

    }





    getVelocityTexture():

    any {


        return this.velocityTexture;

    }





    setPreviousMatrix(

        matrix:any

    ):void {


        this.previousViewProjection =

            matrix;

    }





    override process(

        context:

            RenderContext

    ):any {


        if (

            !this.enabled

        ) {

            return this.inputTexture;

        }



        const shader =

            this.getShader();



        if (

            shader

        ) {


            shader.setUniform(

                "motionBlurIntensity",

                this.intensity

            );



            shader.setUniform(

                "motionBlurSamples",

                this.samples

            );



            shader.setUniform(

                "motionBlurVelocityScale",

                this.velocityScale

            );



            shader.setUniform(

                "velocityTexture",

                this.velocityTexture

            );



            shader.setUniform(

                "previousViewProjection",

                this.previousViewProjection

            );

        }



        return super.process(

            context

        );

    }





    setIntensity(

        value:number

    ):void {


        this.intensity =

            Math.max(

                0,

                value

            );

    }





    setSamples(

        value:number

    ):void {


        this.samples =

            Math.max(

                2,

                Math.min(

                    32,

                    value

                )

            );

    }





    setVelocityScale(

        value:number

    ):void {


        this.velocityScale =

            Math.max(

                0,

                value

            );

    }





    reset():void {


        this.intensity =

            0.5;


        this.samples =

            8;


        this.velocityScale =

            1.0;

    }





    getSettings(){


        return {


            intensity:

                this.intensity,


            samples:

                this.samples,


            velocityScale:

                this.velocityScale,


            enabled:

                this.enabled

        };

    }





    override toJSON(){


        return {


            ...super.toJSON(),


            intensity:

                this.intensity,


            samples:

                this.samples,


            velocityScale:

                this.velocityScale

        };

    }

}