import { RenderContext } from "../RenderContext";

import { ShaderProgram } from "../shader/ShaderProgram";



export enum PostProcessType {


    None = "None",


    FXAA = "FXAA",


    SMAA = "SMAA",


    SSAO = "SSAO",


    Bloom = "Bloom",


    ToneMapping = "ToneMapping"


}



export interface PostProcessOptions {


    enabled?: boolean;


    type?: PostProcessType;


    intensity?: number;

}



export class PostProcess {


    public enabled = true;


    public intensity = 1.0;



    protected shader:

        ShaderProgram | null = null;



    protected inputTexture:

        any = null;



    protected outputTexture:

        any = null;



    public readonly type:

        PostProcessType;



    private initialized = false;



    constructor(

        options:

            PostProcessOptions = {}

    ) {


        this.type =

            options.type ??

            PostProcessType.None;



        if (

            options.enabled !== undefined

        ) {

            this.enabled =

                options.enabled;

        }



        if (

            options.intensity !== undefined

        ) {

            this.intensity =

                options.intensity;

        }

    }





    initialize(

        context:

            RenderContext

    ):void {


        if (

            this.initialized

        ) {

            return;

        }



        /**
         * Framebuffer texture
         *
         * GPU post processing için
         * render sonucu alınır.
         */


        if (

            context.nativeContext

        ) {


            this.inputTexture = {


                type:

                    "ColorTexture"

            };



            this.outputTexture = {


                type:

                    "PostProcessTexture"

            };

        }



        this.initialized = true;

    }





    setShader(

        shader:

            ShaderProgram

    ):void {


        this.shader =

            shader;

    }





    getShader():

    ShaderProgram | null {


        return this.shader;

    }





    setInputTexture(

        texture:any

    ):void {


        this.inputTexture =

            texture;

    }





    getInputTexture():

    any {


        return this.inputTexture;

    }





    getOutputTexture():

    any {


        return this.outputTexture;

    }





    process(

        context:

            RenderContext

    ):any {


        if (

            !this.enabled

        ) {

            return this.inputTexture;

        }



        if (

            !this.initialized

        ) {


            this.initialize(

                context

            );

        }



        /**
         * Full screen quad render
         *
         * Shader uygulanır.
         */


        if (

            this.shader

        ) {


            this.shader.setUniform(

                "postProcessIntensity",

                this.intensity

            );

        }



        return this.outputTexture;

    }





    setEnabled(

        value:boolean

    ):void {


        this.enabled =

            value;

    }





    isEnabled():

    boolean {


        return this.enabled;

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





    dispose():void {


        /**
         * GPU kaynak temizleme
         */


        this.inputTexture = null;


        this.outputTexture = null;


        this.shader = null;


        this.initialized = false;

    }





    toJSON(){


        return {


            enabled:

                this.enabled,


            intensity:

                this.intensity,


            type:

                this.type

        };

    }





    static fromJSON(

        data:any

    ):

    PostProcess {


        return new PostProcess(

            {

                enabled:

                    data.enabled,


                intensity:

                    data.intensity,


                type:

                    data.type

            }

        );

    }

}