import {
    PostProcess,
    PostProcessType
} from "./PostProcess";

import { ShaderProgram } from "../shader/ShaderProgram";

import { RenderContext } from "../RenderContext";



export interface DepthOfFieldOptions {


    enabled?: boolean;


    focusDistance?: number;


    focusRange?: number;


    aperture?: number;


    maxBlur?: number;

}



export class DepthOfField extends PostProcess {


    /**
     * Kamera odak mesafesi
     */
    public focusDistance = 10;



    /**
     * Net alan genişliği
     */
    public focusRange = 5;



    /**
     * Lens açıklığı
     *
     * Büyük değer:
     * daha fazla bulanıklık
     */
    public aperture = 0.025;



    /**
     * Maksimum blur miktarı
     */
    public maxBlur = 1.0;



    private depthTexture:

        any = null;



    constructor(

        options:

            DepthOfFieldOptions = {}

    ) {


        super({

            type:

                PostProcessType.None,


            enabled:

                options.enabled

        });



        if (

            options.focusDistance !== undefined

        ) {

            this.focusDistance =

                options.focusDistance;

        }



        if (

            options.focusRange !== undefined

        ) {

            this.focusRange =

                options.focusRange;

        }



        if (

            options.aperture !== undefined

        ) {

            this.aperture =

                options.aperture;

        }



        if (

            options.maxBlur !== undefined

        ) {

            this.maxBlur =

                options.maxBlur;

        }

    }





    setDepthTexture(

        texture:any

    ):void {


        this.depthTexture =

            texture;

    }





    getDepthTexture():

    any {


        return this.depthTexture;

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

                "dofFocusDistance",

                this.focusDistance

            );



            shader.setUniform(

                "dofFocusRange",

                this.focusRange

            );



            shader.setUniform(

                "dofAperture",

                this.aperture

            );



            shader.setUniform(

                "dofMaxBlur",

                this.maxBlur

            );



            shader.setUniform(

                "dofDepthTexture",

                this.depthTexture

            );

        }



        return super.process(

            context

        );

    }





    setFocusDistance(

        value:number

    ):void {


        this.focusDistance =

            Math.max(

                0,

                value

            );

    }





    setFocusRange(

        value:number

    ):void {


        this.focusRange =

            Math.max(

                0,

                value

            );

    }





    setAperture(

        value:number

    ):void {


        this.aperture =

            Math.max(

                0,

                value

            );

    }





    setMaxBlur(

        value:number

    ):void {


        this.maxBlur =

            Math.max(

                0,

                value

            );

    }





    override toJSON(){


        return {


            ...super.toJSON(),


            focusDistance:

                this.focusDistance,


            focusRange:

                this.focusRange,


            aperture:

                this.aperture,


            maxBlur:

                this.maxBlur

        };

    }

}