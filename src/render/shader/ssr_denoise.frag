
#version 300 es


precision highp float;


/*
====================================================
SSR Denoise Shader
====================================================

Bilateral / Edge Aware SSR filtering

Inputs:

- Temporal SSR
- Depth
- Normal
- Roughness


Output:

- Filtered reflection

====================================================
*/


in vec2 vUv;


out vec4 fragColor;



/*
====================================================
Textures
====================================================
*/


uniform sampler2D uSSRTexture;


uniform sampler2D uDepthTexture;


uniform sampler2D uNormalTexture;


uniform sampler2D uRoughnessTexture;



/*
====================================================
Parameters
====================================================
*/


uniform float uRadius;


uniform float uDepthThreshold;


uniform float uNormalThreshold;


uniform float uSharpness;


uniform vec2 uResolution;



/*
====================================================
Kernel
====================================================
*/


const float PI =

    3.14159265359;


/*
====================================================
Gaussian Weight
====================================================
*/


float gaussianWeight(

    float distance,

    float sigma

)

{


    return exp(

        -(

            distance *

            distance

        )

        /

        (

            2.0 *

            sigma *

            sigma

        )

    );


}





/*
====================================================
Depth Edge Weight
====================================================
*/


float depthWeight(

    float currentDepth,

    float sampleDepth

)

{


    float diff =

        abs(

            currentDepth -

            sampleDepth

        );




    return exp(

        -

        diff /

        max(

            uDepthThreshold,

            0.0001

        )

    );


}





/*
====================================================
Normal Edge Weight
====================================================
*/


float normalWeight(

    vec3 currentNormal,

    vec3 sampleNormal

)

{


    float similarity =

        max(

            dot(

                currentNormal,

                sampleNormal

            ),

            0.0

        );




    return pow(

        similarity,

        32.0

    );


}





/*
====================================================
Fetch Normal
====================================================
*/


vec3 fetchNormal(

    vec2 uv

)

{


    vec3 normal =

        texture(

            uNormalTexture,

            uv

        )

        .xyz;



    return normalize(

        normal *

        2.0 -

        1.0

    );


}





/*
====================================================
Fetch Depth
====================================================
*/


float fetchDepth(

    vec2 uv

)

{


    return texture(

        uDepthTexture,

        uv

    )

    .r;


}





/*
====================================================
Combined Bilateral Weight
====================================================
*/


float bilateralWeight(

    vec2 offset

)

{


    vec2 uv =

        vUv +

        offset;



    float centerDepth =

        fetchDepth(

            vUv

        );



    float sampleDepth =

        fetchDepth(

            uv

        );




    vec3 centerNormal =

        fetchNormal(

            vUv

        );



    vec3 sampleNormal =

        fetchNormal(

            uv

        );





    float spatial =

        gaussianWeight(

            length(

                offset

            ),

            uRadius

        );





    float depth =

        depthWeight(

            centerDepth,

            sampleDepth

        );





    float normal =

        normalWeight(

            centerNormal,

            sampleNormal

        );





    return

        spatial *

        depth *

        normal;


}


/*
====================================================
Roughness Adaptive Radius
====================================================
*/


float getAdaptiveRadius()

{


    float roughness =

        texture(

            uRoughnessTexture,

            vUv

        )

        .r;




    /*
        Rough yüzeylerde

        daha geniş blur

    */


    return

        mix(

            1.0,

            uRadius,

            roughness

        );


}





/*
====================================================
SSR Sample Fetch
====================================================
*/


vec4 fetchSSR(

    vec2 uv

)

{


    return texture(

        uSSRTexture,

        uv

    );


}





/*
====================================================
Kernel Accumulation
====================================================
*/


vec4 bilateralFilter()

