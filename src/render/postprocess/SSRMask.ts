
import {
    FrameBuffer,
    FrameBufferAttachment
} from "./FrameBuffer";


import {
    ShaderProgram
} from "../shader/ShaderProgram";



export interface SSRMaskOptions {



    width?:number;


    height?:number;


    format?:string;


    roughnessThreshold?:number;


    metallicThreshold?:number;


    enabled?:boolean;

}





export enum SSRMaskAttachment {



    Mask = "mask",


    Roughness = "roughness",


    Metallic = "metallic",


    MaterialClass = "materialClass",


    Reactive = "reactive"

}





export enum SSRMaterialClass {



    Opaque = 0,


    Metal = 1,


    Glass = 2,


    Coated = 3,


    Emissive = 4,


    Transparent = 5

}





export interface SSRMaskMaterial {



    roughness:number;


    metallic:number;


    transparent?:boolean;


    emissive?:boolean;


    clearCoat?:boolean;

}





export interface SSRMaskEvaluation {



    factor:number;


    materialClass:

        SSRMaterialClass;


    enabled:boolean;


    reactive:number;

}





export class SSRMask extends FrameBuffer {



    public enabled = true;



    public roughnessThreshold = 0.75;



    public metallicThreshold = 0.5;



    private rendered = false;



    private shader:

        ShaderProgram | null = null;



    private frameIndex = 0;



    constructor(

        options:

            SSRMaskOptions = {}

    ){



        super({


            width:

                options.width,



            height:

                options.height,



            attachments:

                SSRMask.createAttachments(

                    options

                )

        });



        this.roughnessThreshold =

            options.roughnessThreshold ??

            this.roughnessThreshold;



        this.metallicThreshold =

            options.metallicThreshold ??

            this.metallicThreshold;



        this.enabled =

            options.enabled ??

            this.enabled;


    }





    static createAttachments(

        options:

            SSRMaskOptions

    ):FrameBufferAttachment[] {



        return [


            {


                name:

                    SSRMaskAttachment.Mask,


                type:

                    "Texture2D",


                format:

                    options.format ??

                    "R8",


                texture:null


            },


            {


                name:

                    SSRMaskAttachment.Roughness,


                type:

                    "Texture2D",


                format:

                    "R8",


                texture:null


            },


            {


                name:

                    SSRMaskAttachment.Metallic,


                type:

                    "Texture2D",


                format:

                    "R8",


                texture:null


            },


            {


                name:

                    SSRMaskAttachment.MaterialClass,


                type:

                    "Texture2D",


                format:

                    "R8UI",


                texture:null


            },


            {


                name:

                    SSRMaskAttachment.Reactive,


                type:

                    "Texture2D",


                format:

                    "R8",


                texture:null


            }


        ];

    }

/*
========================================
Texture Access
========================================
*/

    getMaskTexture():

    any {



        return this.getTexture(

            SSRMaskAttachment.Mask

        );

    }





    getRoughnessTexture():

    any {



        return this.getTexture(

            SSRMaskAttachment.Roughness

        );

    }





    getMetallicTexture():

    any {



        return this.getTexture(

            SSRMaskAttachment.Metallic

        );

    }





    getMaterialClassTexture():

    any {



        return this.getTexture(

            SSRMaskAttachment.MaterialClass

        );

    }





    getReactiveTexture():

    any {



        return this.getTexture(

            SSRMaskAttachment.Reactive

        );

    }





/*
========================================
Material Classification
========================================
*/

    classifyMaterial(

        material:

            SSRMaskMaterial

    ):

    SSRMaterialClass {



        if (

            material.emissive

        ){



            return SSRMaterialClass.Emissive;

        }





        if (

            material.clearCoat

        ){



            return SSRMaterialClass.Coated;

        }





        if (

            material.transparent

        ){



            return SSRMaterialClass.Glass;

        }





        if (

            material.metallic >

            this.metallicThreshold

        ){



            return SSRMaterialClass.Metal;

        }





        return SSRMaterialClass.Opaque;


    }





/*
========================================
SSR Eligibility Factor
========================================
*/

