#version 300 es

precision highp float;

in vec2 vUV;

layout(location = 0) out float FragAO;

/*
----------------------------------------
Textures
----------------------------------------
*/

uniform sampler2D uSSAO;

uniform sampler2D uDepth;

/*
----------------------------------------
Settings
----------------------------------------
*/

uniform vec2 uTexelSize;

uniform float uDepthThreshold;

/*
========================================
Main
========================================
*/

void main()

{

    float centerDepth =

        texture(

            uDepth,

            vUV

        ).r;

    float result = 0.0;

    float weightSum = 0.0;

    for (

        int x = -2;

        x <= 2;

        x++

    ) {

        for (

            int y = -2;

            y <= 2;

            y++

        ) {

            vec2 offset =

                vec2(

                    float(x),

                    float(y)

                ) *

                uTexelSize;

            vec2 uv =

                vUV + offset;

            float sampleDepth =

                texture(

                    uDepth,

                    uv

                ).r;

            float sampleAO =

                texture(

                    uSSAO,

                    uv

                ).r;

            float diff =

                abs(

                    sampleDepth -

                    centerDepth

                );

            float weight =

                1.0 -

                smoothstep(

                    0.0,

                    uDepthThreshold,

                    diff

                );

            result +=

                sampleAO * weight;

            weightSum += weight;

        }

    }

    if (

        weightSum > 0.0

    ) {

        result /= weightSum;

    }

    FragAO = result;

}