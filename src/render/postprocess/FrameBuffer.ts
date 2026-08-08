export interface FrameBufferAttachment {


    name:string;


    type:string;


    format:string;


    texture:any;

}



export interface FrameBufferOptions {


    width?:number;


    height?:number;


    samples?:number;


    attachments?:FrameBufferAttachment[];

}



export class FrameBuffer {


    public width = 1;


    public height = 1;


    public samples = 1;



    private framebuffer:

        any = null;



    private attachments:

        Map<string, FrameBufferAttachment>

        = new Map();



    private initialized = false;



    constructor(

        options:

            FrameBufferOptions = {}

    ) {


        if (

            options.width !== undefined

        ) {

            this.width =

                options.width;

        }



        if (

            options.height !== undefined

        ) {

            this.height =

                options.height;

        }



        if (

            options.samples !== undefined

        ) {

            this.samples =

                options.samples;

        }



        if (

            options.attachments

        ) {


            for (

                const attachment of

                options.attachments

            ) {


                this.addAttachment(

                    attachment

                );

            }

        }

    }





    initialize(

        context:any

    ):void {


        if (

            this.initialized

        ) {

            return;

        }



        /**
         * GPU framebuffer
         */


        this.framebuffer = {


            type:

                "Framebuffer",


            width:

                this.width,


            height:

                this.height,


            samples:

                this.samples

        };



        for (

            const [

                name,

                attachment

            ] of this.attachments

        ) {


            attachment.texture = {


                type:

                    attachment.type,


                format:

                    attachment.format,


                width:

                    this.width,


                height:

                    this.height

            };

        }



        this.initialized = true;

    }





    bind(

        context:any

    ):void {


        if (

            !this.initialized

        ) {

            this.initialize(

                context

            );

        }



        if (

            context &&

            context.bindFramebuffer

        ) {


            context.bindFramebuffer(

                this.framebuffer

            );

        }

    }





    unbind(

        context:any

    ):void {


        if (

            context &&

            context.bindFramebuffer

        ) {


            context.bindFramebuffer(

                null

            );

        }

    }





    addAttachment(

        attachment:

            FrameBufferAttachment

    ):void {


        this.attachments.set(

            attachment.name,

            attachment

        );

    }





    removeAttachment(

        name:string

    ):void {


        this.attachments.delete(

            name

        );

    }





    getAttachment(

        name:string

    ):

    FrameBufferAttachment | undefined {


        return this.attachments.get(

            name

        );

    }





    getTexture(

        name:string

    ):

    any {


        return this.attachments.get(

            name

        )?.texture;

    }





    getAttachments():

    FrameBufferAttachment[] {


        return Array.from(

            this.attachments.values()

        );

    }





    resize(

        width:number,

        height:number

    ):void {


        this.width =

            width;



        this.height =

            height;



        if (

            this.initialized

        ) {


            this.dispose();


            this.initialized = false;

        }

    }





    clear(

        context:any

    ):void {


        if (

            context &&

            context.clear

        ) {


            context.clear();

        }

    }





    dispose():

    void {


        this.framebuffer = null;



        for (

            const attachment of

            this.attachments.values()

        ) {


            attachment.texture =

                null;

        }



        this.initialized = false;

    }





    isInitialized():

    boolean {


        return this.initialized;

    }





    toJSON(){


        return {


            width:

                this.width,


            height:

                this.height,


            samples:

                this.samples,


            attachments:

                this.getAttachments().map(

                    a => ({

                        name:

                            a.name,


                        type:

                            a.type,


                        format:

                            a.format

                    })

                )

        };

    }

}