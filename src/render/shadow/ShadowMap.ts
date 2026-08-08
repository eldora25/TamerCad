import { RenderContext } from "../RenderContext";


export enum ShadowMapType {

    Basic = "Basic",

    PCF = "PCF",

    VSM = "VSM"

}



export interface ShadowMapOptions {


    width?: number;


    height?: number;


    type?: ShadowMapType;


    bias?: number;


    enabled?: boolean;

}



export class ShadowMap {


    private gpuTexture:

        any = null;



    private depthBuffer:

        any = null;



    private initialized = false;



    public readonly width:

        number;



    public readonly height:

        number;



    public readonly type:

        ShadowMapType;



    public bias = 0.005;



    public enabled = true;



    constructor(

        options:

            ShadowMapOptions = {}

    ) {


        this.width =

            options.width ??

            2048;



        this.height =

            options.height ??

            2048;



        this.type =

            options.type ??

            ShadowMapType.PCF;



        if (

            options.bias !== undefined

        ) {

            this.bias =

                options.bias;

        }



        if (

            options.enabled !== undefined

        ) {

            this.enabled =

                options.enabled;

        }

    }





    initialize(

        context:

            RenderContext

    ):void {


        if (

            this.initialized

        ) {

            return;

        }



        /**
         * GPU depth texture oluşturma.
         *
         * WebGL:
         *
         * gl.createTexture()
         *
         * gl.texImage2D(
         *    DEPTH_COMPONENT
         * )
         *
         * framebuffer attachment
         *
         */



        if (

            context.nativeContext

        ) {


            this.gpuTexture = {


                width:

                    this.width,


                height:

                    this.height,


                format:

                    "DEPTH_COMPONENT"

            };



            this.depthBuffer = {


                type:

                    "FramebufferDepth"

            };

        }



        this.initialized = true;

    }





    bind(

        context:

            RenderContext

    ):void {


        if (

            !this.initialized

        ) {

            this.initialize(

                context

            );

        }


        /**
         * Shadow framebuffer bind.
         *
         * WebGL:
         *
         * gl.bindFramebuffer()
         */

    }





    unbind(

        context:

            RenderContext

    ):void {


        /**
         * Shadow framebuffer release.
         *
         */

        void context;

    }





    setBias(

        value:number

    ):void {


        this.bias =

            Math.max(

                0,

                value

            );

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





    getTexture():

    any {


        return this.gpuTexture;

    }





    getSize(){

        return {


            width:

                this.width,


            height:

                this.height

        };

    }





    clear():void {


        /**
         * Depth buffer temizleme.
         *
         * gl.clear(
         *    DEPTH_BUFFER_BIT
         * )
         */

    }





    dispose():void {


        /**
         * GPU kaynak temizleme.
         *
         * gl.deleteTexture()
         * gl.deleteFramebuffer()
         */


        this.gpuTexture = null;


        this.depthBuffer = null;


        this.initialized = false;

    }





    toJSON(){


        return {


            width:

                this.width,


            height:

                this.height,


            type:

                this.type,


            bias:

                this.bias,


            enabled:

                this.enabled

        };

    }





    static fromJSON(

        data:any

    ):

    ShadowMap {


        return new ShadowMap(

            {

                width:

                    data.width,


                height:

                    data.height,


                type:

                    data.type,


                bias:

                    data.bias,


                enabled:

                    data.enabled

            }

        );

    }

}