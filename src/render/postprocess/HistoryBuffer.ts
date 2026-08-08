import {
    FrameBuffer,
    FrameBufferAttachment
} from "./FrameBuffer";



export interface HistoryBufferOptions {


    width?:number;


    height?:number;


    colorFormat?:string;


    depthFormat?:string;


}



export enum HistoryBufferAttachment {


    Color = "historyColor",


    Depth = "historyDepth",


    Velocity = "historyVelocity"

}



export class HistoryBuffer extends FrameBuffer {


    /**
     * Kaç frame tutulduğu
     */
    public frameIndex = 0;



    /**
     * Önceki view-projection matrisi
     */
    public previousMatrix:

        any = null;



    /**
     * Önceki kamera pozisyonu
     */
    public previousCameraPosition:

        any = null;



    constructor(

        options:

            HistoryBufferOptions = {}

    ) {


        super({

            width:

                options.width,


            height:

                options.height,


            attachments:

                HistoryBuffer.createAttachments(

                    options

                )

        });

    }





    static createAttachments(

        options:

            HistoryBufferOptions

    ):

    FrameBufferAttachment[] {


        return [


            {


                name:

                    HistoryBufferAttachment.Color,


                type:

                    "Texture2D",


                format:

                    options.colorFormat ??

                    "RGBA16F",


                texture:

                    null

            },


            {


                name:

                    HistoryBufferAttachment.Depth,


                type:

                    "DepthTexture",


                format:

                    options.depthFormat ??

                    "DEPTH24",


                texture:

                    null

            },


            {


                name:

                    HistoryBufferAttachment.Velocity,


                type:

                    "Texture2D",


                format:

                    "RGBA16F",


                texture:

                    null

            }


        ];

    }





    getColorTexture():

    any {


        return this.getTexture(

            HistoryBufferAttachment.Color

        );

    }





    getDepthTexture():

    any {


        return this.getTexture(

            HistoryBufferAttachment.Depth

        );

    }





    getVelocityTexture():

    any {


        return this.getTexture(

            HistoryBufferAttachment.Velocity

        );

    }





    updateMatrix(

        matrix:any

    ):void {


        this.previousMatrix =

            matrix;

    }





    updateCameraPosition(

        position:any

    ):void {


        this.previousCameraPosition =

            position;

    }





    advanceFrame():

    void {


        this.frameIndex++;

    }





    resetFrame():

    void {


        this.frameIndex =

            0;


        this.previousMatrix =

            null;


        this.previousCameraPosition =

            null;

    }





    swap(

        other:

            HistoryBuffer

    ):void {


        const currentAttachments =

            this.getAttachments();



        const otherAttachments =

            other.getAttachments();



        for (

            let i = 0;

            i < currentAttachments.length;

            i++

        ) {


            const temp =

                currentAttachments[i].texture;



            currentAttachments[i].texture =

                otherAttachments[i].texture;



            otherAttachments[i].texture =

                temp;

        }

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


        this.resetFrame();

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

                "HistoryBuffer",


            frameIndex:

                this.frameIndex,


            size:{

                width:

                    this.width,


                height:

                    this.height

            },


            attachments:

                this.getAttachments()

                .map(

                    a => a.name

                )

        };

    }

}