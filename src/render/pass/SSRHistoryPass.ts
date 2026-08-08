import {
    SSRBuffer
} from "../postprocess/SSRBuffer";


import {
    SSRHistoryBuffer
} from "../postprocess/SSRHistoryBuffer";


import {
    FrameBuffer
} from "../postprocess/FrameBuffer";



export interface SSRHistoryPassOptions {


    feedback?: number;


    confidenceThreshold?: number;


    depthThreshold?: number;


    normalThreshold?: number;


    motionThreshold?: number;


    enabled?: boolean;


}




export enum SSRHistoryPassMode {


    Replace =

        "Replace",


    Accumulate =

        "Accumulate",


    Adaptive =

        "Adaptive"


}




export interface SSRHistorySample {


    reflection:any;


    confidence:number;


    hitDistance:number;


    depth?:number;


    normal?:any;


    motion?:any;


}






export interface SSRHistoryValidation {


    valid:boolean;


    depthValid:boolean;


    normalValid:boolean;


    motionValid:boolean;


}







export class SSRHistoryPass {



    public enabled = true;



    /**
     * Temporal feedback strength
     */
    public feedback = 0.92;



    /**
     * Minimum history confidence
     */
    public confidenceThreshold = 0.2;



    /**
     * Depth rejection
     */
    public depthThreshold = 0.01;



    /**
     * Normal rejection
     */
    public normalThreshold = 0.15;



    /**
     * Motion rejection
     */
    public motionThreshold = 0.5;




    public mode:

        SSRHistoryPassMode =

        SSRHistoryPassMode.Adaptive;





    private ssrBuffer:

        SSRBuffer | null = null;




    private historyBuffer:

        SSRHistoryBuffer | null = null;




    private output:

        FrameBuffer | null = null;




    private frameIndex = 0;




    private initialized = false;




