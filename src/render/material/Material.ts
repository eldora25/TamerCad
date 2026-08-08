import { ShaderProgram } from "../shader/ShaderProgram";


export enum MaterialType {

    Basic = "Basic",

    Phong = "Phong",

    PBR = "PBR",

    Line = "Line"

}



export interface MaterialColor {

    r: number;

    g: number;

    b: number;

    a: number;

}



export interface MaterialProperties {


    color?: MaterialColor;


    opacity?: number;


    transparent?: boolean;


    wireframe?: boolean;


}



export class Material {


    public readonly id: string;


    public type:

        MaterialType;


    public name: string;



    public color:

        MaterialColor = {


            r: 0.8,


            g: 0.8,


            b: 0.8,


            a: 1.0

        };



    public opacity = 1.0;


    public transparent = false;


    public wireframe = false;



    protected shader:

        ShaderProgram | null = null;



    protected uniforms:

        Map<string, any> =

        new Map();



    constructor(

        name = "Material",

        type = MaterialType.Basic

    ) {


        this.id =

            Material.generateId();



        this.name = name;


        this.type = type;

    }



    setShader(

        shader:

            ShaderProgram

    ): void {


        this.shader = shader;

    }



    getShader():

    ShaderProgram | null {


        return this.shader;

    }



    setColor(

        color:

            MaterialColor

    ): void {


        this.color = {


            ...color

        };

    }



    setOpacity(

        opacity:number

    ): void {


        this.opacity = Math.max(

            0,

            Math.min(

                1,

                opacity

            )

        );

    }



    setTransparent(

        value:boolean

    ): void {


        this.transparent = value;

    }



    setWireframe(

        value:boolean

    ): void {


        this.wireframe = value;

    }



    setUniform(

        name:string,

        value:any

    ):void {


        this.uniforms.set(

            name,

            value

        );

    }



    getUniform(

        name:string

    ):any {


        return this.uniforms.get(

            name

        );

    }



    apply():void {


        if (

            !this.shader

        ) {

            return;

        }



        this.shader.setUniform(

            "materialColor",

            this.color

        );



        this.shader.setUniform(

            "opacity",

            this.opacity

        );



        for (

            const [

                name,

                value

            ] of this.uniforms

        ) {


            this.shader.setUniform(

                name,

                value

            );

        }

    }



    clone():

    Material {


        const material =

            new Material(

                this.name,

                this.type

            );



        material.color = {


            ...this.color

        };



        material.opacity =

            this.opacity;



        material.transparent =

            this.transparent;



        material.wireframe =

            this.wireframe;



        material.shader =

            this.shader;



        material.uniforms =

            new Map(

                this.uniforms

            );



        return material;

    }



    toJSON(){


        return {


            id:this.id,


            name:this.name,


            type:this.type,


            color:this.color,


            opacity:this.opacity,


            transparent:this.transparent,


            wireframe:this.wireframe,


            uniforms:

                Object.fromEntries(

                    this.uniforms

                )

        };


    }



    static fromJSON(

        data:any

    ):Material {


        const material =

            new Material(

                data.name,

                data.type

            );



        material.color =

            data.color;



        material.opacity =

            data.opacity;



        material.transparent =

            data.transparent;



        material.wireframe =

            data.wireframe;



        material.uniforms =

            new Map(

                Object.entries(

                    data.uniforms ?? {}

                )

            );



        return material;

    }



    private static generateId():

    string {


        return (

            "material_" +

            Date.now() +

            "_" +

            Math.floor(

                Math.random()*100000

            )

        );

    }

}