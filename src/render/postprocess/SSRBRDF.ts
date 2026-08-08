
import {
    SSRComposite
} from "./SSRComposite";

import {
    ShaderProgram
} from "../shader/ShaderProgram";



export interface SSRBRDFOptions {


    fresnelBase?: number;


    energyCompensation?: boolean;


    minRoughness?: number;


    enabled?: boolean;

}



export interface BRDFInput {


    viewDotNormal:number;


    lightDotNormal:number;


    halfDotNormal:number;


    viewDotHalf:number;


    roughness:number;


    metallic:number;


    confidence?:number;


    baseReflectivity?:number;


}



export interface BRDFResult {


    D:number;


    F:number;


    G:number;


    specular:number;


    diffuseEnergy:number;


    reflectionWeight:number;


}





export interface SSRReflectionInput {


    color:any;


    brdf:BRDFInput;


}





export class SSRBRDF {



    public enabled = true;



    public fresnelBase = 0.04;



    public energyCompensation = true;



    public minRoughness = 0.045;



    private composite:

        SSRComposite | null = null;



    private shader:

        ShaderProgram | null = null;



    private frameIndex = 0;



    constructor(

        options:

            SSRBRDFOptions = {}

    ){



        this.fresnelBase =

            options.fresnelBase ??

            this.fresnelBase;



        this.energyCompensation =

            options.energyCompensation ??

            this.energyCompensation;



        this.minRoughness =

            options.minRoughness ??

            this.minRoughness;



        this.enabled =

            options.enabled ??

            this.enabled;


    }





    setComposite(

        composite:

            SSRComposite

    ):void {



        this.composite = composite;


    }





    setShader(

        shader:

            ShaderProgram

    ):void {



        this.shader = shader;


    }

/*
========================================
GGX Normal Distribution Function
========================================
*/

    distributionGGX(

        nDotH:number,

        roughness:number

    ):number {



        const r =

            Math.max(

                roughness,

                this.minRoughness

            );



        const a =

            r * r;



        const a2 =

            a * a;



        const nh =

            Math.max(

                nDotH,

                0

            );



        const nh2 =

            nh *

            nh;



        const denom =

            (

                nh2 *

                (

                    a2 -

                    1

                )

                +

                1

            );



        return (


            a2

            /

            (

                Math.PI *

                denom *

                denom +

                1e-6

            )

        );

    }





/*
========================================
Fresnel Schlick
========================================
*/

    fresnelSchlick(

        cosTheta:number,

        f0:number

    ):number {



        const ct =

            Math.max(

                0,

                Math.min(

                    1,

                    cosTheta

                )

            );



        return (


            f0

            +

            (

                1 -

                f0

            )

            *

            Math.pow(

                1 -

                ct,

                5

            )

        );

    }





/*
========================================
Roughness Fresnel Approximation
========================================
*/

    fresnelRoughness(

        cosTheta:number,

        f0:number,

        roughness:number

    ):number {



        const maxValue =

            Math.max(

                1 -

                roughness,

                f0

            );



        return (

            f0 +

            (

                maxValue -

                f0

            )

            *

            Math.pow(

                1 -

                cosTheta,

                5

            )

        );

    }





/*
========================================
Smith GGX Geometry Schlick
========================================
*/

    geometrySchlickGGX(

        nDot:number,

        roughness:number

    ):number {



        const r =

            roughness + 1;



        const k =

            (

                r * r

            )

            /

            8;



        return (


            nDot

            /

            (

                nDot *

                (

                    1 -

                    k

                )

                +

                k

            )

        );

    }





/*
========================================
Smith Geometry
========================================
*/

    geometrySmith(

        nDotV:number,

        nDotL:number,

        roughness:number

    ):number {



        const gv =

            this.geometrySchlickGGX(

                Math.max(

                    nDotV,

                    0

                ),

                roughness

            );



        const gl =

            this.geometrySchlickGGX(

                Math.max(

                    nDotL,

                    0

                ),

                roughness

            );



        return gv * gl;

    }





/*
========================================
Visibility Term
========================================
*/

    visibility(

        nDotV:number,

        nDotL:number

    ):number {



        return (

            1 /

            Math.max(

                4 *

                nDotV *

                nDotL,

                1e-6

            )

        );

    }

/*
========================================
Dielectric / Metallic F0
========================================
*/

    calculateF0(

        metallic:number,

        baseReflectivity:number = this.fresnelBase

    ):number {



        const m =

            Math.max(

                0,

                Math.min(

                    1,

                    metallic

                )

            );



        return (


            baseReflectivity *

            (

                1 -

                m

            )

            +

            m

        );

    }





/*
========================================
Diffuse Energy
========================================
*/

    calculateDiffuseEnergy(

        fresnel:number,

        metallic:number

    ):number {



        /*
            Metallic yüzeylerde
            diffuse enerji yoktur
        */


        return (


            (

                1 -

                fresnel

            )

            *

            (

                1 -

                metallic

            )

        );

    }





/*
========================================
Specular Term
========================================
*/

