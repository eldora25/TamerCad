import {
    FrameBuffer,
    FrameBufferAttachment
} from "./FrameBuffer";



export interface BloomBufferOptions {


    width?: number;


    height?: number;


    levels?: number;

}



export enum BloomBufferAttachment {


    Bright = "bright"

}



export class BloomBuffer extends FrameBuffer {


    /**
     * Blur pyramid seviyesi
     */
    public levels = 5;



    private mipTextures:

        any[] = [];



    constructor(

        options:

            BloomBufferOptions = {}

    ) {


        super({

            width:

                options.width,


            height:

                options.height,


            attachments:

                BloomBuffer.createAttachments()

        });



        if (

            options.levels !== undefined

        ) {


            this.levels =

                Math.max(

                    1,

                    Math.min(

                        8,

                        options.levels

                    )

                );

        }

    }





    static createAttachments():

    FrameBufferAttachment[] {


        return [


            {


                name:

                    BloomBufferAttachment.Bright,


                type:

                    "Texture2D",


                format:

                    "RGBA16F",


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


        this.mipTextures = [];



        let width =

            this.width;



        let height =

            this.height;



        for (

            let i = 0;

            i < this.levels;

            i++

        ) {


            this.mipTextures.push({


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





    getBrightTexture():

    any {


        return this.getTexture(

            BloomBufferAttachment.Bright

        );

    }





    getMipTexture(

        level:number

    ):

    any {


        return this.mipTextures[level];

    }





    getMipChain():

    any[] {


        return this.mipTextures;

    }





    setLevels(

        value:number

    ):void {


        this.levels =

            Math.max(

                1,

                Math.min(

                    8,

                    value

                )

            );



        this.createMipChain();

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


        const bright =

            this.getBrightTexture();



        if (

            bright

        ) {

            bright.texture =

                null;

        }



        for (

            const mip of

            this.mipTextures

        ) {


            mip.texture =

                null;

        }

    }





    debugInfo(){


        return {


            type:

                "BloomBuffer",


            levels:

                this.levels,


            size:{

                width:

                    this.width,


                height:

                    this.height

            },


            mipChain:

                this.mipTextures.map(

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