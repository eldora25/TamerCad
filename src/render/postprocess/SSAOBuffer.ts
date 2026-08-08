import {
    FrameBuffer,
    FrameBufferAttachment
} from "./FrameBuffer";



export interface SSAOBufferOptions {


    width?: number;


    height?: number;

}



export enum SSAOBufferAttachment {


    Occlusion = "occlusion",


    Blur = "blur"

}



export class SSAOBuffer extends FrameBuffer {



    constructor(

        options:

            SSAOBufferOptions = {}

    ) {


        super({

            width:

                options.width,


            height:

                options.height,


            attachments:

                SSAOBuffer.createAttachments()

        });

    }





    static createAttachments():

    FrameBufferAttachment[] {


        return [


            {


                name:

                    SSAOBufferAttachment.Occlusion,


                type:

                    "Texture2D",


                format:

                    "R8",


                texture:

                    null

            },


            {


                name:

                    SSAOBufferAttachment.Blur,


                type:

                    "Texture2D",


                format:

                    "R8",


                texture:

                    null

            }


        ];

    }





    getOcclusionTexture():

    any {


        return this.getTexture(

            SSAOBufferAttachment.Occlusion

        );

    }





    getBlurTexture():

    any {


        return this.getTexture(

            SSAOBufferAttachment.Blur

        );

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

    }





    debugInfo(){


        return {


            type:

                "SSAOBuffer",


            width:

                this.width,


            height:

                this.height,


            attachments:

                this.getAttachments()

                .map(

                    a => a.name

                )

        };

    }

}