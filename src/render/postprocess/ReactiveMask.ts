import {
    FrameBuffer,
    FrameBufferAttachment
} from "./FrameBuffer";



export interface ReactiveMaskOptions {


    width?: number;


    height?: number;


    format?: string;


    threshold?: number;

}



export enum ReactiveMaskAttachment {


    Mask = "mask",


    MaterialID = "materialID",


    Emissive = "emissive"

}



export class ReactiveMask extends FrameBuffer {



    /**
     * TAA history kabul/red maskesi
     *
     * 0 = history kullanılabilir
     *
     * 1 = history reddedilir
     */
    public threshold = 0.5;



    public enabled = true;



    private rendered = false;



    constructor(

        options:

            ReactiveMaskOptions = {}

    ) {


        super({

            width:

                options.width,


            height:

                options.height,


            attachments:

                ReactiveMask.createAttachments(

                    options

                )

        });



        if (

            options.threshold !== undefined

        ) {


            this.threshold =

                options.threshold;

        }

    }





    static createAttachments(

        options:

            ReactiveMaskOptions

    ):

    FrameBufferAttachment[] {


        return [


            {


                name:

                    ReactiveMaskAttachment.Mask,


                type:

                    "Texture2D",


                format:

                    options.format ??

                    "R8",


                texture:

                    null

            },


            {


                name:

                    ReactiveMaskAttachment.MaterialID,


                type:

                    "Texture2D",


                format:

                    "R16UI",


                texture:

                    null

            },


            {


                name:

                    ReactiveMaskAttachment.Emissive,


                type:

                    "Texture2D",


                format:

                    "RGBA16F",


                texture:

                    null

            }


        ];

    }





    getMaskTexture():

    any {


        return this.getTexture(

            ReactiveMaskAttachment.Mask

        );

    }





    getMaterialIDTexture():

    any {


        return this.getTexture(

            ReactiveMaskAttachment.MaterialID

        );

    }





    getEmissiveTexture():

    any {


        return this.getTexture(

            ReactiveMaskAttachment.Emissive

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





    setReactivePixel(

        material:any

    ):number {


        /**
         * History reject kararı
         */


        if (

            material.transparent ||

            material.emissive ||

            material.animated

        ) {


            return 1.0;

        }



        return 0.0;

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

                "ReactiveMask",


            enabled:

                this.enabled,


            threshold:

                this.threshold,


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