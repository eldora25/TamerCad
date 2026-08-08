import {
    FrameBuffer,
    FrameBufferAttachment
} from "./FrameBuffer";



export interface TAABufferOptions {


    width?: number;


    height?: number;


    format?: string;


}



export enum TAAAttachment {


    Accumulation = "accumulation",


    Resolve = "resolve",


    History = "history",


    Moments = "moments"

}



export class TAABuffer extends FrameBuffer {



    /**
     * Ping-pong history index
     */
    private historyIndex = 0;



    /**
     * Temporal frame sayısı
     */
    public frameCount = 0;



    private historyTextures:

        any[] = [];



    constructor(

        options:

            TAABufferOptions = {}

    ) {


        super({

            width:

                options.width,


            height:

                options.height,


            attachments:

                TAABuffer.createAttachments(

                    options

                )

        });

    }





    static createAttachments(

        options:

            TAABufferOptions

    ):

    FrameBufferAttachment[] {


        return [


            {


                name:

                    TAAAttachment.Accumulation,


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

                    TAAAttachment.Resolve,


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

                    TAAAttachment.History,


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

                    TAAAttachment.Moments,


                type:

                    "Texture2D",


                format:

                    "RG16F",


                texture:

                    null

            }


        ];

    }





    override initialize(

        context:any

    ):void {


        super.initialize(

            context

        );


        this.createHistoryBuffers();

    }





    private createHistoryBuffers():

    void {


        this.historyTextures = [


            {


                index:

                    0,


                texture:

                    null

            },


            {


                index:

                    1,


                texture:

                    null

            }

        ];

    }





    getAccumulationTexture():

    any {


        return this.getTexture(

            TAAAttachment.Accumulation

        );

    }





    getResolveTexture():

    any {


        return this.getTexture(

            TAAAttachment.Resolve

        );

    }





    getHistoryTexture():

    any {


        return this.historyTextures[

            this.historyIndex

        ];

    }





    getPreviousHistoryTexture():

    any {


        return this.historyTextures[

            1 -

            this.historyIndex

        ];

    }





    getMomentsTexture():

    any {


        return this.getTexture(

            TAAAttachment.Moments

        );

    }





    swapHistory():

    void {


        this.historyIndex =

            1 -

            this.historyIndex;



        this.frameCount++;

    }





    resetHistory():

    void {


        this.historyIndex =

            0;


        this.frameCount =

            0;



        for (

            const history of

            this.historyTextures

        ) {


            history.texture =

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



        this.resetHistory();

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



        this.resetHistory();

    }





    debugInfo(){


        return {


            type:

                "TAABuffer",


            historyIndex:

                this.historyIndex,


            frameCount:

                this.frameCount,


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