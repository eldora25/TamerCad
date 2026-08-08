import {
    PostProcess,
    PostProcessType
} from "./PostProcess";

import { ShaderProgram } from "../shader/ShaderProgram";

import { RenderContext } from "../RenderContext";



export interface FXAAOptions {


    enabled?: boolean;


    quality?: number;


    subpixelQuality?: number;


}



export class FXAA extends PostProcess {


    /**
     * FXAA kalite seviyesi
     *
     * 1 = hızlı
     * 2 = standart
     * 3 = yüksek kalite
     */
    public quality = 2;



    /**
     * Alt piksel düzeltme miktarı
     */
    public subpixelQuality = 0.75;



    constructor(

        options:

            FXAAOptions = {}

    ) {


        super({

            type:

                PostProcessType.FXAA,


            enabled:

                options.enabled

        });



        if (

            options.quality !== undefined

        ) {

            this.quality =

                options.quality;

        }



        if (

            options.subpixelQuality !== undefined

        ) {

            this.subpixelQuality =

                options.subpixelQuality;

        }

    }





    override setShader(

        shader:

            ShaderProgram

    ):void {


        super.setShader(

            shader

        );

    }





    override initialize(

        context:

            RenderContext

    ):void {


        super.initialize(

            context

        );

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

                "fxaaQuality",

                this.quality

            );



            shader.setUniform(

                "fxaaSubpixelQuality",

                this.subpixelQuality

            );



            shader.setUniform(

                "fxaaResolution",

                {

                    width:

                        1 /

                        (this.inputTexture?.width ?? 1),


                    height:

                        1 /

                        (this.inputTexture?.height ?? 1)

                }

            );

        }



        return super.process(

            context

        );

    }





    setQuality(

        value:number

    ):void {


        this.quality =

            Math.max(

                1,

                Math.min(

                    3,

                    value

                )

            );

    }





    setSubpixelQuality(

        value:number

    ):void {


        this.subpixelQuality =

            Math.max(

                0,

                Math.min(

                    1,

                    value

                )

            );

    }





    getSettings(){


        return {


            quality:

                this.quality,


            subpixelQuality:

                this.subpixelQuality,


            enabled:

                this.enabled

        };

    }





    override toJSON(){


        return {


            ...super.toJSON(),


            quality:

                this.quality,


            subpixelQuality:

                this.subpixelQuality

        };

    }

}