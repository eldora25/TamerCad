import {
    FrameBuffer,
    FrameBufferAttachment
} from "./FrameBuffer";



export interface NormalPrepassOptions {


    width?: number;


    height?: number;


    format?: string;


    encodeViewSpace?: boolean;

}



export enum NormalPrepassAttachment {


    Normal = "normal",


    Depth = "depth"

}



export class NormalPrepass extends FrameBuffer {



    public enabled = true;



    /**
     * View space veya world space normal
     */
    public encodeViewSpace = true;



    private rendered = false;



    constructor(

        options:

            NormalPrepassOptions = {}

    ) {


        super({

            width:

                options.width,


            height:

                options.height,


            attachments:

                NormalPrepass.createAttachments(

                    options

                )

        });



        if (

            options.encodeViewSpace !== undefined

        ) {

            this.encodeViewSpace =

                options.encodeViewSpace;

        }

    }





    static createAttachments(

        options:

            NormalPrepassOptions

    ):

    FrameBufferAttachment[] {


        return [


            {


                name:

                    NormalPrepassAttachment.Normal,


                type:

                    "Texture2D",


                format:

                    options.format ??

                    "RGBA16F",


                texture:

                    null

            },


            {


                name:

                    NormalPrepassAttachment.Depth,


                type:

                    "DepthTexture",


                format:

                    "DEPTH32F",


                texture:

                    null

            }


        ];

    }





    getNormalTexture():

    any {


        return this.getTexture(

            NormalPrepassAttachment.Normal

        );

    }





    getDepthTexture():

    any {


        return this.getTexture(

            NormalPrepassAttachment.Depth

        );

    }





    begin():

    void {


        this.rendered = false;

    }





    end():

    void {


        this.rendered = true;

    }





    isReady():

    boolean {


        return this.rendered;

    }





    encodeNormal(

        normal:any

    ):any {


        /**
         * GPU tarafında:
         *
         * normal * 0.5 + 0.5
         *
         * ile texture'a yazılır
         */


        return {


            r:

                normal.x *

                0.5 +

                0.5,


            g:

                normal.y *

                0.5 +

                0.5,


            b:

                normal.z *

                0.5 +

                0.5,


            a:

                1.0

        };

    }





    decodeNormal(

        encoded:any

    ):any {


        return {


            x:

                encoded.r *

                2.0 -

                1.0,


            y:

                encoded.g *

                2.0 -

                1.0,


            z:

                encoded.b *

                2.0 -

                1.0

        };

    }





    clear():

    void {


        for (

            const attachment of

            this.getAttachments()

        ) {


            attachment.texture =

                null;

        }



        this.rendered = false;

    }





    resize(

        width:number,

        height:number

    ):void {


        super.resize(

            width,

            height

        );

    }





    debugInfo(){


        return {


            type:

                "NormalPrepass",


            enabled:

                this.enabled,


            viewSpace:

                this.encodeViewSpace,


            rendered:

                this.rendered,


            attachments:

                this.getAttachments()

                .map(

                    a => a.name

                )

        };

    }

}