import {
    PostProcess,
    PostProcessType
} from "./PostProcess";

import { RenderContext } from "../RenderContext";

import { ShaderProgram } from "../shader/ShaderProgram";



export interface OutlineColor {


    r:number;

    g:number;

    b:number;

    a?:number;

}



export interface OutlineOptions {


    enabled?: boolean;


    color?: OutlineColor;


    thickness?: number;


    intensity?: number;

}





export class Outline extends PostProcess {


    /**
     * CAD seçim rengi
     */
    public color:

    OutlineColor = {


        r:1,

        g:0.65,

        b:0.1,

        a:1

    };



    /**
     * Kenar piksel kalınlığı
     */
    public thickness = 2;



    /**
     * Highlight kuvveti
     */
    public intensity = 1;



    /**
     * Object ID / selection mask
     */
    private maskTexture:

        any = null;



    /**
     * Depth edge detection
     */
    private depthTexture:

        any = null;





    constructor(

        options:

            OutlineOptions = {}

    ){

        super({

            type:

                PostProcessType.None,


            enabled:

                options.enabled

        });



        if(

            options.color

        ){

            this.color = {


                ...this.color,


                ...options.color

            };

        }



        if(

            options.thickness !== undefined

        ){

            this.setThickness(

                options.thickness

            );

        }



        if(

            options.intensity !== undefined

        ){

            this.setIntensity(

                options.intensity

            );

        }

    }





    setMaskTexture(

        texture:any

    ):void {


        this.maskTexture =

            texture;

    }





    setDepthTexture(

        texture:any

    ):void {


        this.depthTexture =

            texture;

    }





    override process(

        context:

            RenderContext

    ):any {



        if(

            !this.enabled

        ){

            return this.inputTexture;

        }



        const shader:

        ShaderProgram | null =

            this.getShader();



        if(

            shader

        ){


            shader.setUniform(

                "outlineColor",

                this.color

            );



            shader.setUniform(

                "outlineThickness",

                this.thickness

            );



            shader.setUniform(

                "outlineIntensity",

                this.intensity

            );



            shader.setUniform(

                "outlineMaskTexture",

                this.maskTexture

            );



            shader.setUniform(

                "outlineDepthTexture",

                this.depthTexture

            );

        }



        return super.process(

            context

        );

    }





    setColor(

        color:

            OutlineColor

    ):void {


        this.color = {


            ...this.color,


            ...color

        };

    }





    setThickness(

        value:number

    ):void {


        this.thickness =

            Math.max(

                1,

                Math.min(

                    10,

                    value

                )

            );

    }





    setIntensity(

        value:number

    ):void {


        this.intensity =

            Math.max(

                0,

                Math.min(

                    5,

                    value

                )

            );

    }





    reset():void {


        this.color = {


            r:1,

            g:0.65,

            b:0.1,

            a:1

        };


        this.thickness = 2;


        this.intensity = 1;

    }





    getSettings(){


        return {


            color:

                this.color,


            thickness:

                this.thickness,


            intensity:

                this.intensity,


            enabled:

                this.enabled

        };

    }





    override toJSON(){


        return {


            ...super.toJSON(),


            color:

                this.color,


            thickness:

                this.thickness,


            intensity:

                this.intensity

        };

    }

}