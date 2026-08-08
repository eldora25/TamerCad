#version 300 es

precision highp float;

in vec2 vUV;

layout(location = 0) out float FragAO;

/*
----------------------------------------
GBuffer
----------------------------------------
*/

uniform sampler2D uDepth;

uniform sampler2D uNormal;

uniform sampler2D uNoise;

/*
----------------------------------------
Kernel
----------------------------------------
*/

uniform vec3 uKernel[64];

/*
----------------------------------------
Camera
----------------------------------------
*/

uniform mat4 uProjection;

uniform mat4 uInverseProjection;

uniform vec2 uNoiseScale;

uniform float uRadius;

uniform float uBias;

uniform float uPower;

/*
========================================
Depth Reconstruction
========================================
*/

vec3 reconstructViewPosition(

    vec2 uv,

    float depth

)

{

    vec4 clip = vec4(

        uv * 2.0 - 1.0,

        depth * 2.0 - 1.0,

        1.0

    );

    vec4 view =

        uInverseProjection * clip;

    return view.xyz / view.w;

}

/*
========================================
Normal Fetch
========================================
*/

vec3 fetchNormal(

    vec2 uv

)

{

    vec3 n =

        texture(

            uNormal,

            uv

        ).xyz;

    return normalize(

        n * 2.0 - 1.0

    );

}

/*
========================================
Depth Fetch
========================================
*/

float fetchDepth(

    vec2 uv

)

{

    return texture(

        uDepth,

        uv

    ).r;

}

/*
========================================
Noise Fetch
========================================
*/

vec3 fetchNoise(

    vec2 uv

)

{

    return normalize(

        texture(

            uNoise,

            uv * uNoiseScale

        ).xyz * 2.0 - 1.0

    );

}

/*
========================================
Main
========================================
*/

void main()

{

    float depth =

        fetchDepth(vUV);

    vec3 normal =

        fetchNormal(vUV);

    vec3 position =

        reconstructViewPosition(

            vUV,

            depth

        );

    vec3 randomVector =

        fetchNoise(vUV);

    /*
        Occlusion

        sonraki bölümde
        hesaplanacak
    */

    FragAO = 1.0;

}
/*
========================================
TBN Matrix
========================================
*/

    vec3 tangent = normalize(

        randomVector -

        normal *

        dot(randomVector, normal)

    );

    vec3 bitangent = cross(

        normal,

        tangent

    );

    mat3 TBN = mat3(

        tangent,

        bitangent,

        normal

    );

/*
========================================
Kernel Sampling
========================================
*/

    float occlusion = 0.0;

    for (int i = 0; i < 64; i++) {

        vec3 sampleDirection =

            TBN * uKernel[i];

        vec3 samplePosition =

            position +

            sampleDirection *

            uRadius;
/*
========================================
Project Sample
========================================
*/

        vec4 projected =

            uProjection *

            vec4(

                samplePosition,

                1.0

            );

        projected.xyz /= projected.w;

        vec2 sampleUV =

            projected.xy * 0.5 + 0.5;

/*
========================================
Depth Compare
========================================
*/

        float sampleDepth =

            fetchDepth(

                sampleUV

            );

        vec3 sampleViewPosition =

            reconstructViewPosition(

                sampleUV,

                sampleDepth

            );

/*
========================================
Range Check
========================================
*/

        float range =

            smoothstep(

                0.0,

                1.0,

                uRadius /

                abs(

                    position.z -

                    sampleViewPosition.z

                )

            );

/*
========================================
Occlusion
========================================
*/

        if (

            sampleViewPosition.z >=

            samplePosition.z +

            uBias

        ) {

            occlusion += range;

        }

    }

    
/*
========================================
Normalize
========================================
*/

    occlusion =

        1.0 -

        (occlusion / 64.0);

/*
========================================
Power
========================================
*/

    occlusion =

        pow(

            occlusion,

            uPower

        );

    FragAO = occlusion;