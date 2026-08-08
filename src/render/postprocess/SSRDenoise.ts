
import {
    SSRBuffer
} from "./SSRBuffer";


import {
    SSRHistoryBuffer
} from "./SSRHistoryBuffer";


import {
    NormalPrepass
} from "./NormalPrepass";


import {
    DepthPrepass
} from "./DepthPrepass";


import {
    ShaderProgram
} from "../shader/ShaderProgram";



export interface SSRDenoiseOptions {


    radius?: number;


    iterations?: number;


    normalThreshold?: number;


    depthThreshold?: number;


    enabled?: boolean;


    sigma?: number;

}



export enum SSRDenoiseMode {


    Gaussian = "Gaussian",


    Bilateral = "Bilateral",


    EdgeAware = "EdgeAware"

}



export interface SSRDenoiseSample {


    color:any;


    normal:any;


    depth:number;


    weight:number;

}



export interface SSRDenoiseResult {


    color:any;


    iterations:number;


    mode:SSRDenoiseMode;

}





export class SSRDenoise {



    public enabled = true;



    public radius = 2;



    public iterations = 2;



    public normalThreshold = 0.15;



    public depthThreshold = 0.01;



    public sigma = 2.0;



    public mode:

        SSRDenoiseMode =

            SSRDenoiseMode.EdgeAware;



    private ssrBuffer:

        SSRBuffer | null = null;



    private history:

        SSRHistoryBuffer | null = null;



    private normal:

        NormalPrepass | null = null;



    private depth:

        DepthPrepass | null = null;



    private shader:

        ShaderProgram | null = null;



    private frameIndex = 0;



    constructor(

        options:

            SSRDenoiseOptions = {}

    ){



        this.radius =

            options.radius ??

            this.radius;



        this.iterations =

            options.iterations ??

            this.iterations;



        this.normalThreshold =

            options.normalThreshold ??

            this.normalThreshold;



        this.depthThreshold =

            options.depthThreshold ??

            this.depthThreshold;



        this.enabled =

            options.enabled ??

            this.enabled;



        this.sigma =

            options.sigma ??

            this.sigma;


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


        this.history = buffer;


    }





    setNormalBuffer(

        buffer:

            NormalPrepass

    ):void{


        this.normal = buffer;


    }





    setDepthBuffer(

        buffer:

            DepthPrepass

    ):void{


        this.depth = buffer;


    }





    setShader(

        shader:

            ShaderProgram

    ):void{


        this.shader = shader;


    }

/*
========================================
Gaussian Kernel
========================================
*/

    generateKernel()

    :number[] {



        const kernel:number[] = [];



        const size =

            this.radius * 2 + 1;



        let sum = 0;



        for (

            let i = -this.radius;

            i <= this.radius;

            i++

        ){



            const weight =

                Math.exp(

                    -(

                        i * i

                    )

                    /

                    (

                        2 *

                        this.sigma *

                        this.sigma

                    )

                );



            kernel.push(

                weight

            );



            sum += weight;

        }



        /*
            Normalize
        */


        for (

            let i = 0;

            i < kernel.length;

            i++

        ){


            kernel[i] /= sum;


        }



        return kernel;

    }





/*
========================================
Spatial Weight
========================================
*/

    spatialWeight(

        distance:number

    ):number {



        return Math.exp(

            -(

                distance *

                distance

            )

            /

            (

                2 *

                this.sigma *

                this.sigma

            )

        );

    }





/*
========================================
Normal Weight
========================================
*/

    normalWeight(

        center:any,

        sample:any

    ):number {



        if (

            !center ||

            !sample

        ){

            return 0;

        }



        const dot =

            center.x *

            sample.x +


            center.y *

            sample.y +


            center.z *

            sample.z;



        if (

            dot <

            this.normalThreshold

        ){

            return 0;

        }



        return Math.max(

            0,

            dot

        );

    }





/*
========================================
Depth Weight
========================================
*/

    depthWeight(

        centerDepth:number,

        sampleDepth:number

    ):number {



        const difference =

            Math.abs(

                centerDepth -

                sampleDepth

            );



        if (

            difference >

            this.depthThreshold

        ){

            return 0;

        }



        return Math.exp(

            -

            difference /

            this.depthThreshold

        );

    }





/*
========================================
Combined Bilateral Weight
========================================
*/

    calculateWeight(

        center:any,

        sample:any,

        distance:number

    ):number {



        const spatial =

            this.spatialWeight(

                distance

            );



        const normal =

            this.normalWeight(

                center.normal,

                sample.normal

            );



        const depth =

            this.depthWeight(

                center.depth,

                sample.depth

            );



        return (

            spatial *

            normal *

            depth

        );

    }

/*
========================================
Sample Fetch
========================================
*/

    sampleNeighborhood(

        texture:any,

        x:number,

        y:number

    ):SSRDenoiseSample[] {



        const samples:

            SSRDenoiseSample[] = [];



        const kernelSize =

            this.radius * 2 + 1;



        for (

            let i = -this.radius;

            i <= this.radius;

            i++

        ){



            for (

                let j = -this.radius;

                j <= this.radius;

                j++

            ){



                /*
                    Gerçek GPU:

                    texture sample

                    burada yapılır
                */


                samples.push({


                    color:

                        texture,


                    normal:

                        {

                            x:0,

                            y:0,

                            z:1

                        },


                    depth:

                        1.0,


                    weight:

                        this.spatialWeight(

                            Math.sqrt(

                                i*i +

                                j*j

                            )

                        )


                });

            }

        }



        return samples;

    }





/*
========================================
Bilateral Filter
========================================
*/

