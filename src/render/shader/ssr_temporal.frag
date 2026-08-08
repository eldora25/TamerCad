
#version 300 es


precision highp float;


/*
====================================================
SSR Temporal Accumulation Shader
====================================================

Inputs:

- Current SSR frame
- Previous history frame
- Depth history
- Normal history
- Motion vectors
- Confidence


Output:

- Accumulated SSR reflection

====================================================
*/



in vec2 vUv;



out vec4 fragColor;



/*
====================================================
Textures
====================================================
*/


uniform sampler2D uCurrentSSR;


uniform sampler2D uHistorySSR;


uniform sampler2D uCurrentDepth;


uniform sampler2D uHistoryDepth;


uniform sampler2D uCurrentNormal;


uniform sampler2D uHistoryNormal;


uniform sampler2D uMotion;



/*
====================================================
Temporal Parameters
====================================================
*/


uniform float uFeedback;


uniform float uConfidenceThreshold;


uniform float uDepthThreshold;


uniform float uNormalThreshold;


uniform float uMotionThreshold;


uniform bool uHistoryValid;


/*
====================================================
Depth Rejection
====================================================
*/


float depthDifference(

    float currentDepth,

    float historyDepth

)

{


    return abs(

        currentDepth -

        historyDepth

    );


}





bool rejectDepth()

{


    float currentDepth =

        texture(

            uCurrentDepth,

            vUv

        )

        .r;




    float historyDepth =

        texture(

            uHistoryDepth,

            vUv

        )

        .r;




    return

        depthDifference(

            currentDepth,

            historyDepth

        )

        >

        uDepthThreshold;


}





/*
====================================================
Normal Rejection
====================================================
*/


float normalDifference()

{


    vec3 currentNormal =

        texture(

            uCurrentNormal,

            vUv

        )

        .xyz;



    vec3 historyNormal =

        texture(

            uHistoryNormal,

            vUv

        )

        .xyz;



    currentNormal =

        normalize(

            currentNormal * 2.0 -

            1.0

        );



    historyNormal =

        normalize(

            historyNormal * 2.0 -

            1.0

        );




    return

        1.0 -

        dot(

            currentNormal,

            historyNormal

        );


}





bool rejectNormal()

{


    return

        normalDifference()

        >

        uNormalThreshold;


}





/*
====================================================
Motion Rejection
====================================================
*/


float motionLength()

{


    vec2 motion =

        texture(

            uMotion,

            vUv

        )

        .xy;



    return length(

        motion

    );


}





bool rejectMotion()

{


    return

        motionLength()

        >

        uMotionThreshold;


}





/*
====================================================
Confidence
====================================================
*/


float calculateConfidence()

{


    vec4 current =

        texture(

            uCurrentSSR,

            vUv

        );



    float confidence =

        current.a;




    return clamp(

        confidence,

        0.0,

        1.0

    );


}


/*
====================================================
History UV Reprojection
====================================================
*/


vec2 reprojectUV()

{


    vec2 motion =

        texture(

            uMotion,

            vUv

        )

        .xy;



    return

        vUv -

        motion;


}





/*
====================================================
History Sample
====================================================
*/


vec4 sampleHistory()

{


    vec2 historyUV =

        reprojectUV();



    if (

        historyUV.x < 0.0 ||

        historyUV.x > 1.0 ||

        historyUV.y < 0.0 ||

        historyUV.y > 1.0

    )

    {


        return vec4(

            0.0

        );


    }




    return texture(

        uHistorySSR,

        historyUV

    );


}





/*
====================================================
Adaptive Feedback
====================================================
*/


float calculateFeedbackWeight(

    float confidence

)

{


    float weight =

        uFeedback;




    weight *=

        confidence;




    if (

        rejectDepth()

    )

    {


        weight =

            0.0;


    }





    if (

        rejectNormal()

    )

    {


        weight =

            0.0;


    }





    if (

        rejectMotion()

    )

    {


        weight =

            0.0;


    }





    return clamp(

        weight,

        0.0,

        1.0

    );


}





/*
====================================================
Temporal Blend
====================================================
*/


vec4 temporalBlend()

{


    vec4 current =

        texture(

            uCurrentSSR,

            vUv

        );




    vec4 history =

        sampleHistory();





    float confidence =

        calculateConfidence();





    float historyWeight =

        calculateFeedbackWeight(

            confidence

        );





    if (

        !uHistoryValid

    )

    {


        historyWeight =

            0.0;


    }





    return mix(

        current,

        history,

        historyWeight

    );


}


/*
====================================================
Neighborhood Sampling
====================================================
*/


vec3 sampleNeighborhoodAverage()

{


    vec3 sum =

        vec3(0.0);



    float count =

        0.0;




    for(

        int x = -1;

        x <= 1;

        x++

    )

    {


        for(

            int y = -1;

            y <= 1;

            y++

        )

        {


            vec2 offset =

                vec2(

                    float(x),

                    float(y)

                )

                /

                vec2(

                    1024.0,

                    1024.0

                );





            vec3 color =

                texture(

                    uCurrentSSR,

                    vUv +

                    offset

                )

                .rgb;




            sum += color;



            count += 1.0;


        }


    }





    return

        sum /

        max(

            count,

            1.0

        );


}





/*
====================================================
Variance Estimate
====================================================
*/


float estimateVariance()

{


    vec3 mean =

        sampleNeighborhoodAverage();




    vec3 center =

        texture(

            uCurrentSSR,

            vUv

        )

        .rgb;




    float variance =

        dot(

            center -

            mean,

            center -

            mean

        );




    return variance;


}





/*
====================================================
Variance Clamp
====================================================
*/


vec3 clampHistory(

    vec3 historyColor

)

{


    vec3 average =

        sampleNeighborhoodAverage();




    float variance =

        estimateVariance();




    float limit =

        sqrt(

            variance +

            0.0001

        );





    return clamp(

        historyColor,

        average -

        limit,

        average +

        limit

    );


}





/*
====================================================
Final Temporal Resolve
====================================================
*/


vec4 resolveTemporal()

{


    vec4 current =

        texture(

            uCurrentSSR,

            vUv

        );




    vec4 blended =

        temporalBlend();





    blended.rgb =

        clampHistory(

            blended.rgb

        );





    return blended;


}






/*
====================================================
Debug Modes
====================================================
*/


uniform int uDebugMode;



vec4 debugOutput(

    vec4 result

)

{


    if (

        uDebugMode == 1

    )

    {


        float weight =

            calculateFeedbackWeight(

                calculateConfidence()

            );




        return vec4(

            vec3(weight),

            1.0

        );


    }





    if (

        uDebugMode == 2

    )

    {


        float confidence =

            calculateConfidence();




        return vec4(

            vec3(confidence),

            1.0

        );


    }





    if (

        uDebugMode == 3

    )

    {


        vec2 motion =

            texture(

                uMotion,

                vUv

            )

            .xy;




        return vec4(

            abs(

                motion.x

            ),

            abs(

                motion.y

            ),

            0.0,

            1.0

        );


    }





    return result;


}





/*
====================================================
Optimized Resolve
====================================================
*/


vec4 finalResolve()

{


    vec4 result =

        resolveTemporal();




    /*
        HDR clamp

        NaN / Inf önleme

    */


    result.rgb =

        max(

            result.rgb,

            vec3(

                0.0

            )

        );




    result.rgb =

        min(

            result.rgb,

            vec3(

                65504.0

            )

        );





    return debugOutput(

        result

    );


}





/*
====================================================
Final Entry
====================================================
*/


void main()

{


    fragColor =

        finalResolve();


}
