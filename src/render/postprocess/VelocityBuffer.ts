import {
    FrameBuffer,
    FrameBufferAttachment
} from "./FrameBuffer";



export interface VelocityBufferOptions {


    width?: number;


    height?: number;


    format?: string;

}



export enum VelocityAttachment {


    Velocity = "velocity"


}



export class VelocityBuffer extends FrameBuffer {



    public currentViewProjection:

        any = null;



    public previousViewProjection:

        any = null;



    public currentCameraPosition:

        any = null;



    public previousCameraPosition:

        any = null;



    constructor(

        options:

            VelocityBufferOptions = {}

    ) {


        super({

            width:

                options.width,


            height:

                options.height,


            attachments:

                VelocityBuffer.createAttachments(

                    options

                )

        });

    }





    static createAttachments(

        options:

            VelocityBufferOptions

    ):

    FrameBufferAttachment[] {


        return [


            {


                name:

                    VelocityAttachment.Velocity,


                type:

                    "Texture2D",


                format:

                    options.format ??

                    "RGBA16F",


                texture:

                    null

            }


        ];

    }





    getVelocityTexture():

    any {


        return this.getTexture(

            VelocityAttachment.Velocity

        );

    }





    updateMatrices(

        current:any,

        previous:any

    ):void {


        this.currentViewProjection =

            current;



        this.previousViewProjection =

            previous;

    }





    updateCameraPositions(

        current:any,

        previous:any

    ):void {


        this.currentCameraPosition =

            current;



        this.previousCameraPosition =

            previous;

    }





    calculateVelocity(

        currentPosition:any,

        previousPosition:any

    ):any {


        /**
         * Dünya uzayındaki hareket
         *
         * gerçek shader tarafında
         * reprojection için kullanılır
         */


        return {


            x:

                currentPosition.x -

                previousPosition.x,


            y:

                currentPosition.y -

                previousPosition.y,


            z:

                currentPosition.z -

                previousPosition.z

        };

    }





    reset():

    void {


        this.currentViewProjection =

            null;


        this.previousViewProjection =

            null;


        this.currentCameraPosition =

            null;


        this.previousCameraPosition =

            null;

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



        this.reset();

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

                "VelocityBuffer",


            size:{

                width:

                    this.width,


                height:

                    this.height

            },


            attachment:

                VelocityAttachment.Velocity

        };

    }

}