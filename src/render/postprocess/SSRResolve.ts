import {
    SSRBuffer
} from "./SSRBuffer";


import {
    SSRHistoryBuffer
} from "./SSRHistoryBuffer";


import {
    ReactiveMask
} from "./ReactiveMask";


import {
    ShaderProgram
} from "../shader/ShaderProgram";



export interface SSRResolveOptions {


    historyWeight?: number;


    confidenceThreshold?: number;


    roughnessFade?: number;


    enabled?: boolean;


    adaptive?: boolean;

}



export enum SSRResolveMode {


    CurrentOnly = "CurrentOnly",


    Temporal = "Temporal",


    Adaptive = "Adaptive"

}



export interface SSRResolveInput {


    color:any;


    confidence:number;


    roughness:number;


    reactive:number;


}



export interface SSRResolveResult {


    color:any;


    historyUsed:boolean;


    weight:number;


    confidence:number;

}





export class SSRResolve {



    public enabled = true;



    public historyWeight = 0.9;



    public confidenceThreshold = 0.2;



    public roughnessFade = 1.0;



    public adaptive = true;



    public mode:

        SSRResolveMode =

            SSRResolveMode.Adaptive;



    private ssrBuffer:

        SSRBuffer | null = null;



    private historyBuffer:

        SSRHistoryBuffer | null = null;



    private reactiveMask:

        ReactiveMask | null = null;



    private shader:

        ShaderProgram | null = null;



    private frameIndex = 0;



    constructor(

        options:

            SSRResolveOptions = {}

    ){



        this.historyWeight =

            options.historyWeight ??

            this.historyWeight;



        this.confidenceThreshold =

            options.confidenceThreshold ??

            this.confidenceThreshold;



        this.roughnessFade =

            options.roughnessFade ??

            this.roughnessFade;



        this.enabled =

            options.enabled ??

            this.enabled;



        this.adaptive =

            options.adaptive ??

            this.adaptive;


    }



    setSSRBuffer(

        buffer:

            SSRBuffer

    ):void{


        this.ssrBuffer = buffer;


    }



    setHistoryBuffer(

        buffer:

            SSRHistoryBuffer

    ):void{


        this.historyBuffer = buffer;


    }



    setReactiveMask(

        mask:

            ReactiveMask

    ):void{


        this.reactiveMask = mask;


    }



    setShader(

        shader:

            ShaderProgram

    ):void{


        this.shader = shader;


    }



    setMode(

        mode:

            SSRResolveMode

    ):void{


        this.mode = mode;


    }

/*
========================================
Confidence Evaluation
========================================
*/

    evaluateConfidence(

        confidence:number

    ):number {


        if (

            confidence <

            this.confidenceThreshold

        ){

            return 0.0;

        }



        const normalized =

            (

                confidence -

                this.confidenceThreshold

            )

            /

            (

                1.0 -

                this.confidenceThreshold

            );



        return Math.max(

            0.0,

            Math.min(

                1.0,

                normalized

            )

        );

    }





/*
========================================
Roughness Attenuation
========================================
*/

    calculateRoughnessFade(

        roughness:number

    ):number {



        const fade =

            1.0 -

            (

                roughness *

                this.roughnessFade

            );



        return Math.max(

            0.0,

            Math.min(

                1.0,

                fade

            )

        );

    }





/*
========================================
History Weight
========================================
*/

    calculateHistoryWeight(

        confidence:number,

        roughness:number

    ):number {



        const confidenceFactor =

            this.evaluateConfidence(

                confidence

            );



        const roughnessFactor =

            this.calculateRoughnessFade(

                roughness

            );



        return (

            this.historyWeight *

            confidenceFactor *

            roughnessFactor

        );

    }





/*
========================================
Adaptive Weight
========================================
*/

    calculateAdaptiveWeight(

        input:

            SSRResolveInput

    ):number {



        if (

            !this.adaptive

        ){

            return this.historyWeight;

        }



        let weight =

            this.calculateHistoryWeight(

                input.confidence,

                input.roughness

            );



        /*
        Düşük confidence

        -> eski frame güvenilmez

        */


        if (

            input.confidence <

            this.confidenceThreshold

        ){

            weight = 0.0;

        }



        /*
        Reactive mask

        hareketli alan

        -> history azalt

        */


        if (

            input.reactive > 0.5

        ){

            weight *= 0.1;

        }



        return Math.max(

            0.0,

            Math.min(

                0.99,

                weight

            )

        );

    }





/*
========================================
Current / History Blend
========================================
*/

    blend(

        current:any,

        history:any,

        weight:number

    ):SSRResolveResult {



        if (

            weight <= 0

        ){

            return {


                color:

                    current,


                historyUsed:false,


                weight:0,


                confidence:1


            };

        }



        return {


            color:{

                current,

                history,

                mix:

                    weight

            },


            historyUsed:true,


            weight,


            confidence:weight


        };

    }

/*
========================================
Reactive Rejection
========================================
*/

    shouldRejectHistory(

        reactive:number

    ):boolean {


        return reactive > 0.5;

    }





/*
========================================
Current Only Resolve
========================================
*/

    resolveCurrentOnly(

        current:any

    ):SSRResolveResult {



        return {


            color:

                current,


            historyUsed:false,


            weight:0,


            confidence:1.0


        };

    }





/*
========================================
Temporal Resolve
========================================
*/

    resolveTemporal(

        input:

            SSRResolveInput,

        history:any

    ):SSRResolveResult {



        const weight =

            this.calculateHistoryWeight(

                input.confidence,

                input.roughness

            );



        return this.blend(

            input.color,

            history,

            weight

        );

    }





/*
========================================
Adaptive Resolve
========================================
*/

