
import {
    SSRBuffer
} from "./SSRBuffer";


import {
    SSRHistoryBuffer
} from "./SSRHistoryBuffer";


import {
    ReflectionProbeBuffer
} from "./ReflectionProbeBuffer";


import {
    EnvironmentMap
} from "./EnvironmentMap";


import {
    ShaderProgram
} from "../shader/ShaderProgram";



export interface SSRCompositeOptions {


    fresnelPower?: number;


    reflectionStrength?: number;


    roughnessBlend?: number;


    metallicBoost?: number;


    enabled?: boolean;


    energyConservation?: boolean;

}



export enum SSRCompositeMode {


    SSROnly = "SSROnly",


    ProbeOnly = "ProbeOnly",


    Hybrid = "Hybrid"

}



export interface SSRMaterial {



    roughness:number;


    metallic:number;


    albedo:any;


}



export interface SSRCompositeInput {



    ssr:any;


    probe:any;


    environment:any;


    material:SSRMaterial;


    viewAngle:number;


    confidence:number;

}



export interface SSRCompositeResult {



    color:any;


    ssrWeight:number;


    probeWeight:number;


    environmentUsed:boolean;

}





export class SSRComposite {



    public enabled = true;



    public fresnelPower = 5.0;



    public reflectionStrength = 1.0;



    public roughnessBlend = 1.0;



    public metallicBoost = 1.2;



    public energyConservation = true;



    public mode:

        SSRCompositeMode =

            SSRCompositeMode.Hybrid;



    private ssr:

        SSRBuffer | null = null;



    private history:

        SSRHistoryBuffer | null = null;



    private probe:

        ReflectionProbeBuffer | null = null;



    private environment:

        EnvironmentMap | null = null;



    private shader:

        ShaderProgram | null = null;



    private frameIndex = 0;



    constructor(

        options:

            SSRCompositeOptions = {}

    ){



        this.fresnelPower =

            options.fresnelPower ??

            this.fresnelPower;



        this.reflectionStrength =

            options.reflectionStrength ??

            this.reflectionStrength;



        this.roughnessBlend =

            options.roughnessBlend ??

            this.roughnessBlend;



        this.metallicBoost =

            options.metallicBoost ??

            this.metallicBoost;



        this.enabled =

            options.enabled ??

            this.enabled;



        this.energyConservation =

            options.energyConservation ??

            this.energyConservation;


    }





    setSSRBuffer(

        buffer:

            SSRBuffer

    ):void{


        this.ssr = buffer;


    }





    setHistoryBuffer(

        buffer:

            SSRHistoryBuffer

    ):void{


        this.history = buffer;


    }





    setReflectionProbe(

        buffer:

            ReflectionProbeBuffer

    ):void{


        this.probe = buffer;


    }





    setEnvironmentMap(

        environment:

            EnvironmentMap

    ):void{


        this.environment = environment;


    }





    setShader(

        shader:

            ShaderProgram

    ):void{


        this.shader = shader;


    }

/*
========================================
Fresnel Schlick
========================================
*/

    fresnelSchlick(

        cosTheta:number,

        f0:number = 0.04

    ):number {



        const oneMinus =

            1 -

            Math.max(

                0,

                Math.min(

                    1,

                    cosTheta

                )

            );



        return (

            f0 +

            (

                1 -

                f0

            )

            *

            Math.pow(

                oneMinus,

                5

            )

        );

    }





/*
========================================
Custom Fresnel
========================================
*/

    fresnel(

        viewAngle:number

    ):number {



        return Math.pow(

            1 -

            Math.max(

                0,

                viewAngle

            ),

            this.fresnelPower

        );

    }





/*
========================================
Roughness Response
========================================
*/

    calculateRoughnessFactor(

        roughness:number

    ):number {



        const factor =

            1 -

            (

                roughness *

                this.roughnessBlend

            );



        return Math.max(

            0,

            Math.min(

                1,

                factor

            )

        );

    }





/*
========================================
Metallic Response
========================================
*/

