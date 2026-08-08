import {
    Light,
    LightType,
    MaterialColor
} from "./Light";

import { Point3 } from "../../geometry/primitives/Point3";



export interface SpotLightOptions {


    position?: Point3;


    direction?: Point3;


    color?: MaterialColor;


    intensity?: number;


    angle?: number;


    penumbra?: number;


    distance?: number;


    decay?: number;

}



export class SpotLight extends Light {


    /**
     * Işık başlangıç noktası
     */
    public position:

        Point3 =

        new Point3(

            0,

            0,

            0

        );



    /**
     * Işık yönü
     */
    public direction:

        Point3 =

        new Point3(

            0,

            -1,

            0

        );



    /**
     * Konik ışık açısı
     *
     * Radyan
     */
    public angle =

        Math.PI / 4;



    /**
     * Yumuşak geçiş bölgesi
     */
    public penumbra =

        0;



    /**
     * Maksimum mesafe
     */
    public distance =

        0;



    /**
     * Işık düşüş katsayısı
     */
    public decay =

        2;



    constructor(

        name = "Spot Light",

        options:

            SpotLightOptions = {}

    ) {


        super(

            LightType.Spot,

            name

        );



        if (

            options.position

        ) {

            this.position =

                options.position;

        }



        if (

            options.direction

        ) {

            this.direction =

                options.direction;

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

            options.angle !== undefined

        ) {

            this.angle =

                options.angle;

        }



        if (

            options.penumbra !== undefined

        ) {

            this.penumbra =

                options.penumbra;

        }



        if (

            options.distance !== undefined

        ) {

            this.distance =

                options.distance;

        }



        if (

            options.decay !== undefined

        ) {

            this.decay =

                options.decay;

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





    setDirection(

        direction:

            Point3

    ):void {


        this.direction =

            direction;

    }





    getDirection():

    Point3 {


        return new Point3(

            this.direction.x,

            this.direction.y,

            this.direction.z

        );

    }





    setAngle(

        angle:number

    ):void {


        this.angle =

            Math.max(

                0,

                Math.min(

                    Math.PI,

                    angle

                )

            );

    }





    setPenumbra(

        value:number

    ):void {


        this.penumbra =

            Math.max(

                0,

                Math.min(

                    1,

                    value

                )

            );

    }





    calculateSpotEffect(

        lightDirection:

            Point3

    ):number {


        /**
         * Spot konisi hesaplama.
         *
         * cos(theta)
         */

        const dot =

            this.direction.x *

            lightDirection.x +

            this.direction.y *

            lightDirection.y +

            this.direction.z *

            lightDirection.z;



        const limit =

            Math.cos(

                this.angle

            );



        if (

            dot < limit

        ) {

            return 0;

        }



        if (

            this.penumbra === 0

        ) {

            return 1;

        }



        const edge =

            (dot - limit) /

            this.penumbra;



        return Math.max(

            0,

            Math.min(

                1,

                edge

            )

        );

    }





    getLightData(){


        return {


            ...super.getLightData(),


            position:

                this.position,


            direction:

                this.direction,


            angle:

                this.angle,


            penumbra:

                this.penumbra,


            distance:

                this.distance,


            decay:

                this.decay

        };

    }





    clone():

    SpotLight {


        return new SpotLight(

            "Spot Light Copy",

            {

                position:

                    this.getPosition(),


                direction:

                    this.getDirection(),


                color:

                    {

                        ...this.color

                    },


                intensity:

                    this.intensity,


                angle:

                    this.angle,


                penumbra:

                    this.penumbra,


                distance:

                    this.distance,


                decay:

                    this.decay

            }

        );

    }





    toJSON(){


        return {


            ...super.toJSON(),


            position:

                this.position,


            direction:

                this.direction,


            angle:

                this.angle,


            penumbra:

                this.penumbra,


            distance:

                this.distance,


            decay:

                this.decay

        };

    }





    static fromJSON(

        data:any

    ):

    SpotLight {


        return new SpotLight(

            data.name,

            {

                position:

                    data.position,


                direction:

                    data.direction,


                color:

                    data.color,


                intensity:

                    data.intensity,


                angle:

                    data.angle,


                penumbra:

                    data.penumbra,


                distance:

                    data.distance,


                decay:

                    data.decay

            }

        );

    }

}