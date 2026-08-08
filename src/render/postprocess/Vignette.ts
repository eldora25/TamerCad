import {
    PostProcess,
    PostProcessType
} from "./PostProcess";

import { ShaderProgram } from "../shader/ShaderProgram";

import { RenderContext } from "../RenderContext";



export interface VignetteOptions {


    enabled?: boolean;


    intensity?: number;


    smoothness?: number;


    roundness?: number;

}



export class Vignette extends PostProcess {


    /**
     * Kenar kararma yoğunluğu
     */
    public intensity = 0.5;



    /**
     * Geçiş yumuşaklığı
     */
    public smoothness = 0.5;



    /**
     * Vinyet şekli
     *
     * 0 = oval
     * 1 = dairesel
     */
    public roundness = 0.5;



    constructor(

        options:

            VignetteOptions = {}

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

            options.smoothness !== undefined

        ) {

            this.smoothness =

                options.smoothness;

        }



        if (

            options.roundness !== undefined

        ) {

            this.roundness =

                options.roundness;

        }

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

                "vignetteIntensity",

                this.intensity

            );



            shader.setUniform(

                "vignetteSmoothness",

                this.smoothness

            );



            shader.setUniform(

                "vignetteRoundness",

                this.roundness

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

                Math.min(

                    1,

                    value

                )

            );

    }





    setSmoothness(

        value:number

    ):void {


        this.smoothness =

            Math.max(

                0,

                Math.min(

                    1,

                    value

                )

            );

    }





    setRoundness(

        value:number

    ):void {


        this.roundness =

            Math.max(

                0,

                Math.min(

                    1,

                    value

                )

            );

    }





    reset():void {


        this.intensity =

            0.5;


        this.smoothness =

            0.5;


        this.roundness =

            0.5;

    }





    getSettings(){


        return {


            intensity:

                this.intensity,


            smoothness:

                this.smoothness,


            roundness:

                this.roundness,


            enabled:

                this.enabled

        };

    }





    override toJSON(){


        return {


            ...super.toJSON(),


            intensity:

                this.intensity,


            smoothness:

                this.smoothness,


            roundness:

                this.roundness

        };

    }

}