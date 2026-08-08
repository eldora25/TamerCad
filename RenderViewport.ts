export interface ViewportRectangle {

    x: number;

    y: number;

    width: number;

    height: number;

}


export class RenderViewport {

    private rectangle: ViewportRectangle = {

        x: 0,

        y: 0,

        width: 800,

        height: 600

    };


    private pixelRatio = 1.0;


    private enabled = true;


    constructor(

        width = 800,

        height = 600

    ) {

        this.setSize(

            width,

            height

        );

    }



    setPosition(

        x: number,

        y: number

    ): void {

        this.rectangle.x = x;

        this.rectangle.y = y;

    }



    setSize(

        width: number,

        height: number

    ): void {

        this.rectangle.width = width;

        this.rectangle.height = height;

    }



    resize(

        width: number,

        height: number

    ): void {

        this.setSize(

            width,

            height

        );

    }



    getWidth(): number {

        return this.rectangle.width;

    }



    getHeight(): number {

        return this.rectangle.height;

    }



    getAspectRatio(): number {

        if (

            this.rectangle.height === 0

        ) {

            return 1;

        }


        return (

            this.rectangle.width /

            this.rectangle.height

        );

    }



    getRectangle():

    ViewportRectangle {

        return {

            ...this.rectangle

        };

    }



    setPixelRatio(

        ratio: number

    ): void {

        if (

            ratio <= 0

        ) {

            throw new Error(

                "Pixel ratio must be greater than zero."

            );

        }


        this.pixelRatio = ratio;

    }



    getPixelRatio(): number {

        return this.pixelRatio;

    }



    getPhysicalWidth(): number {

        return (

            this.rectangle.width *

            this.pixelRatio

        );

    }



    getPhysicalHeight(): number {

        return (

            this.rectangle.height *

            this.pixelRatio

        );

    }



    enable(): void {

        this.enabled = true;

    }



    disable(): void {

        this.enabled = false;

    }



    isEnabled(): boolean {

        return this.enabled;

    }



    apply(

        context: any

    ): void {

        /**
         * GPU viewport uygulaması
         *
         * WebGL:
         *
         * gl.viewport(
         *    x,
         *    y,
         *    width,
         *    height
         * )
         *
         */


        if (

            !this.enabled

        ) {

            return;

        }



        if (

            context &&

            typeof context.viewport ===

            "function"

        ) {


            context.viewport(

                this.rectangle.x,

                this.rectangle.y,

                this.getPhysicalWidth(),

                this.getPhysicalHeight()

            );

        }

    }



    clone(): RenderViewport {

        const viewport =

            new RenderViewport(

                this.rectangle.width,

                this.rectangle.height

            );


        viewport.setPosition(

            this.rectangle.x,

            this.rectangle.y

        );


        viewport.setPixelRatio(

            this.pixelRatio

        );


        viewport.enabled =

            this.enabled;


        return viewport;

    }



    toJSON() {

        return {

            rectangle:

                this.rectangle,

            pixelRatio:

                this.pixelRatio,

            enabled:

                this.enabled

        };

    }



    static fromJSON(

        data: any

    ): RenderViewport {


        const viewport =

            new RenderViewport(

                data.rectangle.width,

                data.rectangle.height

            );


        viewport.setPosition(

            data.rectangle.x,

            data.rectangle.y

        );


        viewport.setPixelRatio(

            data.pixelRatio

        );


        if (

            !data.enabled

        ) {

            viewport.disable();

        }


        return viewport;

    }

}