    constructor(

        options:

            SSRHistoryPassOptions = {}

    ){



        if(

            options.feedback !== undefined

        ){


            this.feedback =

                options.feedback;


        }





        if(

            options.confidenceThreshold !== undefined

        ){


            this.confidenceThreshold =

                options.confidenceThreshold;


        }





        if(

            options.depthThreshold !== undefined

        ){


            this.depthThreshold =

                options.depthThreshold;


        }





        if(

            options.normalThreshold !== undefined

        ){


            this.normalThreshold =

                options.normalThreshold;


        }





        if(

            options.motionThreshold !== undefined

        ){


            this.motionThreshold =

                options.motionThreshold;


        }





        if(

            options.enabled !== undefined

        ){


            this.enabled =

                options.enabled;


        }


    }


/*
====================================================
Buffer Binding
====================================================
*/


setSSRBuffer(

    buffer:

        SSRBuffer

):

void {


    this.ssrBuffer =

        buffer;


}





setHistoryBuffer(

    buffer:

        SSRHistoryBuffer

):

void {


    this.historyBuffer =

        buffer;


}





setOutput(

    output:

        FrameBuffer

):

void {


    this.output =

        output;


}





/*
====================================================
Initialization
====================================================
*/


initialize():

void {



    if(

        this.initialized

    ){


        return;


    }





    if(

        !this.historyBuffer

    ){


        throw new Error(

            "SSRHistoryPass requires SSRHistoryBuffer"

        );


    }





    if(

        this.ssrBuffer

    ){


        this.historyBuffer.resize(

            this.ssrBuffer.width,

            this.ssrBuffer.height

        );


    }





    this.initialized =

        true;


}





/*
====================================================
Frame Begin
====================================================
*/


begin():

void {


    if(

        !this.enabled

    ){


        return;


    }





    if(

        !this.initialized

    ){


        this.initialize();


    }





    this.historyBuffer

        ?.beginFrame();


}





/*
====================================================
Frame End
====================================================
*/


end():

void {


    if(

        !this.enabled

    ){


        return;


    }





    this.historyBuffer

        ?.endFrame();





    this.historyBuffer

        ?.swap();





    this.frameIndex++;


}





/*
====================================================
History Access
====================================================
*/


getPreviousHistory():

any {


    if(

        !this.historyBuffer

    ){


        return null;


    }





    return this.historyBuffer

        .getPreviousHistory();


}





getCurrentHistory():

any {


    if(

        !this.historyBuffer

    ){


        return null;


    }





    return this.historyBuffer

        .getCurrentHistory();


}





hasHistory():

boolean {


    return (

        this.historyBuffer

            ?

            this.historyBuffer.hasPrevious()

            :

            false

    );


}


/*
====================================================
Feedback Calculation
====================================================
*/


private calculateFeedback(

    confidence:number

):

number {


    if(

        confidence <

        this.confidenceThreshold

    ){


        return 0;


    }





    return Math.max(

        0,

        Math.min(

            1,

            this.feedback *

            confidence

        )

    );


}





/*
====================================================
Depth Rejection
====================================================
*/


private rejectDepth(

    currentDepth:number,

    historyDepth:number

):

boolean {



    return (

        Math.abs(

            currentDepth -

            historyDepth

        )

        >

        this.depthThreshold

    );


}





/*
====================================================
Normal Rejection
====================================================
*/


private rejectNormal(

    currentNormal:any,

    historyNormal:any

):

boolean {



    if(

        !currentNormal ||

        !historyNormal

    ){


        return true;


    }





    const similarity =

        currentNormal.x *

        historyNormal.x

        +

        currentNormal.y *

        historyNormal.y

        +

        currentNormal.z *

        historyNormal.z;





    return (

        similarity <

        1 -

        this.normalThreshold

    );


}





/*
====================================================
Motion Rejection
====================================================
*/


private rejectMotion(

    motion:any

):

boolean {



    if(

        !motion

    ){


        return true;


    }





    const velocity =

        Math.sqrt(

            motion.x *

            motion.x

            +

            motion.y *

            motion.y

        );





    return (

        velocity >

        this.motionThreshold

    );


}





/*
====================================================
History Validation
====================================================
*/


validateHistory(

    sample:

        SSRHistorySample,

    history:any

):

SSRHistoryValidation {



    let depthValid = true;


    let normalValid = true;


    let motionValid = true;





    if(

        sample.depth !== undefined &&

        history.depth !== undefined

    ){


        depthValid =

            !this.rejectDepth(

                sample.depth,

                history.depth

            );


    }





    if(

        sample.normal &&

        history.normal

    ){


        normalValid =

            !this.rejectNormal(

                sample.normal,

                history.normal

            );


    }





    if(

        sample.motion

    ){


        motionValid =

            !this.rejectMotion(

                sample.motion

            );


    }





    return {


        valid:

            depthValid &&

            normalValid &&

            motionValid,



        depthValid,



        normalValid,



        motionValid


    };


}





/*
====================================================
Confidence Adaptation
====================================================
*/


private calculateConfidence(

    sample:

        SSRHistorySample

):

number {



    let confidence =

        sample.confidence;





    /*
        Uzak hit noktaları
        daha düşük güvenilirlik
    */


    if(

        sample.hitDistance >

        50

    ){


        confidence *=

            0.5;


    }





    return Math.max(

        0,

        Math.min(

            1,

            confidence

        )

    );


}


/*
====================================================
History Blend
====================================================
*/


private blendHistory(

    current:any,

    history:any,

    weight:number

):

any {


    if(

        !history ||

        weight <= 0

    ){


        return current;


    }





    return {


        type:

            "SSRTemporalBlend",



        current,



        history,



        weight


    };


}





/*
====================================================
Temporal Accumulation
====================================================
*/


accumulate(

    sample:

        SSRHistorySample

):

any {



    if(

        !this.historyBuffer

    ){


        return sample.reflection;


    }





    const previous =

        this.getPreviousHistory();





    let weight =

        this.calculateFeedback(

            sample.confidence

        );





    switch(

        this.mode

    ){



        case SSRHistoryPassMode.Replace:


            weight = 0;


            break;





        case SSRHistoryPassMode.Accumulate:


            weight =

                this.feedback;


            break;





        case SSRHistoryPassMode.Adaptive:


            break;


    }





    const result =

        this.blendHistory(

            sample.reflection,

            previous?.reflection,

            weight

        );





    return result;


}





/*
====================================================
Temporal Resolve
====================================================
*/


resolveTemporal(

    sample:

        SSRHistorySample,

    validation:

        boolean = true

):

any {



    if(

        !this.historyBuffer

    ){


        return sample.reflection;


    }





    if(

        !validation

    ){


        this.historyBuffer

            .invalidateHistory();





        return sample.reflection;


    }





    return this.accumulate(

        sample

    );


}





/*
====================================================
Write History
====================================================
*/


writeHistory(

    reflection:any,

    confidence:number,

    hitDistance:number,

    extra:any = {}

):

void {



    if(

        !this.historyBuffer

    ){


        return;


    }





    this.historyBuffer

        .storeCurrent({

            reflection,


            confidence,


            hitDistance,



            ...extra


        });


}





/*
====================================================
Execute
====================================================
*/


execute(

    sample:

        SSRHistorySample

):

any {



    if(

        !this.enabled

    ){


        return sample.reflection;


    }





    if(

        !this.initialized

    ){


        this.initialize();


    }





    const confidence =

        this.calculateConfidence(

            sample

        );





    const history =

        this.getPreviousHistory();





    const validation =

        this.validateHistory(

            sample,

            history

        );





    const result =

        this.resolveTemporal(

            {


                reflection:

                    sample.reflection,



                confidence,



                hitDistance:

                    sample.hitDistance,



                depth:

                    sample.depth,



                normal:

                    sample.normal,



                motion:

                    sample.motion


            },

            validation.valid

        );





    this.writeHistory(

        result,

        confidence,

        sample.hitDistance,

        {


            depth:

                sample.depth,


            normal:

                sample.normal


        }


    );





    return {


        type:

            "SSRHistoryResult",



        reflection:

            result,



        confidence,



        validation,



        frame:

            this.frameIndex


    };


}





/*
====================================================
Render From SSR Buffer
====================================================
*/


render():

any {



    if(

        !this.ssrBuffer

    ){


        return null;


    }





    const sample:

        SSRHistorySample = {



            reflection:

                this.ssrBuffer

                    .getReflectionTexture(),



            confidence:

                1.0,



            hitDistance:

                0



        };





    return this.execute(

        sample

    );


}


/*
====================================================
Resize
====================================================
*/


resize(

    width:number,

    height:number

):

void {



    this.output

        ?.resize(

            width,

            height

        );





    this.historyBuffer

        ?.resize(

            width,

            height

        );


}





/*
====================================================
Clear
====================================================
*/


clear():

void {



    this.ssrBuffer =

        null;



    this.output =

        null;





    this.historyBuffer

        ?.clear();


}





/*
====================================================
Reset
====================================================
*/


reset():

void {



    this.frameIndex =

        0;



    this.initialized =

        false;





    this.historyBuffer

        ?.reset();


}





/*
====================================================
Release
====================================================
*/


release():

void {



    this.clear();





    this.historyBuffer

        ?.release();


}





/*
====================================================
Mode Control
====================================================
*/


setMode(

    mode:

        SSRHistoryPassMode

):

void {


    this.mode =

        mode;


}





getMode():

SSRHistoryPassMode {


    return this.mode;


}





/*
====================================================
Enable Control
====================================================
*/


setEnabled(

    enabled:boolean

):

void {


    this.enabled =

        enabled;


}





isEnabled():

boolean {


    return this.enabled;


}





/*
====================================================
Feedback Control
====================================================
*/


setFeedback(

    value:number

):

void {



    this.feedback =

        Math.max(

            0,

            Math.min(

                1,

                value

            )

        );


}





getFeedback():

number {


    return this.feedback;


}





/*
====================================================
Confidence Threshold
====================================================
*/


setConfidenceThreshold(

    value:number

):

void {


    this.confidenceThreshold =

        Math.max(

            0,

            Math.min(

                1,

                value

            )

        );


}





getConfidenceThreshold():

number {


    return this.confidenceThreshold;


}





/*
====================================================
Frame Information
====================================================
*/


getFrameIndex():

number {


    return this.frameIndex;


}


/*
====================================================
Validation
====================================================
*/


validate():

boolean {


    if(

        !this.enabled

    ){


        return false;


    }





    if(

        !this.ssrBuffer

    ){


        return false;


    }





    if(

        !this.historyBuffer

    ){


        return false;


    }





    return true;


}





/*
====================================================
Statistics
====================================================
*/


getStats()

{


    return {


        type:

            "SSRHistoryPass",



        enabled:

            this.enabled,



        initialized:

            this.initialized,



        mode:

            this.mode,



        feedback:

            this.feedback,



        confidenceThreshold:

            this.confidenceThreshold,



        depthThreshold:

            this.depthThreshold,



        normalThreshold:

            this.normalThreshold,



        motionThreshold:

            this.motionThreshold,



        frame:

            this.frameIndex,



        hasHistory:

            this.hasHistory()



    };


}





/*
====================================================
Debug Information
====================================================
*/


debugInfo()

{


    return {


        type:

            "SSRHistoryPass",



        mode:

            this.mode,



        enabled:

            this.enabled,



        frameIndex:

            this.frameIndex,



        initialized:

            this.initialized,



        parameters:

            {


                feedback:

                    this.feedback,



                confidenceThreshold:

                    this.confidenceThreshold,



                depthThreshold:

                    this.depthThreshold,



                normalThreshold:

                    this.normalThreshold,



                motionThreshold:

                    this.motionThreshold


            },



        buffers:

            {


                ssr:

                    this.ssrBuffer !== null,



                history:

                    this.historyBuffer !== null,



                output:

                    this.output !== null


            },



        history:

            this.historyBuffer

                ?.debugInfo()


    };


}





/*
====================================================
Dispose Alias
====================================================
*/


dispose():

void {


    this.release();


}


}