    resolveAdaptive(

        input:

            SSRResolveInput,

        history:any

    ):SSRResolveResult {



        const weight =

            this.calculateAdaptiveWeight(

                input

            );



        return this.blend(

            input.color,

            history,

            weight

        );

    }





/*
========================================
Main Resolve
========================================
*/

    resolve(

        input:

            SSRResolveInput,

        history:any = null

    ):SSRResolveResult {



        if (

            !this.enabled

        ){


            return {


                color:

                    input.color,


                historyUsed:false,


                weight:0,


                confidence:0


            };

        }



        switch(

            this.mode

        ){



            case SSRResolveMode.CurrentOnly:


                return this.resolveCurrentOnly(

                    input.color

                );





            case SSRResolveMode.Temporal:


                return this.resolveTemporal(

                    input,

                    history

                );





            case SSRResolveMode.Adaptive:


            default:


                if (

                    this.shouldRejectHistory(

                        input.reactive

                    )

                ){

                    return this.resolveCurrentOnly(

                        input.color

                    );

                }



                return this.resolveAdaptive(

                    input,

                    history

                );

        }

    }





/*
========================================
History Update
========================================
*/

    updateHistory():void {



        if (

            !this.historyBuffer

        ){

            return;

        }



        /*
            Gerçek uygulamada:

            current SSR texture

            history texture içine

            kopyalanır.
        */



        this.frameIndex++;

    }

/*
========================================
GPU Execute
========================================
*/

    execute(

        context:any

    ):any {



        if (

            !this.enabled

        ){

            return null;

        }



        if (

            !this.shader ||

            !this.ssrBuffer

        ){

            return null;

        }



        this.shader.bind();



        /*
        --------------------------------
        Resolve Parameters
        --------------------------------
        */


        this.shader.setUniform?.(

            "uHistoryWeight",

            this.historyWeight

        );



        this.shader.setUniform?.(

            "uConfidenceThreshold",

            this.confidenceThreshold

        );



        this.shader.setUniform?.(

            "uRoughnessFade",

            this.roughnessFade

        );



        this.shader.setUniform?.(

            "uFrameIndex",

            this.frameIndex

        );



        this.shader.setUniform?.(

            "uAdaptive",

            this.adaptive

        );



        this.shader.setUniform?.(

            "uMode",

            this.mode

        );





        /*
        --------------------------------
        Input Buffers
        --------------------------------
        */


        this.ssrBuffer.bind();



        if (

            this.historyBuffer

        ){

            this.historyBuffer.bind();

        }



        if (

            this.reactiveMask

        ){

            this.reactiveMask.bind();

        }



        /*
        --------------------------------
        Fullscreen Resolve
        --------------------------------
        */


        context.drawFullscreenQuad?.();



        this.ssrBuffer.unbind();



        this.frameIndex++;



        return {


            type:

                "SSRResolveResult",


            frame:

                this.frameIndex,


            mode:

                this.mode


        };

    }





/*
========================================
Resize
========================================
*/

    resize(

        width:number,

        height:number

    ):void {



        this.ssrBuffer?.resize?.(

            width,

            height

        );



        this.historyBuffer?.resize?.(

            width,

            height

        );

    }





/*
========================================
Frame Reset
========================================
*/

    resetFrame():void {



        this.frameIndex = 0;


    }





/*
========================================
Enable / Disable
========================================
*/

    setEnabled(

        enabled:boolean

    ):void {



        this.enabled = enabled;


    }



    setHistoryWeight(

        weight:number

    ):void {



        this.historyWeight =

            Math.max(

                0,

                Math.min(

                    0.99,

                    weight

                )

            );

    }



    setConfidenceThreshold(

        value:number

    ):void {



        this.confidenceThreshold =

            Math.max(

                0,

                Math.min(

                    1,

                    value

                )

            );

    }



    setRoughnessFade(

        value:number

    ):void {



        this.roughnessFade =

            Math.max(

                0,

                value

            );

    }

/*
========================================
Clear Resources
========================================
*/

    reset():void {



        this.ssrBuffer = null;


        this.historyBuffer = null;


        this.reactiveMask = null;


        this.shader = null;



        this.frameIndex = 0;

    }





/*
========================================
History Invalidate
========================================
*/

    invalidateHistory():void {



        if (

            this.historyBuffer

        ){


            this.historyBuffer.clear?.();


        }


    }





/*
========================================
Runtime Statistics
========================================
*/

    getStats()

    {


        return {


            frame:

                this.frameIndex,


            enabled:

                this.enabled,


            mode:

                this.mode,


            temporal:

                this.mode !==

                SSRResolveMode.CurrentOnly,


            adaptive:

                this.adaptive

        };

    }





/*
========================================
Debug Information
========================================
*/

    debugInfo()

    {


        return {


            type:

                "SSRResolve",



            enabled:

                this.enabled,



            mode:

                this.mode,



            historyWeight:

                this.historyWeight,



            confidenceThreshold:

                this.confidenceThreshold,



            roughnessFade:

                this.roughnessFade,



            adaptive:

                this.adaptive,



            frame:

                this.frameIndex,



            resources:

            {


                ssrBuffer:

                    this.ssrBuffer !== null,



                historyBuffer:

                    this.historyBuffer !== null,



                reactiveMask:

                    this.reactiveMask !== null,



                shader:

                    this.shader !== null

            }


        };

    }


}