import { ShadowMap } from "./ShadowMap";

import { SpotLight } from "../light/SpotLight";

import { RenderCamera } from "../RenderCamera";

import { Point3 } from "../../geometry/primitives/Point3";



export interface SpotShadowOptions {


    mapSize?: number;


    near?: number;


    far?: number;


    bias?: number;


}



export class SpotShadow {


    public readonly shadowMap:

        ShadowMap;



    public readonly camera:

        RenderCamera;



    public light:

        SpotLight;



    public near =

        0.1;



    public far =

        100;



    public bias =

        0.005;



    public enabled = true;



    constructor(

        light:

            SpotLight,


        options:

            SpotShadowOptions = {}

    ) {


        this.light =

            light;



        this.shadowMap =

            new ShadowMap({

                width:

                    options.mapSize ?? 2048,


                height:

                    options.mapSize ?? 2048,


                bias:

                    options.bias

            });



        this.near =

            options.near ??

            0.1;



        this.far =

            options.far ??

            100;



        this.camera =

            new RenderCamera();



        this.setupCamera();

    }





    private setupCamera():

    void {


        this.camera.setPerspective(

            60,

            1,

            this.near,

            this.far

        );

    }





    update():

    void {


        const position =

            this.light.getPosition();



        const direction =

            this.light.getDirection();



        this.camera.position =

            new Point3(

                position.x,

                position.y,

                position.z

            );



        this.camera.lookAt(

            new Point3(

                position.x +

                direction.x,


                position.y +

                direction.y,


                position.z +

                direction.z

            )

        );


        /**
         * Spot light angle
         *
         * shadow camera FOV
         * ile eşleştirilir.
         */


        this.camera.setFov(

            this.light.angle *

            2 *

            180 /

            Math.PI

        );

    }





    renderShadow(

        context:any,

        scene:any

    ):void {


        if (

            !this.enabled

        ) {

            return;

        }



        /**
         * Spot shadow pass
         *
         * 1. Spot camera ayarla
         *
         * 2. Depth render
         *
         * 3. Shadow map oluştur
         */


        this.shadowMap.bind(

            context

        );



        if (

            scene &&

            typeof scene.renderDepth ===

            "function"

        ) {


            scene.renderDepth(

                this.camera

            );

        }



        this.shadowMap.unbind(

            context

        );

    }





    setLight(

        light:

            SpotLight

    ):void {


        this.light =

            light;

    }





    setEnabled(

        value:boolean

    ):void {


        this.enabled =

            value;

    }





    isEnabled():

    boolean {


        return this.enabled;

    }





    setBias(

        value:number

    ):void {


        this.bias =

            Math.max(

                0,

                value

            );


        this.shadowMap.setBias(

            this.bias

        );

    }





    getShadowMap():

    ShadowMap {


        return this.shadowMap;

    }





    getCamera():

    RenderCamera {


        return this.camera;

    }





    toJSON(){


        return {


            enabled:

                this.enabled,


            near:

                this.near,


            far:

                this.far,


            bias:

                this.bias,


            shadowMap:

                this.shadowMap.toJSON()

        };

    }

}