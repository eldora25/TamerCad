import {
    Material,
    MaterialColor,
    MaterialType
} from "./Material";

import { ShaderProgram } from "../shader/ShaderProgram";


export interface PhongMaterialOptions {

    color?: MaterialColor;

    ambient?: number;

    diffuse?: number;

    specular?: number;

    shininess?: number;

}



export class PhongMaterial extends Material {


    public ambient = 0.2;


    public diffuse = 0.8;


    public specular = 0.5;


    public shininess = 32;



    constructor(

        name = "Phong Material",

        options:

            PhongMaterialOptions = {}

    ) {


        super(

            name,

            MaterialType.Phong

        );



        if (

            options.color

        ) {

            this.color = {

                ...options.color

            };

        }



        if (

            options.ambient !== undefined

        ) {

            this.ambient =

                options.ambient;

        }



        if (

            options.diffuse !== undefined

        ) {

            this.diffuse =

                options.diffuse;

        }



        if (

            options.specular !== undefined

        ) {

            this.specular =

                options.specular;

        }



        if (

            options.shininess !== undefined

        ) {

            this.shininess =

                options.shininess;

        }


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

            "materialAmbient",

            this.ambient

        );



        shader.setUniform(

            "materialDiffuse",

            this.diffuse

        );



        shader.setUniform(

            "materialSpecular",

            this.specular

        );



        shader.setUniform(

            "materialShininess",

            this.shininess

        );

    }



    clone():

    PhongMaterial {


        const material =

            new PhongMaterial(

                this.name,

                {

                    color:

                        {

                            ...this.color

                        },

                    ambient:

                        this.ambient,

                    diffuse:

                        this.diffuse,

                    specular:

                        this.specular,

                    shininess:

                        this.shininess

                }

            );


        return material;

    }



    override toJSON(){

        return {


            ...super.toJSON(),


            ambient:

                this.ambient,


            diffuse:

                this.diffuse,


            specular:

                this.specular,


            shininess:

                this.shininess

        };

    }



    static fromJSON(

        data:any

    ):PhongMaterial {


        return new PhongMaterial(

            data.name,

            {

                color:

                    data.color,


                ambient:

                    data.ambient,


                diffuse:

                    data.diffuse,


                specular:

                    data.specular,


                shininess:

                    data.shininess

            }

        );

    }

}