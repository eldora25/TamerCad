
import {
    SSRHistoryBuffer
} from "./SSRHistoryBuffer";


import {
    SSRResolve
} from "./SSRResolve";


import {
    ShaderProgram
} from "../shader/ShaderProgram";



export interface SSRTemporalFilterOptions {


    feedback?: number;


    varianceClamp?: number;


    spatialRadius?: number;


    enabled?: boolean;


    useMotionVectors?: boolean;

}



export enum SSRTemporalFilterMode {


    TemporalOnly = "TemporalOnly",


    TemporalSpatial = "TemporalSpatial",


    VarianceGuided = "VarianceGuided"

}



export interface SSRTemporalInput {


    color:any;


    history:any;


    velocity?:{


        x:number,

        y:number

    };


    depth:number;


    variance:number;


    reactive:number;

}



export interface SSRTemporalResult {


    color:any;


    historyUsed:boolean;


    weight:number;


    rejected:boolean;

}





export class SSRTemporalFilter {



    public enabled = true;



    public feedback = 0.92;



    public varianceClamp = 0.25;



    public spatialRadius = 1;



    public useMotionVectors = true;



    public mode:

        SSRTemporalFilterMode =

            SSRTemporalFilterMode.VarianceGuided;



    private history:

        SSRHistoryBuffer | null = null;



    private resolve:

        SSRResolve | null = null;



    private shader:

        ShaderProgram | null = null;



    private frameIndex = 0;



    constructor(

        options:

            SSRTemporalFilterOptions = {}

    ){



        this.feedback =

            options.feedback ??

            this.feedback;



        this.varianceClamp =

            options.varianceClamp ??

            this.varianceClamp;



        this.spatialRadius =

            options.spatialRadius ??

            this.spatialRadius;



        this.enabled =

            options.enabled ??

            this.enabled;



        this.useMotionVectors =

            options.useMotionVectors ??

            this.useMotionVectors;


    }



    setHistoryBuffer(

        buffer:

            SSRHistoryBuffer

    ):void{


        this.history = buffer;


    }



    setResolve(

        resolve:

            SSRResolve

    ):void{


        this.resolve = resolve;


    }



    setShader(

        shader:

            ShaderProgram

    ):void{


        this.shader = shader;


    }



    setMode(

        mode:

            SSRTemporalFilterMode

    ):void{


        this.mode = mode;


    }

/*
========================================
History Reprojection
========================================
*/

    calculateHistoryUV(

        currentUV:

            {

                x:number,

                y:number

            },

        velocity:

            {

                x:number,

                y:number

            }

    ):{



        x:number,

        y:number

    } {



        if (

            !this.useMotionVectors

        ){


            return {


                x:

                    currentUV.x,


                y:

                    currentUV.y


            };

        }



        return {


            x:

                currentUV.x -

                velocity.x,



            y:

                currentUV.y -

                velocity.y


        };

    }





/*
========================================
History Validity
========================================
*/

    isValidHistoryUV(

        uv:

            {

                x:number,

                y:number

            }

    ):boolean {



        return (

            uv.x >= 0 &&

            uv.x <= 1 &&

            uv.y >= 0 &&

            uv.y <= 1

        );

    }





/*
========================================
Neighborhood Sampling
========================================
*/

    collectNeighborhood(

        samples:any[]

    ):any[] {



        const result:any[] = [];



        const radius =

            this.spatialRadius;



        /*
            Gerçek GPU tarafında:

            texture offsets

            kullanılır.


            Burada CPU tarafı

            veri hazırlığıdır.
        */



        for (

            let x = -radius;

            x <= radius;

            x++

        ){



            for (

                let y = -radius;

                y <= radius;

                y++

            ){



                const index =

                    samples.length > 0

                        ?

                        Math.abs(

                            (

                                x +

                                y

                            )

                        )

                        %

                        samples.length

                        :

                        0;



                if (

                    samples[index] !== undefined

                ){

                    result.push(

                        samples[index]

                    );

                }


            }

        }



        return result;

    }





/*
========================================
Neighborhood Average
========================================
*/

    calculateNeighborhoodAverage(

        samples:any[]

    ):any {



        if (

            samples.length === 0

        ){


            return null;

        }



        return samples[0];

    }





/*
========================================
History Sample
========================================
*/