{


    vec4 result =

        vec4(

            0.0

        );




    float totalWeight =

        0.0;





    float radius =

        getAdaptiveRadius();





    int kernelSize =

        int(

            radius

        );





    for(

        int x =

            -3;

        x <= 3;

        x++

    )

    {


        for(

            int y =

                -3;

            y <= 3;

            y++

        )

        {



            if(

                abs(x) >

                kernelSize

                ||

                abs(y) >

                kernelSize

            )

            {

                continue;

            }





            vec2 offset =

                vec2(

                    float(x),

                    float(y)

                )

                *

                uResolution;





            float weight =

                bilateralWeight(

                    offset

                );





            vec4 sampleColor =

                fetchSSR(

                    vUv +

                    offset

                );





            result +=

                sampleColor *

                weight;





            totalWeight +=

                weight;


        }


    }





    return

        result /

        max(

            totalWeight,

            0.0001

        );


}





/*
====================================================
Roughness Fade
====================================================
*/


vec4 applyRoughnessFade(

    vec4 reflection

)

{


    float roughness =

        texture(

            uRoughnessTexture,

            vUv

        )

        .r;




    float fade =

        1.0 -

        roughness;





    reflection.rgb *=

        fade;




    return reflection;


}


/*
====================================================
Firefly Suppression
====================================================
*/


vec3 suppressFireflies(

    vec3 color

)

{


    vec3 neighborhood =

        bilateralFilter()

        .rgb;



    float brightness =

        dot(

            color,

            vec3(

                0.2126,

                0.7152,

                0.0722

            )

        );




    float neighborBrightness =

        dot(

            neighborhood,

            vec3(

                0.2126,

                0.7152,

                0.0722

            )

        );




    float limit =

        neighborBrightness *

        2.5;




    if(

        brightness >

        limit

    )

    {


        return mix(

            color,

            neighborhood,

            0.75

        );


    }





    return color;


}





/*
====================================================
Reflection Confidence
====================================================
*/


float calculateConfidence()

{


    vec4 ssr =

        texture(

            uSSRTexture,

            vUv

        );




    return clamp(

        ssr.a,

        0.0,

        1.0

    );


}





/*
====================================================
Confidence Preserve
====================================================
*/


vec4 preserveConfidence(

    vec4 color

)

{


    float confidence =

        calculateConfidence();




    color.a =

        confidence;




    return color;


}





/*
====================================================
Final Denoise Resolve
====================================================
*/


vec4 resolveDenoise()

{


    vec4 filtered =

        bilateralFilter();




    filtered.rgb =

        suppressFireflies(

            filtered.rgb

        );





    filtered =

        applyRoughnessFade(

            filtered

        );





    filtered =

        preserveConfidence(

            filtered

        );





    return filtered;


}


/*
====================================================
Debug
====================================================
*/


uniform int uDebugMode;



vec4 debugOutput(

    vec4 result

)

{


    /*
        0:
        Normal output
    */


    if(

        uDebugMode == 1

    )

    {


        float confidence =

            calculateConfidence();



        return vec4(

            vec3(

                confidence

            ),

            1.0

        );


    }





    /*
        2:
        Roughness visualization
    */


    if(

        uDebugMode == 2

    )

    {


        float roughness =

            texture(

                uRoughnessTexture,

                vUv

            )

            .r;




        return vec4(

            vec3(

                roughness

            ),

            1.0

        );


    }





    /*
        3:
        Normal visualization
    */


    if(

        uDebugMode == 3

    )

    {


        vec3 normal =

            fetchNormal(

                vUv

            );




        return vec4(

            normal *

            0.5 +

            0.5,

            1.0

        );


    }





    /*
        4:
        Depth visualization
    */


    if(

        uDebugMode == 4

    )

    {


        float depth =

            fetchDepth(

                vUv

            );




        return vec4(

            vec3(

                depth

            ),

            1.0

        );


    }





    return result;


}





/*
====================================================
HDR Safety Clamp
====================================================
*/


vec4 finalOutput()

{


    vec4 result =

        resolveDenoise();





    result.rgb =

        max(

            result.rgb,

            vec3(

                0.0

            )

        );





    /*
        FP16 max range

    */


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
Main
====================================================
*/


void main()

{


    fragColor =

        finalOutput();


}
