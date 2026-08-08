
import {
    FrameBuffer,
    FrameBufferAttachment
} from "./FrameBuffer";





export interface SSRHistoryBufferOptions {


    width?:number;


    height?:number;


    format?:string;


    historyCount?:number;


    enabled?:boolean;


}





export enum SSRHistoryAttachment {


    Reflection =

        "reflection",



    Confidence =

        "confidence",



    HitDistance =

        "hitDistance",



    Depth =

        "depth",



    Normal =

        "normal",



    Motion =

        "motion",



    Validity =

        "validity"



}





export interface SSRHistoryFrame {


    index:number;


    reflection:any;


    confidence:any;


    hitDistance:any;


    depth:any;


    normal:any;


    motion:any;


    valid:boolean;


}





export class SSRHistoryBuffer extends FrameBuffer {



    public enabled = true;



    /**
     * Ping pong index
     */
    private historyIndex = 0;



    /**
     * Tutulan frame sayısı
     */
    public historyCount = 2;



    /**
     * Current frame
     */
    public frameIndex = 0;



    private historyFrames:

        SSRHistoryFrame[] = [];



    constructor(

        options:

            SSRHistoryBufferOptions = {}

    ){



        super({


            width:

                options.width,



            height:

                options.height,



            attachments:

                SSRHistoryBuffer.createAttachments(

                    options

                )


        });



        if (

            options.historyCount !== undefined

        ){



            this.historyCount = Math.max(

                2,

                options.historyCount

            );


        }





        if (

            options.enabled !== undefined

        ){



            this.enabled =

                options.enabled;


        }



    }





    static createAttachments(

        options:

            SSRHistoryBufferOptions

    ):

