export interface RenderTargetOptions {


    width?: number;


    height?: number;


    samples?: number;


    colorFormat?: string;


    depthFormat?: string;


    useDepth?: boolean;


}



export class RenderTarget {


    public width = 1;


    public height = 1;



    /**
     * MSAA sample sayısı
     */
    public samples = 1;



    public colorFormat =

        "RGBA8";



    public depthFormat =

        "DEPTH24";



    public useDepth = true;



    private framebuffer:

        any = null;



    private colorTexture:

        any = null;



    private depthTexture:

        any = null;



    private initialized = false;



    constructor(

        options:

            RenderTargetOptions = {}

    ) {


        if (

            options.width !== undefined

        ) {

            this.width =

                options.width;

        }



        if (

            options.height !== undefined

        ) {

            this.height =

                options.height;

        }



        if (

            options.samples !== undefined

        ) {

            this.samples =

                options.samples;

        }



        if (

            options.colorFormat

        ) {

            this.colorFormat =

                options.colorFormat;

        }



        if (

            options.depthFormat

        ) {

            this.depthFormat =

                options.depthFormat;

        }



        if (

            options.useDepth !== undefined

        ) {

            this.useDepth =

                options.useDepth;

        }

    }





    initialize(

        context:any

    ):void {


        if (

            this.initialized

        ) {

            return;

        }



        /**
         * GPU framebuffer oluşturma
         */


        this.framebuffer = {


            type:

                "Framebuffer",


            width:

                this.width,


            height:

                this.height

        };



        this.colorTexture = {


            type:

                "ColorTexture",


            format:

                this.colorFormat,


            width:

                this.width,


            height:

                this.height

        };



        if (

            this.useDepth

        ) {


            this.depthTexture = {


                type:

                    "DepthTexture",


                format:

                    this.depthFormat,


                width:

                    this.width,


                height:

                    this.height

            };

        }



        this.initialized = true;

    }





    bind(

        context:any

    ):void {


        if (

            !this.initialized

        ) {

            this.initialize(

                context

            );

        }



        /**
         * Render işlemlerini
         * bu hedefe yönlendirir.
         */

        if (

            context &&

            context.bindFramebuffer

        ) {


            context.bindFramebuffer(

                this.framebuffer

            );

        }

    }





    unbind(

        context:any

    ):void {


        if (

            context &&

            context.bindFramebuffer

        ) {


            context.bindFramebuffer(

                null

            );

        }

    }





    resize(

        width:number,

        height:number

    ):void {


        this.width =

            width;



        this.height =

            height;



        if (

            this.initialized

        ) {


            this.dispose();


            this.initialized = false;

        }

    }





    getColorTexture():

    any {


        return this.colorTexture;

    }





    getDepthTexture():

    any {


        return this.depthTexture;

    }





    getFramebuffer():

    any {


        return this.framebuffer;

    }





    setSamples(

        samples:number

    ):void {


        this.samples =

            Math.max(

                1,

                samples

            );

    }





    getSize(){


        return {


            width:

                this.width,


            height:

                this.height

        };

    }





    clear(

        context:any

    ):void {


        if (

            !context

        ) {

            return;

        }



        /**
         * Color + depth buffer temizleme
         */


        if (

            context.clear

        ) {


            context.clear();

        }

    }





    dispose():

    void {


        this.framebuffer = null;


        this.colorTexture = null;


        this.depthTexture = null;


        this.initialized = false;

    }





    toJSON(){


        return {


            width:

                this.width,


            height:

                this.height,


            samples:

                this.samples,


            colorFormat:

                this.colorFormat,


            depthFormat:

                this.depthFormat,


            useDepth:

                this.useDepth

        };

    }





    static fromJSON(

        data:any

    ):

    RenderTarget {


        return new RenderTarget({

            width:

                data.width,


            height:

                data.height,


            samples:

                data.samples,


            colorFormat:

                data.colorFormat,


            depthFormat:

                data.depthFormat,


            useDepth:

                data.useDepth

        });

    }

}