    calculateSSRFactor(

        material:

            SSRMaskMaterial

    ):number {



        if (

            !this.enabled

        ){



            return 0;

        }





        /*
            Emissive yüzeyler
            reflection üretmez

        */


        if (

            material.emissive

        ){



            return 0;

        }





        /*
            Çok rough yüzey

            SSR kapatılır

        */


        if (

            material.roughness >

            this.roughnessThreshold

        ){



            return 0;

        }





        /*
            Metal yüzey

            güçlü SSR

        */


        if (

            material.metallic >

            this.metallicThreshold

        ){



            return 1.0;

        }





        /*
            Transparent yüzey

        */


        if (

            material.transparent

        ){



            return 0.8;

        }





        return 0.35;


    }





/*
========================================
Roughness Mask
========================================
*/

    calculateRoughnessMask(

        roughness:number

    ):number {



        return Math.max(

            0,

            Math.min(

                1,

                1 -

                roughness

            )

        );

    }





/*
========================================
Metallic Mask
========================================
*/

    calculateMetallicMask(

        metallic:number

    ):number {



        return Math.max(

            0,

            Math.min(

                1,

                metallic

            )

        );

    }





/*
========================================
Material Evaluation
========================================
*/

    evaluateMaterial(

        material:

            SSRMaskMaterial

    ):SSRMaskEvaluation {



        return {


            factor:

                this.calculateSSRFactor(

                    material

                ),



            materialClass:

                this.classifyMaterial(

                    material

                ),



            enabled:

                this.enabled,



            reactive:

                material.transparent

                    ?

                    1.0

                    :

                    0.0


        };

    }

/*
========================================
Depth Rejection
========================================
*/

    depthReject(

        currentDepth:number,

        previousDepth:number,

        threshold:number = 0.01

    ):boolean {



        return Math.abs(

            currentDepth -

            previousDepth

        )

        >

        threshold;


    }





/*
========================================
Normal Rejection
========================================
*/

    normalReject(

        currentNormal:any,

        previousNormal:any,

        threshold:number = 0.15

    ):boolean {



        const dot =


            currentNormal.x *

            previousNormal.x

            +

            currentNormal.y *

            previousNormal.y

            +

            currentNormal.z *

            previousNormal.z;



        return (

            1 -

            dot

        )

        >

        threshold;


    }





/*
========================================
Reactive Mask
========================================
*/

    calculateReactiveMask(

        material:

            SSRMaskMaterial

    ):number {



        if (

            material.emissive

        ){



            return 1.0;

        }





        if (

            material.transparent

        ){



            return 1.0;

        }





        if (

            material.clearCoat

        ){



            return 0.5;

        }





        return 0.0;


    }





/*
========================================
Temporal History Validation
========================================
*/

    validateHistory(

        currentDepth:number,

        previousDepth:number,

        currentNormal:any,

        previousNormal:any

    ):boolean {



        if (

            this.depthReject(

                currentDepth,

                previousDepth

            )

        ){



            return false;

        }





        if (

            this.normalReject(

                currentNormal,

                previousNormal

            )

        ){



            return false;

        }





        return true;


    }





/*
========================================
Pixel Mask Evaluation
========================================
*/

    evaluatePixel(

        material:

            SSRMaskMaterial,


        depthValid:boolean,


        normalValid:boolean

    ):SSRMaskEvaluation {



        const materialData =

            this.evaluateMaterial(

                material

            );



        let factor =

            materialData.factor;



        /*
            Temporal rejection

        */


        if (

            !depthValid ||

            !normalValid

        ){



            factor = 0;


        }





        return {


            factor,


            materialClass:

                materialData.materialClass,


            enabled:

                this.enabled,


            reactive:

                this.calculateReactiveMask(

                    material

                )


        };

    }





/*
========================================
Mask Combination
========================================
*/

