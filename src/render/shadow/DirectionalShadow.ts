import { ShadowMap } from "./ShadowMap";

import { DirectionalLight } from "../light/DirectionalLight";

import { RenderCamera } from "../RenderCamera";

import { Point3 } from "../../geometry/primitives/Point3";



export interface DirectionalShadowOptions {


    mapSize?: number;


    cameraSize?: number;


    near?: number;


    far?: number;


    bias?: number;

}



export class DirectionalShadow {


    public readonly shadowMap:

        ShadowMap;



    public readonly camera:

        RenderCamera;



    public light:

        DirectionalLight;



    public cameraSize =

        20;



    public near =

        0.1;



    public far =

        100;



    public bias =

        0.005;



    public enabled = true;



    constructor(

        light:

            DirectionalLight,


        options:

            DirectionalShadowOptions = {}

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



        this.cameraSize =

            options.cameraSize ??

            20;



        this.near =

            options.near ??

            0.1;



        this.far =

            options.far ??

            100;



        this.camera =

            new RenderCamera();

    }





    update():

    void {


        /**
         * Directional shadow camera
         *
         * ışık yönüne göre
         * ortografik kamera ayarlanır.
         */


        const direction =

            this.light.getDirection();



        const position =

            new Point3(

                -direction.x * 50,

                -direction.y * 50,

                -direction.z * 50

            );



        this.camera.position =

            position;



        this.camera.lookAt(

            new Point3(

                0,

                0,

                0

            )

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
         * Shadow pass
         *
         * 1. Shadow camera aktif
         *
         * 2. Scene depth render
         *
         * 3. Depth texture oluştur
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

            DirectionalLight

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


            cameraSize:

                this.cameraSize,


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