    calculateSpecular(

        input:

            BRDFInput

    ):BRDFResult {



        const roughness =

            Math.max(

                input.roughness,

                this.minRoughness

            );



        const f0 =

            this.calculateF0(

                input.metallic,

                input.baseReflectivity

                    ??

                    this.fresnelBase

            );



        const D =

            this.distributionGGX(

                input.halfDotNormal,

                roughness

            );



        const F =

            this.fresnelSchlick(

                input.viewDotHalf,

                f0

            );



        const G =

            this.geometrySmith(

                input.viewDotNormal,

                input.lightDotNormal,

                roughness

            );



        const visibility =

            this.visibility(

                input.viewDotNormal,

                input.lightDotNormal

            );



        const specular =


            D *

            F *

            G *

            visibility;



        const diffuseEnergy =

            this.calculateDiffuseEnergy(

                F,

                input.metallic

            );



        let reflectionWeight =

            specular;



        if (

            this.energyCompensation

        ){



            reflectionWeight *=

                (

                    1 +

                    (

                        roughness *

                        0.5

                    )

                );

        }



        if (

            input.confidence !== undefined

        ){



            reflectionWeight *=

                Math.max(

                    0,

                    Math.min(

                        1,

                        input.confidence

                    )

                );

        }



        return {


            D,


            F,


            G,


            specular,


            diffuseEnergy,


            reflectionWeight


        };

    }





/*
========================================
Evaluate BRDF
========================================
*/

    evaluate(

        input:

            BRDFInput

    ):BRDFResult {



        if (

            !this.enabled

        ){



            return {


                D:0,


                F:0,


                G:0,


                specular:0,


                diffuseEnergy:1,


                reflectionWeight:0


            };

        }



        return this.calculateSpecular(

            input

        );

    }





/*
========================================
Reflection Color Apply
========================================
*/

    applyReflection(

        reflection:any,

        input:

            BRDFInput

    ):any {



        const brdf =

            this.evaluate(

                input

            );



        return {


            color:

                reflection,


            weight:

                brdf.reflectionWeight,


            brdf


        };

    }

/*
========================================
SSR Reflection Evaluation
========================================
*/

    evaluateSSRReflection(

        input:

            SSRReflectionInput

    ):any {



        const brdf =

            this.evaluate(

                input.brdf

            );



        return {


            color:

                input.color,


            specular:

                brdf.specular,


            weight:

                brdf.reflectionWeight,


            diffuseEnergy:

                brdf.diffuseEnergy


        };

    }





/*
========================================
Composite Integration
========================================
*/

    composeSSR(

        reflection:any,

        brdf:

            BRDFInput

    ):any {



        const evaluated =

            this.applyReflection(

                reflection,

                brdf

            );



        if (

            this.composite

        ){



            return {


                composite:

                    this.composite,


                reflection:

                    evaluated

            };

        }



        return evaluated;

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
        BRDF uniforms
        --------------------------------
        */


        this.shader.setUniform?.(

            "uFresnelBase",

            this.fresnelBase

        );



        this.shader.setUniform?.(

            "uMinRoughness",

            this.minRoughness

        );



        this.shader.setUniform?.(

            "uEnergyCompensation",

            this.energyCompensation

        );



        this.shader.setUniform?.(

            "uFrameIndex",

            this.frameIndex

        );





        /*
        --------------------------------
        Input bindings
        --------------------------------
        */


        this.composite?.setMode?.(

            this.composite.mode

        );





        /*
            GPU:

            SSR texture

            Normal

            Roughness

            Metallic

            BRDF resolve

        */


        context.drawFullscreenQuad?.();



        this.frameIndex++;



        return {


            type:

                "SSRBRDFResult",


            frame:

                this.frameIndex


        };

    }





/*
========================================
Frame Update
========================================
*/

    update():

    void {



        this.frameIndex++;



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



        /*
            Shader texture
            resize noktası

        */



        this.composite?.resize?.(

            width,

            height

        );

    }

/*
========================================
Runtime Settings
========================================
*/

    setEnabled(

        enabled:boolean

    ):void {



        this.enabled = enabled;


    }





    setFresnelBase(

        value:number

    ):void {



        this.fresnelBase =

            Math.max(

                0,

                Math.min(

                    1,

                    value

                )

            );


    }





    setEnergyCompensation(

        enabled:boolean

    ):void {



        this.energyCompensation = enabled;


    }





    setMinRoughness(

        value:number

    ):void {



        this.minRoughness =

            Math.max(

                0.001,

                value

            );


    }





/*
========================================
Resource Cleanup
========================================
*/

    release():void {



        this.composite =

            null;



        this.shader =

            null;



    }





/*
========================================
Reset
========================================
*/

    reset():void {



        this.composite =

            null;



        this.shader =

            null;



        this.frameIndex =

            0;


    }





/*
========================================
Debug Info
========================================
*/

    debugInfo()

    {


        return {


            type:

                "SSRBRDF",



            enabled:

                this.enabled,



            fresnelBase:

                this.fresnelBase,



            energyCompensation:

                this.energyCompensation,



            minRoughness:

                this.minRoughness,



            frame:

                this.frameIndex,



            resources:

            {


                composite:

                    this.composite !== null,



                shader:

                    this.shader !== null


            }


        };


    }


}