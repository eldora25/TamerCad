import { ShadowMap } from "./ShadowMap";

import { PointLight } from "../light/PointLight";

import { RenderCamera } from "../RenderCamera";

import { Point3 } from "../../geometry/primitives/Point3";



export interface PointShadowOptions {


    mapSize?: number;


    near?: number;


    far?: number;


    bias?: number;

}



export class PointShadow {


    public readonly shadowMap:

        ShadowMap;



    public readonly cameras:

        RenderCamera[] = [];



    public light:

        PointLight;



    public near =

        0.1;



    public far =

        100;



    public bias =

        0.005;



    public enabled = true;



    /**
     * Cubemap yönleri
     *
     * +X -X +Y -Y +Z -Z
     */
    private readonly directions = [

        new Point3(1,0,0),

        new Point3(-1,0,0),

        new Point3(0,1,0),

        new Point3(0,-1,0),

        new Point3(0,0,1),

        new Point3(0,0,-1)

    ];



    constructor(

        light:

            PointLight,


        options:

            PointShadowOptions = {}

    ) {


        this.light =

            light;



        this.shadowMap =

            new ShadowMap({

                width:

                    options.mapSize ?? 1024,


                height:

                    options.mapSize ?? 1024,


                bias:

                    options.bias

            });



        this.near =

            options.near ??

            0.1;



        this.far =

            options.far ??

            100;



        this.createCameras();

    }





    private createCameras():

    void {


        for(

            let i = 0;

            i < 6;

            i++

        ){


            const camera =

                new RenderCamera();



            camera.setPerspective(

                90,

                1,

                this.near,

                this.far

            );



            this.cameras.push(

                camera

            );

        }

    }





    update():

    void {


        const position =

            this.light.getPosition();



        for(

            let i = 0;

            i < 6;

            i++

        ){


            const camera =

                this.cameras[i];



            camera.position =

                new Point3(

                    position.x,

                    position.y,

                    position.z

                );



            const target =

                new Point3(

                    position.x +

                    this.directions[i].x,


                    position.y +

                    this.directions[i].y,


                    position.z +

                    this.directions[i].z

                );



            camera.lookAt(

                target

            );

        }

    }





    renderShadow(

        context:any,

        scene:any

    ):void {


        if(

            !this.enabled

        ){

            return;

        }



        /**
         * Point light shadow pass
         *
         * 6 farklı kamera ile
         * cubemap depth render
         */


        this.shadowMap.bind(

            context

        );



        for(

            const camera of

            this.cameras

        ){


            if(

                scene &&

                typeof scene.renderDepth ===

                "function"

            ){


                scene.renderDepth(

                    camera

                );

            }

        }



        this.shadowMap.unbind(

            context

        );

    }





    setLight(

        light:

            PointLight

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





    getCameras():

    RenderCamera[] {


        return this.cameras;

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