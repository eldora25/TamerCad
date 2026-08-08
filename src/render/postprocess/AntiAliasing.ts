import {
    PostProcess,
    PostProcessType
} from "./PostProcess";

import { ShaderProgram } from "../shader/ShaderProgram";

import { RenderContext } from "../RenderContext";



export enum AntiAliasingMode {


    None = "None",


    FXAA = "FXAA",


    SMAA = "SMAA",


    TAA = "TAA"

}



export interface AntiAliasingOptions {


    enabled?: boolean;


    mode?: AntiAliasingMode;


    quality?: number;


    jitter?: boolean;


    samples?: number;

}



export class AntiAliasing extends PostProcess {


    public mode:

        AntiAliasingMode =

        AntiAliasingMode.FXAA;



    /**
     * Kalite seviyesi
     */
    public quality = 2;



    /**
     * Temporal jitter aktif mi?
     */
    public jitter = true;



    /**
     * TAA sample sayısı
     */
    public samples = 8;



    private historyTexture:

        any = null;



    private jitterIndex = 0;



    constructor(

        options:

            AntiAliasingOptions = {}

    ) {


        super({

            type:

                PostProcessType.FXAA,


            enabled:

                options.enabled

        });



        if (

            options.mode

        ) {

            this.mode =

                options.mode;

        }



        if (

            options.quality !== undefined

        ) {

            this.quality =

                options.quality;

        }



        if (

            options.jitter !== undefined

        ) {

            this.jitter =

                options.jitter;

        }



        if (

            options.samples !== undefined

        ) {

            this.samples =

                options.samples;

        }

    }





    override initialize(

        context:

            RenderContext

    ):void {


        super.initialize(

            context

        );



        this.createHistoryBuffer();

    }





    private createHistoryBuffer():

    void {


        /**
         * Temporal AA için
         * önceki frame saklama
         */

        this.historyTexture = {


            type:

                "AAHistoryTexture"

        };

    }





    override process(

        context:

            RenderContext

    ):any {


        if (

            !this.enabled ||

            this.mode ===

            AntiAliasingMode.None

        ) {


            return this.inputTexture;

        }



        const shader =

            this.getShader();



        if (

            shader

        ) {


            shader.setUniform(

                "aaMode",

                this.getModeValue()

            );



            shader.setUniform(

                "aaQuality",

                this.quality

            );



            shader.setUniform(

                "aaSamples",

                this.samples

            );



            shader.setUniform(

                "aaJitter",

                this.jitter

            );



            shader.setUniform(

                "aaHistoryTexture",

                this.historyTexture

            );

        }



        this.updateJitter();



        return super.process(

            context

        );

    }





    private updateJitter():

    void {


        if (

            !this.jitter

        ) {

            return;

        }



        /**
         * Halton sequence benzeri
         * subpixel offset
         */

        this.jitterIndex++;


        if (

            this.jitterIndex >=

            this.samples

        ) {

            this.jitterIndex =

                0;

        }

    }





    private getModeValue():

    number {


        switch(

            this.mode

        ){


            case AntiAliasingMode.FXAA:

                return 1;


            case AntiAliasingMode.SMAA:

                return 2;


            case AntiAliasingMode.TAA:

                return 3;


            default:

                return 0;

        }

    }





    setMode(

        mode:

            AntiAliasingMode

    ):void {


        this.mode =

            mode;

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





    setSamples(

        value:number

    ):void {


        this.samples =

            Math.max(

                2,

                Math.min(

                    64,

                    value

                )

            );

    }





    setJitter(

        value:boolean

    ):void {


        this.jitter =

            value;

    }





    getHistoryTexture():

    any {


        return this.historyTexture;

    }





    reset():void {


        this.mode =

            AntiAliasingMode.FXAA;


        this.quality = 2;


        this.samples = 8;


        this.jitter = true;


        this.jitterIndex = 0;

    }





    override dispose():

    void {


        super.dispose();


        this.historyTexture = null;

    }





    override toJSON(){


        return {


            ...super.toJSON(),


            mode:

                this.mode,


            quality:

                this.quality,


            jitter:

                this.jitter,


            samples:

                this.samples

        };

    }

}