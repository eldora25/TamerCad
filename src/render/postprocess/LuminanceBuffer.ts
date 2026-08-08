import {
    FrameBuffer,
    FrameBufferAttachment
} from "./FrameBuffer";



export interface LuminanceBufferOptions {


    width?: number;


    height?: number;


    levels?: number;


    format?: string;

}



export enum LuminanceAttachment {


    Luminance = "luminance",


    Downsample = "downsample"

}



export class LuminanceBuffer extends FrameBuffer {



    /**
     * Downsample pyramid seviyesi
     *
     * Auto exposure için kullanılır
     */
    public levels = 6;



    private mipChain:

        any[] = [];



    constructor(

        options:

            LuminanceBufferOptions = {}

    ) {


        super({

            width:

                options.width,


            height:

                options.height,


            attachments:

                LuminanceBuffer.createAttachments(

                    options

                )

        });



        if (

            options.levels !== undefined

        ) {


            this.levels =

                Math.max(

                    1,

                    Math.min(

                        10,

                        options.levels

                    )

                );

        }

    }





    static createAttachments(

        options:

            LuminanceBufferOptions

    ):

    FrameBufferAttachment[] {


        return [


            {


                name:

                    LuminanceAttachment.Luminance,


                type:

                    "Texture2D",


                format:

                    options.format ??

                    "R16F",


                texture:

                    null

            },


            {


                name:

                    LuminanceAttachment.Downsample,


                type:

                    "Texture2D",


                format:

                    "R16F",


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


        this.createMipChain();

    }





    private createMipChain():

    void {


        this.mipChain = [];



        let width =

            this.width;



        let height =

            this.height;



        for (

            let i = 0;

            i < this.levels;

            i++

        ) {


            this.mipChain.push({


                level:

                    i,


                width,


                height,


                texture:

                    null

            });



            width =

                Math.max(

                    1,

                    Math.floor(

                        width / 2

                    )

                );



            height =

                Math.max(

                    1,

                    Math.floor(

                        height / 2

                    )

                );

        }

    }





    getLuminanceTexture():

    any {


        return this.getTexture(

            LuminanceAttachment.Luminance

        );

    }





    getDownsampleTexture():

    any {


        return this.getTexture(

            LuminanceAttachment.Downsample

        );

    }





    getMipLevel(

        level:number

    ):

    any {


        return this.mipChain[level];

    }





    getMipChain():

    any[] {


        return this.mipChain;

    }





    calculateAverageLuminance():

    number {


        /**
         * GPU tarafında:
         *
         * mip son seviyesi
         * veya histogram reduction
         *
         * kullanılır.
         */


        return 1.0;

    }





    resize(

        width:number,

        height:number

    ):void {


        super.resize(

            width,

            height

        );


        this.createMipChain();

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



        for (

            const mip of

            this.mipChain

        ) {


            mip.texture =

                null;

        }

    }





    debugInfo(){


        return {


            type:

                "LuminanceBuffer",


            levels:

                this.levels,


            size:{

                width:

                    this.width,


                height:

                    this.height

            },


            mipChain:

                this.mipChain.map(

                    m => ({

                        level:

                            m.level,


                        width:

                            m.width,


                        height:

                            m.height

                    })

                )

        };

    }

}