    FrameBufferAttachment[] {



        const format =

            options.format ??

            "RGBA16F";



        return [


            {


                name:

                    SSRHistoryAttachment.Reflection,


                type:

                    "Texture2D",


                format,


                texture:null


            },


            {


                name:

                    SSRHistoryAttachment.Confidence,


                type:

                    "Texture2D",


                format:

                    "R16F",


                texture:null


            },


            {


                name:

                    SSRHistoryAttachment.HitDistance,


                type:

                    "Texture2D",


                format:

                    "R16F",


                texture:null


            },


            {


                name:

                    SSRHistoryAttachment.Depth,


                type:

                    "Texture2D",


                format:

                    "R32F",


                texture:null


            },


            {


                name:

                    SSRHistoryAttachment.Normal,


                type:

                    "Texture2D",


                format:

                    "RGBA16F",


                texture:null


            },


            {


                name:

                    SSRHistoryAttachment.Motion,


                type:

                    "Texture2D",


                format:

                    "RG16F",


                texture:null


            },


            {


                name:

                    SSRHistoryAttachment.Validity,


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
History Frame Creation
========================================
*/

    private createHistory():

    void {



        this.historyFrames = [];





        for (

            let i = 0;

            i < this.historyCount;

            i++

        ){



            this.historyFrames.push({


                index:

                    i,



                reflection:

                    null,



                confidence:

                    null,



                hitDistance:

                    null,



                depth:

                    null,



                normal:

                    null,



                motion:

                    null,



                valid:

                    false



            });


        }


    }





/*
========================================
Initialization
========================================
*/

    override initialize(

        context:any

    ):void {



        super.initialize(

            context

        );



        this.createHistory();


    }





/*
========================================
Current History
========================================
*/

    getCurrentHistory():

    SSRHistoryFrame {



        return this.historyFrames[

            this.historyIndex

        ];

    }





/*
========================================
Previous History
========================================
*/

    getPreviousHistory():

    SSRHistoryFrame {



        const index =

            (

                this.historyIndex -

                1 +

                this.historyCount

            )

            %

            this.historyCount;



        return this.historyFrames[index];

    }





/*
========================================
History By Index
========================================
*/

    getHistory(

        index:number

    ):

    SSRHistoryFrame | null {



        if (

            index < 0 ||

            index >=

            this.historyFrames.length

        ){



            return null;

        }





        return this.historyFrames[index];


    }





/*
========================================
GPU Texture Access
========================================
*/

    getReflectionTexture():

    any {



        return this.getTexture(

            SSRHistoryAttachment.Reflection

        );


    }





    getConfidenceTexture():

    any {



        return this.getTexture(

            SSRHistoryAttachment.Confidence

        );


    }





    getHitDistanceTexture():

    any {



        return this.getTexture(

            SSRHistoryAttachment.HitDistance

        );


    }





    getDepthTexture():

    any {



        return this.getTexture(

            SSRHistoryAttachment.Depth

        );


    }





    getNormalTexture():

    any {



        return this.getTexture(

            SSRHistoryAttachment.Normal

        );


    }





    getMotionTexture():

    any {



        return this.getTexture(

            SSRHistoryAttachment.Motion

        );


    }





    getValidityTexture():

    any {



        return this.getTexture(

            SSRHistoryAttachment.Validity

        );


    }





/*
========================================
Store Current Frame
========================================
*/

    storeCurrent(

        data:

            Partial<SSRHistoryFrame>

    ):void {



        const current =

            this.getCurrentHistory();





        Object.assign(

            current,

            data

        );



        current.valid =

            true;


    }

/*
========================================
History Data Setters
========================================
*/

    setReflectionHistory(

        texture:any

    ):void {



        this.getCurrentHistory()

            .reflection =

                texture;


    }





    setConfidenceHistory(

        texture:any

    ):void {



        this.getCurrentHistory()

            .confidence =

                texture;


    }





    setHitDistanceHistory(

        texture:any

    ):void {



        this.getCurrentHistory()

            .hitDistance =

                texture;


    }





    setDepthHistory(

        texture:any

    ):void {



        this.getCurrentHistory()

            .depth =

                texture;


    }





    setNormalHistory(

        texture:any

    ):void {



        this.getCurrentHistory()

            .normal =

                texture;


    }





    setMotionHistory(

        texture:any

    ):void {



        this.getCurrentHistory()

            .motion =

                texture;


    }





/*
========================================
History Validation
========================================
*/

    invalidateHistory():

    void {



        for (

            const frame of

            this.historyFrames

        ){



            frame.valid =

                false;


        }


    }





    validateHistory():

    boolean {



        const previous =

            this.getPreviousHistory();





        return (

            previous !== null &&

            previous.valid

        );


    }





    hasPrevious():

    boolean {



        return this.validateHistory();


    }





/*
========================================
Temporal Rejection
========================================
*/

    rejectByDepth(

        currentDepth:number,

        historyDepth:number,

        threshold:number = 0.01

    ):boolean {



        return Math.abs(

            currentDepth -

            historyDepth

        )

        >

        threshold;


    }





    rejectByNormal(

        currentNormal:any,

        historyNormal:any,

        threshold:number = 0.15

    ):boolean {



        if (

            !currentNormal ||

            !historyNormal

        ){



            return true;


        }





        const dot =

            currentNormal.x *

            historyNormal.x

            +

            currentNormal.y *

            historyNormal.y

            +

            currentNormal.z *

            historyNormal.z;





        return (

            dot <

            1 -

            threshold

        );


    }





    rejectByMotion(

        motion:any,

        threshold:number = 0.5

    ):boolean {



        if (

            !motion

        ){



            return true;


        }





        const length =

            Math.sqrt(

                motion.x *

                motion.x

                +

                motion.y *

                motion.y

            );





        return (

            length >

            threshold

        );


    }





/*
========================================
Temporal Acceptance
========================================
*/

    canReuseHistory(

        current:any

    ):boolean {



        if (

            !this.enabled

        ){



            return false;


        }





        if (

            !this.hasPrevious()

        ){



            return false;


        }





        const previous =

            this.getPreviousHistory();





        if (

            !previous.reflection

        ){



            return false;


        }





        return true;


    }





/*
========================================
History Weight
========================================
*/

    calculateHistoryWeight(

        confidence:number,

        reactive:number

    ):number {



        let weight =

            confidence;





        weight *=

            (

                1 -

                reactive

            );





        return Math.max(

            0,

            Math.min(

                1,

                weight

            )

        );


    }

/*
========================================
Swap Ping Pong History
========================================
*/

    swap():

    void {



        this.historyIndex =

            (

                this.historyIndex +

                1

            )

            %

            this.historyCount;





        this.frameIndex++;



        const current =

            this.getCurrentHistory();



        current.valid =

            false;


    }





/*
========================================
Frame Update
========================================
*/

    update():

    void {



        if (

            !this.enabled

        ){



            return;


        }





        const current =

            this.getCurrentHistory();





        current.valid =

            true;


    }





/*
========================================
Copy History Frame
========================================
*/

    copyHistory(

        source:

            SSRHistoryFrame

    ):void {



        const current =

            this.getCurrentHistory();





        current.reflection =

            source.reflection;





        current.confidence =

            source.confidence;





        current.hitDistance =

            source.hitDistance;





        current.depth =

            source.depth;





        current.normal =

            source.normal;





        current.motion =

            source.motion;





        current.valid =

            source.valid;


    }





/*
========================================
Frame Lifecycle
========================================
*/

    beginFrame():

    void {



        const current =

            this.getCurrentHistory();





        current.valid =

            false;


    }





    endFrame():

    void {



        this.swap();


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





        this.reset();


    }





/*
========================================
Clear GPU Data
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





        for (

            const frame of

            this.historyFrames

        ){



            frame.reflection =

                null;



            frame.confidence =

                null;



            frame.hitDistance =

                null;



            frame.depth =

                null;



            frame.normal =

                null;



            frame.motion =

                null;



            frame.valid =

                false;


        }


    }





/*
========================================
Bind For Temporal Pass
========================================
*/

    bindTemporal():

    any {



        const previous =

            this.getPreviousHistory();





        const current =

            this.getCurrentHistory();





        return {


            current,



            previous,



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



        this.historyIndex =

            0;



        this.frameIndex =

            0;





        for (

            const frame of

            this.historyFrames

        ){



            frame.reflection =

                null;



            frame.confidence =

                null;



            frame.hitDistance =

                null;



            frame.depth =

                null;



            frame.normal =

                null;



            frame.motion =

                null;



            frame.valid =

                false;


        }


    }





/*
========================================
Release Resources
========================================
*/

    release():

    void {



        this.clear();



        this.historyFrames = [];


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





    setHistoryCount(

        count:number

    ):void {



        this.historyCount =

            Math.max(

                2,

                count

            );



        this.createHistory();


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



            frame:

                this.frameIndex,



            historyIndex:

                this.historyIndex,



            historyCount:

                this.historyCount,



            validFrames:

                this.historyFrames

                .filter(

                    frame =>

                        frame.valid

                )

                .length


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

                "SSRHistoryBuffer",



            enabled:

                this.enabled,



            frameIndex:

                this.frameIndex,



            historyIndex:

                this.historyIndex,



            historyCount:

                this.historyCount,



            size:

            {


                width:

                    this.width,



                height:

                    this.height


            },



            current:

            {


                index:

                    this.getCurrentHistory()

                    .index,



                valid:

                    this.getCurrentHistory()

                    .valid


            },



            previous:

            {


                index:

                    this.getPreviousHistory()

                    .index,



                valid:

                    this.getPreviousHistory()

                    .valid


            }


        };


    }


}