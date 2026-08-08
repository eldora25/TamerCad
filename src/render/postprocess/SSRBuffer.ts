
import {
    FrameBuffer,
    FrameBufferAttachment
} from "./FrameBuffer";



export interface SSRBufferOptions {


    width?:number;


    height?:number;


    colorFormat?:string;


    dataFormat?:string;


    enabled?:boolean;

}





export enum SSRBufferAttachment {



    Reflection =

        "reflection",



    HitDistance =

        "hitDistance",



    Confidence =

        "confidence",



    RayData =

        "rayData",



    Normal =

        "normal",



    Roughness =

        "roughness",



    HistoryWeight =

        "historyWeight",



    Reactive =

        "reactive",



    Blur =

        "blur"


}





export interface SSRHitData {



    distance:number;


    confidence:number;


    hit:boolean;


}





export interface SSRRayData {



    origin:any;


    direction:any;


}





export class SSRBuffer extends FrameBuffer {



    public enabled = true;



    private reflectionTexture:

        any = null;



    private hitData:

        SSRHitData | null = null;



    private rayData:

        SSRRayData | null = null;



    private frameIndex = 0;



    constructor(

        options:

            SSRBufferOptions = {}

    ){



        super({


            width:

                options.width,



            height:

                options.height,



            attachments:

                SSRBuffer.createAttachments(

                    options

                )


        });



        this.enabled =

            options.enabled ??

            this.enabled;


    }





    static createAttachments(

        options:

            SSRBufferOptions

    ):

    FrameBufferAttachment[] {



        const colorFormat =

            options.colorFormat ??

            "RGBA16F";



        const dataFormat =

            options.dataFormat ??

            "RGBA16F";



        return [


            {


                name:

                    SSRBufferAttachment.Reflection,


                type:

                    "Texture2D",


                format:

                    colorFormat,


                texture:null


            },


            {


                name:

                    SSRBufferAttachment.HitDistance,


                type:

                    "Texture2D",


                format:

                    dataFormat,


                texture:null


            },


            {


                name:

                    SSRBufferAttachment.Confidence,


                type:

                    "Texture2D",


                format:

                    "R16F",


                texture:null


            },


            {


                name:

                    SSRBufferAttachment.RayData,


                type:

                    "Texture2D",


                format:

                    dataFormat,


                texture:null


            },


            {


                name:

                    SSRBufferAttachment.Normal,


                type:

                    "Texture2D",


                format:

                    "RGBA16F",


                texture:null


            },


            {


                name:

                    SSRBufferAttachment.Roughness,


                type:

                    "Texture2D",


                format:

                    "R8",


                texture:null


            },


            {


                name:

                    SSRBufferAttachment.HistoryWeight,


                type:

                    "Texture2D",


                format:

                    "R16F",


                texture:null


            },


            {


                name:

                    SSRBufferAttachment.Reactive,


                type:

                    "Texture2D",


                format:

                    "R8",


                texture:null


            },


            {


                name:

                    SSRBufferAttachment.Blur,


                type:

                    "Texture2D",


                format:

                    colorFormat,


                texture:null


            }


        ];

    }

/*
========================================
Texture Accessors
========================================
*/

    getReflectionTexture():

    any {



        return this.getTexture(

            SSRBufferAttachment.Reflection

        );

    }





    getHitDistanceTexture():

    any {



        return this.getTexture(

            SSRBufferAttachment.HitDistance

        );

    }





    getConfidenceTexture():

    any {



        return this.getTexture(

            SSRBufferAttachment.Confidence

        );

    }





    getRayDataTexture():

    any {



        return this.getTexture(

            SSRBufferAttachment.RayData

        );

    }





    getNormalTexture():

    any {



        return this.getTexture(

            SSRBufferAttachment.Normal

        );

    }





    getRoughnessTexture():

    any {



        return this.getTexture(

            SSRBufferAttachment.Roughness

        );

    }





    getHistoryWeightTexture():

    any {



        return this.getTexture(

            SSRBufferAttachment.HistoryWeight

        );

    }





    getReactiveTexture():

    any {



        return this.getTexture(

            SSRBufferAttachment.Reactive

        );

    }





    getBlurTexture():

    any {



        return this.getTexture(

            SSRBufferAttachment.Blur

        );

    }





/*
========================================
Reflection Storage
========================================
*/

    setReflectionTexture(

        texture:any

    ):void {



        this.reflectionTexture =

            texture;


    }





    getStoredReflection():

    any {



        return this.reflectionTexture;


    }





/*
========================================
Hit Data Management
========================================
*/

    setHitData(

        data:

            SSRHitData

    ):void {



        this.hitData = {


            distance:

                data.distance,



            confidence:

                Math.max(

                    0,

                    Math.min(

                        1,

                        data.confidence

                    )

                ),



            hit:

                data.hit


        };


    }





    getHitData():

    SSRHitData | null {



        return this.hitData;


    }





    hasHit():

    boolean {



        return (

            this.hitData !== null &&

            this.hitData.hit

        );


    }





/*
========================================
Ray Data Management
========================================
*/

    setRayData(

        data:

            SSRRayData

    ):void {



        this.rayData = {


            origin:

                data.origin,



            direction:

                data.direction


        };


    }





