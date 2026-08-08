import {
    Light,
    LightType,
    MaterialColor
} from "./Light";



export interface AmbientLightOptions {

    color?: MaterialColor;

    intensity?: number;

}



export class AmbientLight extends Light {


    constructor(

        name = "Ambient Light",

        options:

            AmbientLightOptions = {}

    ) {


        super(

            LightType.Ambient,

            name

        );



        if (

            options.color

        ) {

            this.color = {

                ...options.color

            };

        }



        if (

            options.intensity !== undefined

        ) {

            this.intensity =

                Math.max(

                    0,

                    options.intensity

                );

        }

    }





    setAmbientColor(

        color:

            MaterialColor

    ):void {


        this.color = {

            ...color

        };

    }





    setAmbientIntensity(

        intensity:number

    ):void {


        this.intensity =

            Math.max(

                0,

                intensity

            );

    }





    applyToShader(

        shader:any

    ):void {


        if (

            !shader

        ) {

            return;

        }



        /**
         * Ambient lighting uniform
         *
         * Shader tarafında:
         *
         * finalColor =
         * materialColor *
         * ambientLight
         */


        if (

            typeof shader.setUniform ===

            "function"

        ) {


            shader.setUniform(

                "ambientLightColor",

                this.color

            );


            shader.setUniform(

                "ambientLightIntensity",

                this.intensity

            );

        }

    }





    getLightData(){


        return {


            ...super.getLightData(),


            ambient:true

        };

    }





    clone():

    AmbientLight {


        return new AmbientLight(

            "Ambient Light Copy",

            {

                color:

                    {

                        ...this.color

                    },


                intensity:

                    this.intensity

            }

        );

    }





    toJSON(){


        return {


            ...super.toJSON()

        };

    }





    static fromJSON(

        data:any

    ):

    AmbientLight {


        return new AmbientLight(

            data.name,

            {

                color:

                    data.color,


                intensity:

                    data.intensity

            }

        );

    }

}