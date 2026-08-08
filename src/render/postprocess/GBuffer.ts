import {
    FrameBuffer,
    FrameBufferAttachment
} from "./FrameBuffer";



export interface GBufferOptions {


    width?:number;


    height?:number;


    samples?:number;

}



export enum GBufferAttachmentType {


    Position = "position",


    Normal = "normal",


    Albedo = "albedo",


    Material = "material",


    Emissive = "emissive",


    Depth = "depth"

}



export class GBuffer extends FrameBuffer {



    constructor(

        options:

            GBufferOptions = {}

    ) {


        super({

            width:

                options.width,


            height:

                options.height,


            samples:

                options.samples,


            attachments:

            GBuffer.createAttachments()

        });

    }





    static createAttachments():

    FrameBufferAttachment[] {


        return [


            {


                name:

                    GBufferAttachmentType.Position,


                type:

                    "Texture2D",


                format:

                    "RGBA16F",


                texture:

                    null

            },


            {


                name:

                    GBufferAttachmentType.Normal,


                type:

                    "Texture2D",


                format:

                    "RGBA16F",


                texture:

                    null

            },


            {


                name:

                    GBufferAttachmentType.Albedo,


                type:

                    "Texture2D",


                format:

                    "RGBA8",


                texture:

                    null

            },


            {


                name:

                    GBufferAttachmentType.Material,


                type:

                    "Texture2D",


                format:

                    "RGBA8",


                texture:

                    null

            },


            {


                name:

                    GBufferAttachmentType.Emissive,


                type:

                    "Texture2D",


                format:

                    "RGBA16F",


                texture:

                    null

            },


            {


                name:

                    GBufferAttachmentType.Depth,


                type:

                    "DepthTexture",


                format:

                    "DEPTH24",


                texture:

                    null

            }

        ];

    }





    getPositionTexture():

    any {


        return this.getTexture(

            GBufferAttachmentType.Position

        );

    }





    getNormalTexture():

    any {


        return this.getTexture(

            GBufferAttachmentType.Normal

        );

    }





    getAlbedoTexture():

    any {


        return this.getTexture(

            GBufferAttachmentType.Albedo

        );

    }





    getMaterialTexture():

    any {


        return this.getTexture(

            GBufferAttachmentType.Material

        );

    }





    getEmissiveTexture():

    any {


        return this.getTexture(

            GBufferAttachmentType.Emissive

        );

    }





    getDepthTexture():

    any {


        return this.getTexture(

            GBufferAttachmentType.Depth

        );

    }





    clearAttachments():

    void {


        for (

            const attachment of

            this.getAttachments()

        ) {


            attachment.texture =

                null;

        }

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


            size:{

                width:

                    this.width,


                height:

                    this.height

            },


            attachments:

                this.getAttachments().map(

                    a => a.name

                )

        };

    }

}