    bilateralFilter(

        input:any

    ):any {



        const samples =

            this.sampleNeighborhood(

                input,

                0,

                0

            );



        let totalWeight = 0;



        let result:any = null;



        const center =

            samples[0];



        for (

            const sample of samples

        ){



            const weight =

                this.calculateWeight(

                    center,

                    sample,

                    sample.weight

                );



            totalWeight += weight;



            if (

                weight > 0

            ){


                result = {


                    color:

                        sample.color,


                    weight

                };


            }

        }



        if (

            totalWeight === 0

        ){


            return input;

        }



        return {


            color:

                result,


            weight:

                totalWeight


        };

    }





/*
========================================
Edge Aware Filter
========================================
*/

    edgeAwareFilter(

        input:any

    ):any {



        const samples =

            this.sampleNeighborhood(

                input,

                0,

                0

            );



        const filtered:any[] = [];



        for (

            const sample of samples

        ){



            const weight =

                this.calculateWeight(

                    samples[0],

                    sample,

                    sample.weight

                );



            if (

                weight >

                0

            ){


                filtered.push({

                    value:

                        sample.color,


                    weight

                });

            }

        }



        return {


            type:

                "EdgeAwareResult",


            samples:

                filtered

        };

    }





/*
========================================
Filter Dispatch
========================================
*/

    applyFilter(

        input:any

    ):any {



        switch(

            this.mode

        ){



            case SSRDenoiseMode.Gaussian:


                return this.bilateralFilter(

                    input

                );





            case SSRDenoiseMode.Bilateral:


                return this.bilateralFilter(

                    input

                );





            case SSRDenoiseMode.EdgeAware:


            default:


                return this.edgeAwareFilter(

                    input

                );

        }

    }

/*
========================================
Multi Iteration Denoise
========================================
*/

    denoise(

        reflection:any

    ):any {



        if (

            !this.enabled

        ){

            return reflection;

        }



        let result =

            reflection;



        for (

            let i = 0;

            i < this.iterations;

            i++

        ){



            result =

                this.applyFilter(

                    result

                );

        }



        return {


            type:

                "DenoisedSSR",


            result,


            iterations:

                this.iterations,


            mode:

                this.mode


        };

    }





/*
========================================
Ping Pong Resolve
========================================
*/

    private pingPong(

        input:any

    ):any {



        let current =

            input;



        for (

            let i = 0;

            i < this.iterations;

            i++

        ){



            current =

                this.applyFilter(

                    current

                );

        }



        return current;

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

            "uRadius",

            this.radius

        );



        this.shader.setUniform?.(

            "uIterations",

            this.iterations

        );



        this.shader.setUniform?.(

            "uNormalThreshold",

            this.normalThreshold

        );



        this.shader.setUniform?.(

            "uDepthThreshold",

            this.depthThreshold

        );



        this.shader.setUniform?.(

            "uSigma",

            this.sigma

        );



        this.shader.setUniform?.(

            "uMode",

            this.mode

        );



        this.shader.setUniform?.(

            "uFrameIndex",

            this.frameIndex

        );



        /*
            SSR texture bind

        */


        this.ssrBuffer?.bind();



        this.history?.bind();



        this.normal?.bind();



        this.depth?.bind();



        context.drawFullscreenQuad?.();



        this.ssrBuffer?.unbind();



        this.frameIndex++;



        return {


            type:

                "SSRDenoiseResult",


            frame:

                this.frameIndex


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



        this.history?.resize?.(

            width,

            height

        );

    }





/*
========================================
Runtime Settings
========================================
*/

    setRadius(

        radius:number

    ):void {



        this.radius =

            Math.max(

                0,

                Math.floor(

                    radius

                )

            );

    }





    setIterations(

        iterations:number

    ):void {



        this.iterations =

            Math.max(

                1,

                Math.floor(

                    iterations

                )

            );

    }





    setMode(

        mode:

            SSRDenoiseMode

    ):void {



        this.mode =

            mode;

    }





    setEnabled(

        enabled:boolean

    ):void {



        this.enabled =

            enabled;

    }





/*
========================================
Invalidate
========================================
*/

    invalidateHistory():void {



        this.history?.clear?.();



    }





/*
========================================
Reset
========================================
*/

    reset():void {



        this.ssrBuffer = null;


        this.history = null;


        this.normal = null;


        this.depth = null;


        this.shader = null;



        this.frameIndex = 0;


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

                "SSRDenoise",



            enabled:

                this.enabled,



            mode:

                this.mode,



            radius:

                this.radius,



            iterations:

                this.iterations,



            sigma:

                this.sigma,



            normalThreshold:

                this.normalThreshold,



            depthThreshold:

                this.depthThreshold,



            frame:

                this.frameIndex,



            resources:

            {


                ssrBuffer:

                    this.ssrBuffer !== null,



                history:

                    this.history !== null,



                normal:

                    this.normal !== null,



                depth:

                    this.depth !== null,



                shader:

                    this.shader !== null

            }


        };

    }


}