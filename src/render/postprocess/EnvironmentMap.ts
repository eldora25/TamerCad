export interface EnvironmentMapOptions {


    format?: string;


    intensity?: number;


    rotation?: number;


    exposure?: number;

}



export enum EnvironmentMapType {


    Cube = "Cube",


    Equirectangular = "Equirectangular",


    HDR = "HDR"

}



export class EnvironmentMap {



    public type:

        EnvironmentMapType =

        EnvironmentMapType.Cube;



    /**
     * HDR texture
     */
    private texture:

        any = null;



    /**
     * IBL diffuse irradiance
     */
    private irradiance:

        any = null;



    /**
     * Prefiltered specular map
     */
    private prefiltered:

        any = null;



    /**
     * Ortam ışık yoğunluğu
     */
    public intensity = 1.0;



    /**
     * Environment rotation
     */
    public rotation = 0.0;



    /**
     * HDR exposure
     */
    public exposure = 1.0;



    public format =

        "RGBA16F";



    constructor(

        options:

            EnvironmentMapOptions = {}

    ) {


        if (

            options.format

        ) {

            this.format =

                options.format;

        }



        if (

            options.intensity !== undefined

        ) {

            this.intensity =

                options.intensity;

        }



        if (

            options.rotation !== undefined

        ) {

            this.rotation =

                options.rotation;

        }



        if (

            options.exposure !== undefined

        ) {

            this.exposure =

                options.exposure;

        }

    }





    load(

        source:any,

        type:

            EnvironmentMapType =

            EnvironmentMapType.HDR

    ):void {


        this.type =

            type;



        /**
         * Gerçek GPU implementasyonunda:
         *
         * HDR texture upload
         * equirectangular conversion
         * cubemap generation
         */


        this.texture = {


            source,


            type

        };

    }





    generateCubeMap():

    void {


        if (

            !this.texture

        ) {

            return;

        }



        this.texture = {


            type:

                "GeneratedCubeMap",


            format:

                this.format

        };

    }





    generateIrradiance():

    void {


        /**
         * Diffuse convolution
         *
         * Lambertian environment lighting
         */


        this.irradiance = {


            type:

                "IrradianceCubeMap"

        };

    }





    generatePrefiltered():

    void {


        /**
         * Specular IBL
         *
         * Roughness mip chain
         */


        this.prefiltered = {


            type:

                "PrefilteredEnvironment"

        };

    }





    getTexture():

    any {


        return this.texture;

    }





    getIrradiance():

    any {


        return this.irradiance;

    }





    getPrefiltered():

    any {


        return this.prefiltered;

    }





    setIntensity(

        value:number

    ):void {


        this.intensity =

            Math.max(

                0,

                value

            );

    }





    setRotation(

        value:number

    ):void {


        this.rotation =

            value;

    }





    setExposure(

        value:number

    ):void {


        this.exposure =

            Math.max(

                0,

                value

            );

    }





    bind(

        shader:any

    ):void {


        if (

            !shader

        ) {

            return;

        }



        shader.setUniform(

            "environmentMap",

            this.texture

        );



        shader.setUniform(

            "irradianceMap",

            this.irradiance

        );



        shader.setUniform(

            "prefilteredMap",

            this.prefiltered

        );



        shader.setUniform(

            "environmentIntensity",

            this.intensity

        );



        shader.setUniform(

            "environmentRotation",

            this.rotation

        );



        shader.setUniform(

            "environmentExposure",

            this.exposure

        );

    }





    dispose():

    void {


        this.texture = null;


        this.irradiance = null;


        this.prefiltered = null;

    }





    toJSON(){


        return {


            type:

                this.type,


            format:

                this.format,


            intensity:

                this.intensity,


            rotation:

                this.rotation,


            exposure:

                this.exposure

        };

    }

}