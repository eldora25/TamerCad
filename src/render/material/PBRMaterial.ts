import {
    Material,
    MaterialColor,
    MaterialType
} from "./Material";

import { ShaderProgram } from "../shader/ShaderProgram";


export interface PBRMaterialOptions {

    color?: MaterialColor;

    metallic?: number;

    roughness?: number;

    emission?: MaterialColor;

    normalMap?: string;

    albedoMap?: string;

    metallicMap?: string;

    roughnessMap?: string;

}



export class PBRMaterial extends Material {


    /**
     * Metallic value
     *
     * 0 = dielectric
     * 1 = metal
     */
    public metallic = 0.0;


    /**
     * Surface roughness
     *
     * 0 = mirror
     * 1 = rough
     */
    public roughness = 0.5;



    public emission:

        MaterialColor = {

            r:0,

            g:0,

            b:0,

            a:1

        };



    public albedoMap:

        string | null = null;



    public normalMap:

        string | null = null;



    public metallicMap:

        string | null = null;



    public roughnessMap:

        string | null = null;



    constructor(

        name = "PBR Material",

        options:

            PBRMaterialOptions = {}

    ) {


        super(

            name,

            MaterialType.PBR

        );



        if (

            options.color

        ) {

            this.color = {

                ...options.color

            };

        }



        if (

            options.metallic !== undefined

        ) {

            this.metallic =

                this.clamp(

                    options.metallic

                );

        }



        if (

            options.roughness !== undefined

        ) {

            this.roughness =

                this.clamp(

                    options.roughness

                );

        }



        if (

            options.emission

        ) {

            this.emission = {

                ...options.emission

            };

        }



        this.albedoMap =

            options.albedoMap ??

            null;



        this.normalMap =

            options.normalMap ??

            null;



        this.metallicMap =

            options.metallicMap ??

            null;



        this.roughnessMap =

            options.roughnessMap ??

            null;

    }





    override setShader(

        shader:

            ShaderProgram

    ): void {


        super.setShader(

            shader

        );

    }





    override apply(): void {


        super.apply();



        const shader =

            this.getShader();



        if (

            !shader

        ) {

            return;

        }



        shader.setUniform(

            "materialMetallic",

            this.metallic

        );



        shader.setUniform(

            "materialRoughness",

            this.roughness

        );



        shader.setUniform(

            "materialEmission",

            this.emission

        );



        shader.setUniform(

            "hasAlbedoMap",

            this.albedoMap !== null

        );



        shader.setUniform(

            "hasNormalMap",

            this.normalMap !== null

        );



        shader.setUniform(

            "hasMetallicMap",

            this.metallicMap !== null

        );



        shader.setUniform(

            "hasRoughnessMap",

            this.roughnessMap !== null

        );

    }





    setMetallic(

        value:number

    ):void {


        this.metallic =

            this.clamp(

                value

            );

    }





    setRoughness(

        value:number

    ):void {


        this.roughness =

            this.clamp(

                value

            );

    }





    isMetal():

    boolean {


        return this.metallic >= 0.5;

    }





    clone():

    PBRMaterial {


        return new PBRMaterial(

            this.name,

            {

                color:

                    {

                        ...this.color

                    },


                metallic:

                    this.metallic,


                roughness:

                    this.roughness,


                emission:

                    {

                        ...this.emission

                    },


                albedoMap:

                    this.albedoMap ?? undefined,


                normalMap:

                    this.normalMap ?? undefined,


                metallicMap:

                    this.metallicMap ?? undefined,


                roughnessMap:

                    this.roughnessMap ?? undefined

            }

        );

    }





    override toJSON(){


        return {


            ...super.toJSON(),


            metallic:

                this.metallic,


            roughness:

                this.roughness,


            emission:

                this.emission,


            albedoMap:

                this.albedoMap,


            normalMap:

                this.normalMap,


            metallicMap:

                this.metallicMap,


            roughnessMap:

                this.roughnessMap

        };

    }





    static fromJSON(

        data:any

    ):PBRMaterial {


        return new PBRMaterial(

            data.name,

            {

                color:

                    data.color,


                metallic:

                    data.metallic,


                roughness:

                    data.roughness,


                emission:

                    data.emission,


                albedoMap:

                    data.albedoMap,


                normalMap:

                    data.normalMap,


                metallicMap:

                    data.metallicMap,


                roughnessMap:

                    data.roughnessMap

            }

        );

    }





    private clamp(

        value:number

    ):number {


        return Math.max(

            0,

            Math.min(

                1,

                value

            )

        );

    }

}