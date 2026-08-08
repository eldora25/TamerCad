import {
    PostProcess,
    PostProcessType
} from "./PostProcess";

import { ShaderProgram } from "../shader/ShaderProgram";

import { RenderContext } from "../RenderContext";



export interface SSAOOptions {


    enabled?: boolean;


    radius?: number;


    intensity?: number;


    bias?: number;


    samples?: number;

}



export class SSAO extends PostProcess {


    /**
     * Occlusion etki yarıçapı
     */
    public radius = 0.5;



    /**
     * Karanlık yoğunluğu
     */
    public intensity = 1.0;



    /**
     * Self shadow önleme bias değeri
     */
    public bias = 0.025;



    /**
     * Sample sayısı
     */
    public samples = 16;



    private noiseTexture:

        any = null;



    private kernel:

        number[][] = [];



    constructor(

        options:

            SSAOOptions = {}

    ) {


        super({

            type:

                PostProcessType.SSAO,


            enabled:

                options.enabled,


            intensity:

                options.intensity

        });



        if (

            options.radius !== undefined

        ) {

            this.radius =

                options.radius;

        }



        if (

            options.bias !== undefined

        ) {

            this.bias =

                options.bias;

        }



        if (

            options.samples !== undefined

        ) {

            this.samples =

                options.samples;

        }



        this.generateKernel();

    }





    override initialize(

        context:

            RenderContext

    ):void {


        super.initialize(

            context

        );



        this.createNoiseTexture();

    }





    private generateKernel():

    void {


        this.kernel = [];



        for(

            let i = 0;

            i < this.samples;

            i++

        ){


            const scale =

                i /

                this.samples;



            const random =

            {

                x:

                    Math.random()*2-1,


                y:

                    Math.random()*2-1,


                z:

                    Math.random()

            };



            const factor =

                0.1 +

                0.9 *

                scale *

                scale;



            this.kernel.push([


                random.x *

                factor,


                random.y *

                factor,


                random.z *

                factor

            ]);

        }

    }





    private createNoiseTexture():

    void {


        /**
         * Random rotation noise
         *
         * SSAO örnekleme yönlerini
         * çeşitlendirir.
         */

        this.noiseTexture = {


            type:

                "NoiseTexture"


        };

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

                "ssaoRadius",

                this.radius

            );



            shader.setUniform(

                "ssaoIntensity",

                this.intensity

            );



            shader.setUniform(

                "ssaoBias",

                this.bias

            );



            shader.setUniform(

                "ssaoSamples",

                this.samples

            );



            shader.setUniform(

                "ssaoKernel",

                this.kernel

            );

        }



        return super.process(

            context

        );

    }





    setRadius(

        value:number

    ):void {


        this.radius =

            Math.max(

                0,

                value

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

                4,

                Math.min(

                    64,

                    value

                )

            );



        this.generateKernel();

    }





    getKernel():

    number[][] {


        return this.kernel;

    }





    override toJSON(){


        return {


            ...super.toJSON(),


            radius:

                this.radius,


            intensity:

                this.intensity,


            bias:

                this.bias,


            samples:

                this.samples

        };

    }

}