    combineMasks(

        ssr:number,

        reactive:number,

        historyValid:boolean

    ):number {



        let result = ssr;



        if (

            reactive >

            0.5

        ){



            /*
                Dynamic surface

                history azalt

            */


            result *= 0.25;

        }





        if (

            !historyValid

        ){



            result = 0;


        }



        return Math.max(

            0,

            Math.min(

                1,

                result

            )

        );

    }

/*
========================================
Shader Setup
========================================
*/

    setShader(

        shader:

            ShaderProgram

    ):void {



        this.shader = shader;


    }





/*
========================================
GPU Mask Generation
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
        Mask Parameters
        --------------------------------
        */



        this.shader.setUniform?.(

            "uRoughnessThreshold",

            this.roughnessThreshold

        );



        this.shader.setUniform?.(

            "uMetallicThreshold",

            this.metallicThreshold

        );



        this.shader.setUniform?.(

            "uFrameIndex",

            this.frameIndex

        );



        this.shader.setUniform?.(

            "uEnabled",

            this.enabled

        );





        /*
        --------------------------------
        Output Attachments
        --------------------------------
        */


        const mask =

            this.getMaskTexture();



        const roughness =

            this.getRoughnessTexture();



        const metallic =

            this.getMetallicTexture();



        const materialClass =

            this.getMaterialClassTexture();



        const reactive =

            this.getReactiveTexture();





        /*
        --------------------------------
        Fullscreen Mask Pass
        --------------------------------
        */



        context.drawFullscreenQuad?.();



        this.rendered = true;



        this.frameIndex++;





        return {


            type:

                "SSRMaskResult",


            frame:

                this.frameIndex,


            attachments:

            {


                mask,


                roughness,


                metallic,


                materialClass,


                reactive

            }


        };

    }





/*
========================================
Begin / End Render
========================================
*/

    begin():

    void {



        this.rendered = false;


    }





    end():

    void {



        this.rendered = true;


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



        super.resize(

            width,

            height

        );

    }





/*
========================================
Clear Textures
========================================
*/

    clear():

    void {



        for (

            const attachment of

            this.getAttachments()

        ){



            attachment.texture =

                null;


        }



        this.rendered = false;


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





    setRoughnessThreshold(

        value:number

    ):void {



        this.roughnessThreshold =

            Math.max(

                0,

                Math.min(

                    1,

                    value

                )

            );


    }





    setMetallicThreshold(

        value:number

    ):void {



        this.metallicThreshold =

            Math.max(

                0,

                Math.min(

                    1,

                    value

                )

            );


    }





/*
========================================
Frame State
========================================
*/

    getFrameIndex():

    number {



        return this.frameIndex;


    }





    isRendered():

    boolean {



        return this.rendered;


    }





/*
========================================
Reset
========================================
*/

    reset():

    void {



        this.rendered = false;



        this.shader = null;



        this.frameIndex = 0;



        this.clear();


    }





/*
========================================
Release Resources
========================================
*/

    release():

    void {



        this.clear();



        this.shader = null;



    }





/*
========================================
Statistics
========================================
*/

    getStats()

    {


        return {


            enabled:

                this.enabled,



           rendered:

                this.rendered,



            frame:

                this.frameIndex,



            roughnessThreshold:

                this.roughnessThreshold,



            metallicThreshold:

                this.metallicThreshold



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

                "SSRMask",



            enabled:

                this.enabled,



            rendered:

                this.rendered,



            frame:

                this.frameIndex,



            roughnessThreshold:

                this.roughnessThreshold,



            metallicThreshold:

                this.metallicThreshold,



            resources:

            {


                shader:

                    this.shader !== null,



                mask:

                    this.getMaskTexture()

                        !==

                    null,



                roughness:

                    this.getRoughnessTexture()

                        !==

                    null,



                metallic:

                    this.getMetallicTexture()

                        !==

                    null,



                materialClass:

                    this.getMaterialClassTexture()

                        !==

                    null,



                reactive:

                    this.getReactiveTexture()

                        !==

                    null

            }


        };

    }


}