    sampleHistory(

        uv:

            {

                x:number,

                y:number

            }

    ):any {



        if (

            !this.history ||

            !this.isValidHistoryUV(

                uv

            )

        ){


            return null;

        }



        /*
            Gerçek uygulama:

            history texture fetch
        */



        return {

            uv,


            valid:true

        };

    }

/*
========================================
Variance Estimation
========================================
*/

    estimateVariance(

        values:

            number[]

    ):number {



        if (

            values.length === 0

        ){

            return 0;

        }



        let mean = 0;



        for (

            const value of values

        ){

            mean += value;

        }



        mean /= values.length;



        let variance = 0;



        for (

            const value of values

        ){



            const delta =

                value -

                mean;



            variance +=

                delta *

                delta;

        }



        return (

            variance /

            values.length

        );

    }





/*
========================================
Neighborhood Min
========================================
*/

    calculateMin(

        values:

            number[]

    ):number {



        if (

            values.length === 0

        ){

            return 0;

        }



        let min =

            values[0];



        for (

            const value of values

        ){



            if (

                value < min

            ){

                min = value;

            }

        }



        return min;

    }





/*
========================================
Neighborhood Max
========================================
*/

    calculateMax(

        values:

            number[]

    ):number {



        if (

            values.length === 0

        ){

            return 0;

        }



        let max =

            values[0];



        for (

            const value of values

        ){



            if (

                value > max

            ){

                max = value;

            }

        }



        return max;

    }





/*
========================================
History Clamp
========================================
*/

    clampHistory(

        historyValue:number,

        neighborhood:

            number[]

    ):number {



        if (

            neighborhood.length === 0

        ){

            return historyValue;

        }



        const min =

            this.calculateMin(

                neighborhood

            );



        const max =

            this.calculateMax(

                neighborhood

            );



        return Math.max(

            min,

            Math.min(

                max,

                historyValue

            )

        );

    }





/*
========================================
Variance Guided Clamp
========================================
*/

    varianceClampHistory(

        historyValue:number,

        neighborhood:

            number[]

    ):number {



        const variance =

            this.estimateVariance(

                neighborhood

            );



        if (

            variance <

            this.varianceClamp

        ){



            return this.clampHistory(

                historyValue,

                neighborhood

            );

        }



        /*
            yüksek variance:

            daha agresif clamp
        */


        const center =

            this.calculateNeighborhoodAverage(

                neighborhood

            );



        return center ?? historyValue;

    }





/*
========================================
Disocclusion Detection
========================================
*/

    detectDisocclusion(

        currentDepth:number,

        historyDepth:number

    ):boolean {



        const difference =

            Math.abs(

                currentDepth -

                historyDepth

            );



        return (

            difference >

            0.01

        );

    }





/*
========================================
History Rejection
========================================
*/

    rejectHistory(

        input:

            SSRTemporalInput

    ):boolean {



        if (

            input.reactive >

            0.5

        ){

            return true;

        }



        if (

            input.variance >

            this.varianceClamp

        ){

            return true;

        }



        return false;

    }

/*
========================================
Temporal Only
========================================
*/

    temporalOnly(

        input:

            SSRTemporalInput,

        history:any

    ):SSRTemporalResult {



        const rejected =

            this.rejectHistory(

                input

            );



        if (

            rejected ||

            history === null

        ){


            return {


                color:

                    input.color,


                historyUsed:false,


                weight:0,


                rejected:true


            };

        }



        return {


            color:{

                current:

                    input.color,


                history,


                mix:

                    this.feedback

            },


            historyUsed:true,


            weight:

                this.feedback,


            rejected:false


        };

    }





/*
========================================
Temporal Spatial
========================================
*/

    temporalSpatial(

        input:

            SSRTemporalInput,

        history:any,

        neighborhood:

            any[]

    ):SSRTemporalResult {



        const spatial =

            this.calculateNeighborhoodAverage(

                neighborhood

            );



        const rejected =

            this.rejectHistory(

                input

            );



        if (

            rejected ||

            history === null

        ){


            return {


                color:

                    input.color,


                historyUsed:false,


                weight:0,


                rejected:true


            };

        }



        return {


            color:{

                current:

                    input.color,


                history:

                    spatial ?? history,


                mix:

                    this.feedback

            },


            historyUsed:true,


            weight:

                this.feedback,


            rejected:false


        };

    }





/*
========================================
Variance Guided
========================================
*/

