
#version 300 es


precision highp float;


/*
====================================================
SSR Composite Shader
====================================================

Combines:

- SSR reflection
- Reflection probe
- Environment lighting

Features:

- Fresnel
- Metallic boost
- Roughness fade
- Energy preservation

====================================================
*/


in vec2 vUv;


out vec4 fragColor;



/*
====================================================
Inputs
====================================================
*/


uniform sampler2D uSSRTexture;


uniform sampler2D uProbeTexture;


uniform sampler2D uEnvironmentTexture;



/*
====================================================
Material Inputs
====================================================
*/


uniform sampler2D uRoughnessTexture;


uniform sampler2D uMetallicTexture;


uniform sampler2D uNormalTexture;



/*
====================================================
Camera
====================================================
*/


uniform vec3 uCameraPosition;


uniform vec3 uWorldPosition;



/*
====================================================
Parameters
====================================================
*/


uniform float uFresnelPower;


uniform float uReflectionStrength;


uniform float uRoughnessBlend;


uniform float uMetallicBoost;


const float PI =

    3.14159265359;


/*
====================================================
Normal Fetch
====================================================
*/


vec3 getNormal()

{


    vec3 normal =

        texture(

            uNormalTexture,

            vUv

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
View Direction
====================================================
*/


vec3 getViewDirection()

{


    return normalize(

        uCameraPosition -

        uWorldPosition

    );


}





/*
====================================================
Fresnel Schlick
====================================================
*/


float fresnelSchlick(

    float cosTheta,

    float baseReflectivity

)

{


    return

        baseReflectivity +

        (

            1.0 -

            baseReflectivity

        )

        *

        pow(

            1.0 -

            cosTheta,

            5.0

        );


}





/*
====================================================
Material Properties
====================================================
*/


float getRoughness()

{


    return clamp(

        texture(

            uRoughnessTexture,

            vUv

        )

        .r,

        0.0,

        1.0

    );


}





float getMetallic()

{


    return clamp(

        texture(

            uMetallicTexture,

            vUv

        )

        .r,

        0.0,

        1.0

    );


}





/*
====================================================
Reflection Base Weight
====================================================
*/


float calculateReflectionWeight()

{


    vec3 normal =

        getNormal();



    vec3 viewDir =

        getViewDirection();




    float viewDotNormal =

        max(

            dot(

                viewDir,

                normal

            ),

            0.0

        );





    float roughness =

        getRoughness();



    float metallic =

        getMetallic();





    float f0 =

        mix(

            0.04,

            1.0,

            metallic

        );





    float fresnel =

        fresnelSchlick(

            viewDotNormal,

            f0

        );





    float roughnessFade =

        1.0 -

        roughness *

        uRoughnessBlend;





    float metallicFactor =

        mix(

            1.0,

            uMetallicBoost,

            metallic

        );





    return

        fresnel *

        roughnessFade *

        metallicFactor;


}


/*
====================================================
SSR Sample
====================================================
*/


vec4 sampleSSR()

{


    return texture(

        uSSRTexture,

        vUv

    );


}





/*
====================================================
Reflection Probe Sample
====================================================
*/


vec4 sampleProbe()

{


    return texture(

        uProbeTexture,

        vUv

    );


}





/*
====================================================
Environment Sample
====================================================
*/


vec4 sampleEnvironment()

{


    return texture(

        uEnvironmentTexture,

        vUv

    );


}





/*
====================================================
SSR Confidence
====================================================
*/


float getSSRConfidence()

{


    return clamp(

        sampleSSR()

        .a,

        0.0,

        1.0

    );


}





/*
====================================================
SSR / Probe / Environment Blend
====================================================
*/


vec3 blendReflectionSources()

{


    vec4 ssr =

        sampleSSR();



    vec4 probe =

        sampleProbe();



    vec4 environment =

        sampleEnvironment();





    float confidence =

        getSSRConfidence();





    /*
        SSR varsa kullan

        yoksa probe

        sonra environment

    */



    vec3 reflection =

        mix(

            environment.rgb,

            probe.rgb,

            probe.a

        );





    reflection =

        mix(

            reflection,

            ssr.rgb,

            confidence

        );





    return reflection;


}





/*
====================================================
HDR Reflection Strength
====================================================
*/


vec3 applyReflectionStrength(

    vec3 reflection

)

{


    return

        reflection *

        uReflectionStrength;


}


/*
====================================================
GGX Distribution
====================================================
*/


float distributionGGX(

    float nDotH,

    float roughness

)

{


    float a =

        max(

            roughness,

            0.045

        );




    float a2 =

        a *

        a;




    float denom =

        PI *

        pow(

            nDotH *

            nDotH *

            (

                a2 -

                1.0

            )

            +

            1.0,

            2.0

        );





    return

        a2 /

        max(

            denom,

            0.0001

        );


}





/*
====================================================
Geometry Smith
====================================================
*/


float geometrySmith(

    float nDotV,

    float nDotL,

    float roughness

)

{


    float k =

        pow(

            roughness +

            1.0,

            2.0

        )

        /

        8.0;





    float gv =

        nDotV /

        (

            nDotV *

            (

                1.0 -

                k

            )

            +

            k

        );





    float gl =

        nDotL /

        (

            nDotL *

            (

                1.0 -

                k

            )

            +

            k

        );





    return

        gv *

        gl;


}





/*
====================================================
Specular BRDF
====================================================
*/


float calculateSpecular()

{


    vec3 normal =

        getNormal();



    vec3 viewDir =

        getViewDirection();





    vec3 lightDir =

        normalize(

            reflect(

                -viewDir,

                normal

            )

        );





    vec3 halfVector =

        normalize(

            viewDir +

            lightDir

        );





    float nDotV =

        max(

            dot(

                normal,

                viewDir

            ),

            0.001

        );





    float nDotL =

        max(

            dot(

                normal,

                lightDir

            ),

            0.001

        );





    float nDotH =

        max(

            dot(

                normal,

                halfVector

            ),

            0.0

        );





    float roughness =

        getRoughness();





    float D =

        distributionGGX(

            nDotH,

            roughness

        );





    float G =

        geometrySmith(

            nDotV,

            nDotL,

            roughness

        );





    float F =

        fresnelSchlick(

            max(

                dot(

                    viewDir,

                    halfVector

                ),

                0.0

            ),

            mix(

                0.04,

                1.0,

                getMetallic()

            )

        );





    return

        (

            D *

            G *

            F

        )

        /

        max(

            4.0 *

            nDotV *

            nDotL,

            0.001

        );


}





/*
====================================================
Energy Compensation
====================================================
*/


vec3 applyEnergyCompensation(

    vec3 reflection

)

{


    float roughness =

        getRoughness();





    float compensation =

        1.0 +

        roughness *

        0.25;





    return

        reflection *

        compensation;


}


/*
====================================================
Final Composite
====================================================
*/


vec4 finalComposite()

{


    vec3 reflection =

        blendReflectionSources();





    reflection =

        applyReflectionStrength(

            reflection

        );





    float brdf =

        calculateSpecular();





    reflection *=

        brdf;





    reflection =

        applyEnergyCompensation(

            reflection

        );





    return vec4(

        reflection,

        1.0

    );


}





/*
====================================================
Debug Output
====================================================
*/


uniform int uDebugMode;



vec4 debugComposite(

    vec4 color

)

{


    /*
        0
        normal output
    */


    if(

        uDebugMode == 1

    )

    {


        return sampleSSR();


    }





    /*
        2
        fresnel visualization
    */


    if(

        uDebugMode == 2

    )

    {


        vec3 normal =

            getNormal();



        vec3 viewDir =

            getViewDirection();





        float f =

            fresnelSchlick(

                max(

                    dot(

                        normal,

                        viewDir

                    ),

                    0.0

                ),

                0.04

            );





        return vec4(

            vec3(f),

            1.0

        );


    }





    /*
        3
        metallic
    */


    if(

        uDebugMode == 3

    )

    {


        float metallic =

            getMetallic();




        return vec4(

            vec3(

                metallic

            ),

            1.0

        );


    }





    /*
        4
        roughness
    */


    if(

        uDebugMode == 4

    )

    {


        float roughness =

            getRoughness();




        return vec4(

            vec3(

                roughness

            ),

            1.0

        );


    }





    return color;


}





/*
====================================================
HDR Clamp
====================================================
*/


vec4 finalOutput()

{


    vec4 color =

        finalComposite();





    color.rgb =

        max(

            color.rgb,

            vec3(

                0.0

            )

        );





    color.rgb =

        min(

            color.rgb,

            vec3(

                65504.0

            )

        );





    return debugComposite(

        color

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