    calculateMetallicFactor(

        metallic:number

    ):number {



        if (

            metallic <= 0

        ){

            return 1.0;

        }



        return 1.0 +

            (

                metallic *

                this.metallicBoost

            );

    }





/*
========================================
Confidence Factor
========================================
*/

    calculateConfidence(

        confidence:number

    ):number {



        return Math.max(

            0,

            Math.min(

                1,

                confidence

            )

        );

    }





/*
========================================
SSR Weight
========================================
*/

    calculateSSRWeight(

        material:

            SSRMaterial,

        viewAngle:number,

        confidence:number

    ):number {



        let weight =

            this.reflectionStrength;



        /*
            Fresnel
        */


        weight *=

            this.fresnelSchlick(

                viewAngle

            );



        /*
            Roughness
        */


        weight *=

            this.calculateRoughnessFactor(

                material.roughness

            );



        /*
            Metallic
        */


        weight *=

            this.calculateMetallicFactor(

                material.metallic

            );



        /*
            SSR confidence
        */


        weight *=

            this.calculateConfidence(

                confidence

            );



        return Math.max(

            0,

            weight

        );

    }





/*
========================================
Probe Weight
========================================
*/

    calculateProbeWeight(

        material:

            SSRMaterial,

        viewAngle:number

    ):number {



        let weight =

            this.reflectionStrength;



        weight *=

            this.fresnelSchlick(

                viewAngle

            );



        weight *=

            this.calculateRoughnessFactor(

                material.roughness

            );



        return Math.max(

            0,

            weight

        );

    }

/*
========================================
Environment Weight
========================================
*/

    calculateEnvironmentWeight(

        material:

            SSRMaterial,

        confidence:number

    ):number {



        let weight = 1.0;



        /*
            SSR güveni düşükse

            environment artar
        */


        weight *=

            (

                1 -

                this.calculateConfidence(

                    confidence

                )

            );



        /*
            Rough surface

            environment daha görünür
        */


        weight *=

            material.roughness;



        return Math.max(

            0,

            weight

        );

    }





/*
========================================
Energy Conservation
========================================
*/

    applyEnergyConservation(

        reflection:number,

        diffuse:number

    ):number {



        if (

            !this.energyConservation

        ){

            return reflection;

        }



        return Math.min(

            reflection,

            1 -

            diffuse

        );

    }





/*
========================================
BRDF Reflection Combine
========================================
*/

    combineReflection(

        ssr:any,

        probe:any,

        environment:any,

        ssrWeight:number,

        probeWeight:number,

        environmentWeight:number

    ):any {



        return {


            ssr:{


                value:ssr,


                weight:ssrWeight


            },


            probe:{


                value:probe,


                weight:probeWeight


            },


            environment:{


                value:environment,


                weight:environmentWeight


            }


        };

    }





/*
========================================
Hybrid Resolve
========================================
*/

    resolveHybrid(

        input:

            SSRCompositeInput

    ):SSRCompositeResult {



        const ssrWeight =

            this.calculateSSRWeight(

                input.material,

                input.viewAngle,

                input.confidence

            );



        const probeWeight =

            this.calculateProbeWeight(

                input.material,

                input.viewAngle

            );



        const environmentWeight =

            this.calculateEnvironmentWeight(

                input.material,

                input.confidence

            );



        const color =

            this.combineReflection(

                input.ssr,

                input.probe,

                input.environment,

                ssrWeight,

                probeWeight,

                environmentWeight

            );



        return {


            color,


            ssrWeight,


            probeWeight,


            environmentUsed:

                environmentWeight > 0


        };

    }





/*
========================================
SSR Only Resolve
========================================
*/

    resolveSSROnly(

        input:

            SSRCompositeInput

    ):SSRCompositeResult {



        const weight =

            this.calculateSSRWeight(

                input.material,

                input.viewAngle,

                input.confidence

            );



        return {


            color:


            {


                ssr:

                    input.ssr,


                weight


            },


            ssrWeight:

                weight,


            probeWeight:

                0,


            environmentUsed:false


        };

    }





/*
========================================
Probe Only Resolve
========================================
*/

