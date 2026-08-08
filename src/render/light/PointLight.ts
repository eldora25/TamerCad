import {
    Light,
    LightType,
    MaterialColor
} from "./Light";

import { Point3 } from "../../geometry/primitives/Point3";



export interface PointLightOptions {


    position?: Point3;


    color?: MaterialColor;


    intensity?: number;


    constant?: number;


    linear?: number;


    quadratic?: number;


    distance?: number;

}



export class PointLight extends Light {


    /**
     * Dünya koordinatındaki ışık pozisyonu
     */
    public position:

        Point3 =

        new Point3(

            0,

            0,

            0

        );



    /**
     * Attenuation katsayıları
     *
     * 1 / (constant +
     * linear*d +
     * quadratic*d²)
     */
    public constant = 1.0;


    public linear = 0.09;


    public quadratic = 0.032;



    /**
     * Maksimum etki mesafesi
     */
    public distance = 0;



    constructor(

        name = "Point Light",

        options:

            PointLightOptions = {}

    ) {


        super(

            LightType.Point,

            name

        );



        if (

            options.position

        ) {

            this.position =

                options.position;

        }



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

                options.intensity;

        }



        if (

            options.constant !== undefined

        ) {

            this.constant =

                options.constant;

        }



        if (

            options.linear !== undefined

        ) {

            this.linear =

                options.linear;

        }



        if (

            options.quadratic !== undefined

        ) {

            this.quadratic =

                options.quadratic;

        }



        if (

            options.distance !== undefined

        ) {

            this.distance =

                options.distance;

        }

    }





    setPosition(

        position:

            Point3

    ):void {


        this.position =

            position;

    }





    getPosition():

    Point3 {


        return new Point3(

            this.position.x,

            this.position.y,

            this.position.z

        );

    }





    setAttenuation(

        constant:number,

        linear:number,

        quadratic:number

    ):void {


        this.constant =

            constant;


        this.linear =

            linear;


        this.quadratic =

            quadratic;

    }





    calculateAttenuation(

        distance:number

    ):number {


        const denominator =

            this.constant +

            this.linear *

            distance +

            this.quadratic *

            distance *

            distance;



        if (

            denominator <= 0

        ) {

            return 1;

        }


        return (

            1 /

            denominator

        );

    }





    getLightData(){


        return {


            ...super.getLightData(),


            position:

                this.position,


            constant:

                this.constant,


            linear:

                this.linear,


            quadratic:

                this.quadratic,


            distance:

                this.distance

        };

    }





    clone():

    PointLight {


        return new PointLight(

            "Point Light Copy",

            {

                position:

                    this.getPosition(),


                color:

                    {

                        ...this.color

                    },


                intensity:

                    this.intensity,


                constant:

                    this.constant,


                linear:

                    this.linear,


                quadratic:

                    this.quadratic,


                distance:

                    this.distance

            }

        );

    }





    toJSON(){


        return {


            ...super.toJSON(),


            position:

                this.position,


            constant:

                this.constant,


            linear:

                this.linear,


            quadratic:

                this.quadratic,


            distance:

                this.distance

        };

    }





    static fromJSON(

        data:any

    ):

    PointLight {


        return new PointLight(

            data.name,

            {

                position:

                    data.position,


                color:

                    data.color,


                intensity:

                    data.intensity,


                constant:

                    data.constant,


                linear:

                    data.linear,


                quadratic:

                    data.quadratic,


                distance:

                    data.distance

            }

        );

    }

}