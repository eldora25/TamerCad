import {
    FrameBuffer,
    FrameBufferAttachment
} from "./FrameBuffer";



export interface MotionVectorBufferOptions {


    width?: number;


    height?: number;


    format?: string;


    includeObjectMotion?: boolean;

}



export enum MotionVectorAttachment {


    Velocity = "velocity",


    ObjectVelocity = "objectVelocity",


    CameraVelocity = "cameraVelocity"

}



export class MotionVectorBuffer extends FrameBuffer {



    /**
     * Obje hareket vektörleri dahil mi?
     */
    public includeObjectMotion = true;



    /**
     * Frame zaman bilgisi
     */
    public currentTime = 0;


    public previousTime = 0;



    private rendered = false;



    constructor(

        options:

            MotionVectorBufferOptions = {}

    ) {


        super({

            width:

                options.width,


            height:

                options.height,


            attachments:

                MotionVectorBuffer.createAttachments(

                    options

                )

        });



        if (

            options.includeObjectMotion !== undefined

        ) {


            this.includeObjectMotion =

                options.includeObjectMotion;

        }

    }





    static createAttachments(

        options:

            MotionVectorBufferOptions

    ):

    FrameBufferAttachment[] {


        const attachments:

            FrameBufferAttachment[] = [


                {


                    name:

                        MotionVectorAttachment.Velocity,


                    type:

                        "Texture2D",


                    format:

                        options.format ??

                        "RG16F",


                    texture:

                        null

                }


            ];



        if (

            options.includeObjectMotion

        ) {


            attachments.push({


                name:

                    MotionVectorAttachment.ObjectVelocity,


                type:

                    "Texture2D",


                format:

                    "RG16F",


                texture:

                    null

            });


            attachments.push({


                name:

                    MotionVectorAttachment.CameraVelocity,


                type:

                    "Texture2D",


                format:

                    "RG16F",


                texture:

                    null

            });

        }



        return attachments;

    }





    getVelocityTexture():

    any {


        return this.getTexture(

            MotionVectorAttachment.Velocity

        );

    }





    getObjectVelocityTexture():

    any {


        return this.getTexture(

            MotionVectorAttachment.ObjectVelocity

        );

    }





    getCameraVelocityTexture():

    any {


        return this.getTexture(

            MotionVectorAttachment.CameraVelocity

        );

    }





    beginFrame(

        time:number

    ):void {


        this.previousTime =

            this.currentTime;



        this.currentTime =

            time;



        this.rendered = false;

    }





    endFrame():

    void {


        this.rendered = true;

    }





    calculateScreenVelocity(

        currentPosition:any,

        previousPosition:any

    ):any {


        return {


            x:

                currentPosition.x -

                previousPosition.x,


            y:

                currentPosition.y -

                previousPosition.y

        };

    }





    calculateObjectMotion(

        currentMatrix:any,

        previousMatrix:any

    ):any {


        /**
         * Skinned mesh,
         * animation,
         * deformasyon
         */


        return {


            current:

                currentMatrix,


            previous:

                previousMatrix

        };

    }





    reset():

    void {


        this.currentTime = 0;


        this.previousTime = 0;


        this.rendered = false;

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

                "MotionVectorBuffer",


            size:{

                width:

                    this.width,


                height:

                    this.height

            },


            objectMotion:

                this.includeObjectMotion,


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