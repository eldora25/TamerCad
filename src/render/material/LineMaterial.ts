import {
    Material,
    MaterialColor,
    MaterialType
} from "./Material";

import { ShaderProgram } from "../shader/ShaderProgram";


export interface LineMaterialOptions {

    color?: MaterialColor;

    lineWidth?: number;

    dashed?: boolean;

    dashSize?: number;

    gapSize?: number;

}



export class LineMaterial extends Material {


    public lineWidth = 1.0;


    public dashed = false;


    public dashSize = 5.0;


    public gapSize = 5.0;



    constructor(

        name = "Line Material",

        options:

            LineMaterialOptions = {}

    ) {


        super(

            name,

            MaterialType.Line

        );



        if (

            options.color

        ) {

            this.color = {

                ...options.color

            };

        }



        if (

            options.lineWidth !== undefined

        ) {

            this.lineWidth =

                options.lineWidth;

        }



        if (

            options.dashed !== undefined

        ) {

            this.dashed =

                options.dashed;

        }



        if (

            options.dashSize !== undefined

        ) {

            this.dashSize =

                options.dashSize;

        }



        if (

            options.gapSize !== undefined

        ) {

            this.gapSize =

                options.gapSize;

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





    override apply():void {


        super.apply();



        const shader =

            this.getShader();



        if (

            !shader

        ) {

            return;

        }



        shader.setUniform(

            "lineWidth",

            this.lineWidth

        );



        shader.setUniform(

            "lineDashed",

            this.dashed

        );



        shader.setUniform(

            "dashSize",

            this.dashSize

        );



        shader.setUniform(

            "gapSize",

            this.gapSize

        );

    }





    setLineWidth(

        width:number

    ):void {


        if (

            width <= 0

        ) {

            throw new Error(

                "Line width must be greater than zero."

            );

        }


        this.lineWidth =

            width;

    }





    setDashed(

        value:boolean

    ):void {


        this.dashed = value;

    }





    setDashPattern(

        dash:number,

        gap:number

    ):void {


        this.dashSize =

            dash;


        this.gapSize =

            gap;

    }





    clone():

    LineMaterial {


        return new LineMaterial(

            this.name,

            {

                color:

                    {

                        ...this.color

                    },


                lineWidth:

                    this.lineWidth,


                dashed:

                    this.dashed,


                dashSize:

                    this.dashSize,


                gapSize:

                    this.gapSize

            }

        );

    }





    override toJSON(){


        return {


            ...super.toJSON(),


            lineWidth:

                this.lineWidth,


            dashed:

                this.dashed,


            dashSize:

                this.dashSize,


            gapSize:

                this.gapSize

        };

    }





    static fromJSON(

        data:any

    ):LineMaterial {


        return new LineMaterial(

            data.name,

            {

                color:

                    data.color,


                lineWidth:

                    data.lineWidth,


                dashed:

                    data.dashed,


                dashSize:

                    data.dashSize,


                gapSize:

                    data.gapSize

            }

        );

    }

}