    resolveProbeOnly(

        input:

            SSRCompositeInput

    ):SSRCompositeResult {



        const weight =

            this.calculateProbeWeight(

                input.material,

                input.viewAngle

            );



        return {


            color:


            {


                probe:

                    input.probe,


                weight


            },


            ssrWeight:

                0,


            probeWeight:

                weight,


            environmentUsed:false


        };

    }





/*
========================================
Main Composite
========================================
*/

    composite(

        input:

            SSRCompositeInput

    ):SSRCompositeResult {



        if (

            !this.enabled

        ){


            return {


                color:

                    input.ssr,


                ssrWeight:1,


                probeWeight:0,


                environmentUsed:false


            };

        }



        switch(

            this.mode

        ){



            case SSRCompositeMode.SSROnly:


                return this.resolveSSROnly(

                    input

                );





            case SSRCompositeMode.ProbeOnly:


                return this.resolveProbeOnly(

                    input

                );





            case SSRCompositeMode.Hybrid:


            default:


                return this.resolveHybrid(

                    input

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



        /*
        --------------------------------
        Composite Parameters
        --------------------------------
        */



        this.shader.setUniform?.(

            "uFresnelPower",

            this.fresnelPower

        );



        this.shader.setUniform?.(

            "uReflectionStrength",

            this.reflectionStrength

        );



        this.shader.setUniform?.(

            "uRoughnessBlend",

            this.roughnessBlend

        );



        this.shader.setUniform?.(

            "uMetallicBoost",

            this.metallicBoost

        );



        this.shader.setUniform?.(

            "uEnergyConservation",

            this.energyConservation

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
        --------------------------------
        Input Buffers
        --------------------------------
        */



        this.ssr?.bind();



        this.history?.bind();



        this.probe?.bind();



        this.environment?.bind();





        /*
        --------------------------------
        Fullscreen Composite
        --------------------------------
        */



        context.drawFullscreenQuad?.();



        this.ssr?.unbind();



        this.frameIndex++;



        return {


            type:

                "SSRCompositeResult",


            frame:

                this.frameIndex,


            mode:

                this.mode


        };

    }





/*
========================================
Runtime Controls
========================================
*/

    setEnabled(

        enabled:boolean

    ):void {



        this.enabled = enabled;

    }





    setFresnelPower(

        value:number

    ):void {



        this.fresnelPower =

            Math.max(

                0.1,

                value

            );

    }





    setReflectionStrength(

        value:number

    ):void {



        this.reflectionStrength =

            Math.max(

                0,

                value

            );

    }





    setRoughnessBlend(

        value:number

    ):void {



        this.roughnessBlend =

            Math.max(

                0,

                value

            );

    }





    setMetallicBoost(

        value:number

    ):void {



        this.metallicBoost =

            Math.max(

                0,

                value

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



        this.ssr?.resize?.(

            width,

            height

        );



        this.history?.resize?.(

            width,

            height

        );



        this.probe?.resize?.(

            width,

            height

        );

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
Reset Resources
========================================
*/

    reset():void {



        this.ssr = null;



        this.history = null;



        this.probe = null;



        this.environment = null;



        this.shader = null;



        this.frameIndex = 0;



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
Mode Change
========================================
*/

    setMode(

        mode:

            SSRCompositeMode

    ):void {



        this.mode = mode;


    }





/*
========================================
Energy Conservation Toggle
========================================
*/

    setEnergyConservation(

        enabled:boolean

    ):void {



        this.energyConservation = enabled;


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


            energyConservation:

                this.energyConservation,


            reflectionStrength:

                this.reflectionStrength

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

                "SSRComposite",



            enabled:

                this.enabled,



            mode:

                this.mode,



            fresnelPower:

                this.fresnelPower,



            reflectionStrength:

                this.reflectionStrength,



            roughnessBlend:

                this.roughnessBlend,



            metallicBoost:

                this.metallicBoost,



            energyConservation:

                this.energyConservation,



            frame:

                this.frameIndex,



            resources:

            {


                ssr:

                    this.ssr !== null,



                history:

                    this.history !== null,



                probe:

                    this.probe !== null,



                environment:

                    this.environment !== null,



                shader:

                    this.shader !== null

            }


        };

    }


}