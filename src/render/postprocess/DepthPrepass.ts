import {
    FrameBuffer,
    FrameBufferAttachment
} from "./FrameBuffer";



export interface DepthPrepassOptions {


    width?: number;


    height?: number;


    depthFormat?: string;


    generateNormal?: boolean;

}



export enum DepthPrepassAttachment {


    Depth = "depth",


    Normal = "normal"

}



export class DepthPrepass extends FrameBuffer {



    public enabled = true;



    public generateNormal = false;



    private rendered = false;



    constructor(

        options:

            DepthPrepassOptions = {}

    ) {


        super({

            width:

                options.width,


            height:

                options.height,


            attachments:

                DepthPrepass.createAttachments(

                    options

                )

        });



        if (

            options.generateNormal !== undefined

        ) {


            this.generateNormal =

                options.generateNormal;

        }

    }





    static createAttachments(

        options:

            DepthPrepassOptions

    ):

    FrameBufferAttachment[] {


        const attachments:

            FrameBufferAttachment[] = [


                {


                    name:

                        DepthPrepassAttachment.Depth,


                    type:

                        "DepthTexture",


                    format:

                        options.depthFormat ??

                        "DEPTH32F",


                    texture:

                        null

                }


            ];



        if (

            options.generateNormal

        ) {


            attachments.push({


                name:

                    DepthPrepassAttachment.Normal,


                type:

                    "Texture2D",


                format:

                    "RGBA16F",


                texture:

                    null

            });

        }



        return attachments;

    }





    getDepthTexture():

    any {


        return this.getTexture(

            DepthPrepassAttachment.Depth

        );

    }





    getNormalTexture():

    any {


        return this.getTexture(

            DepthPrepassAttachment.Normal

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

                "DepthPrepass",


            enabled:

                this.enabled,


            generated:

                this.rendered,


            attachments:

                this.getAttachments()

                .map(

                    a => a.name

                )

        };

    }

}