    getRayData():

    SSRRayData | null {



        return this.rayData;


    }





/*
========================================
Confidence
========================================
*/

    setConfidence(

        value:number

    ):void {



        const attachment =

            this.getConfidenceTexture();



        /*
            GPU texture update noktası

        */



    }





    getConfidence():

    number {



        if (

            !this.hitData

        ){



            return 0;

        }



        return this.hitData.confidence;


    }

/*
========================================
Normal Data
========================================
*/

    setNormal(

        normal:any

    ):void {



        /*
            GPU texture update noktası

            Normal buffer:
            xyz -> normal
            w   -> optional data

        */


    }





    getNormal():

    any {



        return this.getNormalTexture();


    }





/*
========================================
Roughness Data
========================================
*/

    setRoughness(

        value:number

    ):void {



        /*
            Roughness texture update

            0   = smooth
            1   = rough

        */


    }





    getRoughness():

    any {



        return this.getRoughnessTexture();


    }





/*
========================================
History Weight
========================================
*/

    setHistoryWeight(

        weight:number

    ):void {



        const value =

            Math.max(

                0,

                Math.min(

                    1,

                    weight

                )

            );



        /*
            Temporal accumulation

            historyWeight texture

            update

        */


    }





    getHistoryWeight():

    any {



        return this.getHistoryWeightTexture();


    }





/*
========================================
Reactive Mask
========================================
*/

    setReactive(

        value:number

    ):void {



        const reactive =

            Math.max(

                0,

                Math.min(

                    1,

                    value

                )

            );



        /*
            Dynamic object mask

            0 = stable

            1 = reject history

        */


    }





    getReactive():

    any {



        return this.getReactiveTexture();


    }





/*
========================================
Temporal Validation Helper
========================================
*/

    validateTemporal(

        confidenceThreshold:number = 0.2

    ):boolean {



        if (

            !this.hitData

        ){



            return false;

        }





        if (

            !this.hitData.hit

        ){



            return false;

        }





        return (

            this.hitData.confidence

            >=

            confidenceThreshold

        );


    }





/*
========================================
Denoise Support
========================================
*/

    getDenoiseInput():

    any {



        return {


            reflection:

                this.getReflectionTexture(),



            normal:

                this.getNormalTexture(),



            roughness:

                this.getRoughnessTexture(),



            confidence:

                this.getConfidenceTexture(),



            hitDistance:

                this.getHitDistanceTexture()



        };


    }





/*
========================================
Resolve Support
========================================
*/

    getResolveInput():

    any {



        return {


            reflection:

                this.getReflectionTexture(),



            confidence:

                this.getConfidenceTexture(),



            historyWeight:

                this.getHistoryWeightTexture(),



            reactive:

                this.getReactiveTexture()


        };


    }

/*
========================================
Frame Lifecycle
========================================
*/

    begin():

    void {



        this.hitData =

            null;



    }





    end():

    void {



        this.frameIndex++;


    }





    getFrameIndex():

    number {



        return this.frameIndex;


    }





/*
========================================
GPU Resource Update
========================================
*/

    upload():

    void {



        /*
            GPU texture upload noktası


            Reflection

            HitData

            Confidence

            Normal

            Roughness


        */


    }





    bind():

    any {



        return {


            reflection:

                this.getReflectionTexture(),



            hitDistance:

                this.getHitDistanceTexture(),



            confidence:

                this.getConfidenceTexture(),



            normal:

                this.getNormalTexture(),



            roughness:

                this.getRoughnessTexture(),



            reactive:

                this.getReactiveTexture()


        };


    }





/*
========================================
Clear Buffer
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





        this.reflectionTexture =

            null;



        this.hitData =

            null;



        this.rayData =

            null;



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
Copy From Buffer
========================================
*/

    copyFrom(

        source:

            SSRBuffer

    ):void {



        this.reflectionTexture =

            source.getStoredReflection();



        this.hitData =

            source.getHitData();



        this.rayData =

            source.getRayData();


    }





/*
========================================
Clone State
========================================
*/

    cloneState():

    any {



        return {


            reflection:

                this.reflectionTexture,



            hitData:

                this.hitData,



            rayData:

                this.rayData,



            frame:

                this.frameIndex


        };


    }

/*
========================================
Reset
========================================
*/

    reset():

    void {



        this.clear();



        this.frameIndex =

            0;



        this.enabled =

            true;


    }





/*
========================================
Release Resources
========================================
*/

    release():

    void {



        this.clear();



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





    isEnabled():

    boolean {



        return this.enabled;


    }





/*
========================================
Statistics
========================================
*/

    getStats()

    {


        return {


            width:

                this.width,



            height:

                this.height,



            frame:

                this.frameIndex,



            enabled:

                this.enabled,



            hasReflection:

                this.reflectionTexture

                !==

                null,



            hasHit:

                this.hasHit()


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

                "SSRBuffer",



            enabled:

                this.enabled,



            size:

            {


                width:

                    this.width,



                height:

                    this.height


            },



            frame:

                this.frameIndex,



            hitData:

                this.hitData,



            rayData:

                this.rayData,



            attachments:

                this.getAttachments()

                .map(

                    attachment =>

                        attachment.name

                )



        };


    }


}