    varianceGuided(

        input:

            SSRTemporalInput,

        history:any,

        neighborhood:

            number[]

    ):SSRTemporalResult {



        const rejected =

            this.rejectHistory(

                input

            );



        if (

            rejected ||

            history === null

        ){


            return {


                color:

                    input.color,


                historyUsed:false,


                weight:0,


                rejected:true


            };

        }



        const clampedHistory =

            this.varianceClampHistory(

                history,

                neighborhood

            );



        let weight =

            this.feedback;



        const variance =

            input.variance;



        if (

            variance >

            this.varianceClamp

        ){


            weight *= 0.5;

        }



        return {


            color:{

                current:

                    input.color,


                history:

                    clampedHistory,


                mix:

                    weight

            },


            historyUsed:true,


            weight,


            rejected:false


        };

    }





/*
========================================
Main Filter
========================================
*/

    filter(

        input:

            SSRTemporalInput,

        history:any = null,

        neighborhood:

            any[] = []

    ):SSRTemporalResult {



        if (

            !this.enabled

        ){


            return {


                color:

                    input.color,


                historyUsed:false,


                weight:0,


                rejected:false


            };

        }



        switch(

            this.mode

        ){



            case SSRTemporalFilterMode.TemporalOnly:


                return this.temporalOnly(

                    input,

                    history

                );





            case SSRTemporalFilterMode.TemporalSpatial:


                return this.temporalSpatial(

                    input,

                    history,

                    neighborhood

                );





            case SSRTemporalFilterMode.VarianceGuided:


            default:


                return this.varianceGuided(

                    input,

                    history,

                    neighborhood

                );

        }

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

            !this.shader

        ){

            return null;

        }



        this.shader.bind();



        this.shader.setUniform?.(

            "uFeedback",

            this.feedback

        );



        this.shader.setUniform?.(

            "uVarianceClamp",

            this.varianceClamp

        );



        this.shader.setUniform?.(

            "uSpatialRadius",

            this.spatialRadius

        );



        this.shader.setUniform?.(

            "uFrameIndex",

            this.frameIndex

        );



        this.shader.setUniform?.(

            "uMode",

            this.mode

        );



        this.shader.setUniform?.(

            "uUseMotionVectors",

            this.useMotionVectors

        );



        /*
            Temporal resolve shader çalışır
        */


        context.drawFullscreenQuad?.();



        this.frameIndex++;



        return {


            type:

                "SSRTemporalResult",


            frame:

                this.frameIndex,


            mode:

                this.mode


        };

    }





/*
========================================
History Update
========================================
*/

    updateHistory(

        current:any

    ):void {



        if (

            !this.history

        ){

            return;

        }



        /*
            Gerçek GPU:

            current SSR output

            history buffer içine kopyalanır
        */


        this.history.update?.(

            current

        );

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



        this.history?.resize?.(

            width,

            height

        );

    }





/*
========================================
Frame Begin
========================================
*/

    beginFrame():void {



        this.frameIndex++;



    }





/*
========================================
Reset
========================================
*/

    reset():void {



        this.frameIndex = 0;



        this.history = null;



        this.resolve = null;



        this.shader = null;


    }





/*
========================================
History Invalidate
========================================
*/

    invalidateHistory():void {



        this.history?.clear?.();



    }





/*
========================================
Debug
========================================
*/

    debugInfo()

    {


        return {


            type:

                "SSRTemporalFilter",



            enabled:

                this.enabled,



            mode:

                this.mode,



            feedback:

                this.feedback,



            varianceClamp:

                this.varianceClamp,



            spatialRadius:

                this.spatialRadius,



            useMotionVectors:

                this.useMotionVectors,



            frame:

                this.frameIndex,



            resources:

            {


                history:

                    this.history !== null,


                resolve:

                    this.resolve !== null,


                shader:

                    this.shader !== null


            }


        };

    }


}