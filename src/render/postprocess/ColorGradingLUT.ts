export interface ColorGradingLUTOptions {


    size?: number;


    intensity?: number;


    enabled?: boolean;

}



export enum LUTFormat {


    RGB8 = "RGB8",


    RGB16F = "RGB16F",


    RGBA16F = "RGBA16F"

}



export class ColorGradingLUT {



    /**
     * LUT çözünürlüğü
     *
     * Yaygın:
     * 16x16x16
     * 32x32x32
     * 64x64x64
     */
    public size = 32;



    /**
     * LUT uygulanma oranı
     */
    public intensity = 1.0;



    public enabled = true;



    public format:

        LUTFormat =

        LUTFormat.RGB16F;



    private texture:

        any = null;



    private data:

        Float32Array | null = null;



    constructor(

        options:

            ColorGradingLUTOptions = {}

    ) {


        if (

            options.size !== undefined

        ) {

            this.size =

                options.size;

        }



        if (

            options.intensity !== undefined

        ) {

            this.intensity =

                options.intensity;

        }



        if (

            options.enabled !== undefined

        ) {

            this.enabled =

                options.enabled;

        }


        this.createEmptyLUT();

    }





    private createEmptyLUT():

    void {


        const count =

            this.size *

            this.size *

            this.size *

            3;



        this.data =

            new Float32Array(

                count

            );



        /**
         * Identity LUT
         *
         * renkleri değiştirmez
         */


        let index = 0;



        for (

            let b = 0;

            b < this.size;

            b++

        ) {


            for (

                let g = 0;

                g < this.size;

                g++

            ) {


                for (

                    let r = 0;

                    r < this.size;

                    r++

                ) {


                    this.data[index++] =

                        r /

                        (this.size - 1);



                    this.data[index++] =

                        g /

                        (this.size - 1);



                    this.data[index++] =

                        b /

                        (this.size - 1);

                }

            }

        }

    }





    upload(

        context:any

    ):void {


        /**
         * GPU 3D texture upload
         */


        this.texture = {


            type:

                "3DLUT",


            size:

                this.size,


            format:

                this.format

        };

    }





    load(

        lutData:

            Float32Array

    ):void {


        this.data =

            lutData;

    }





    getTexture():

    any {


        return this.texture;

    }





    getData():

    Float32Array | null {


        return this.data;

    }





    setIntensity(

        value:number

    ):void {


        this.intensity =

            Math.max(

                0,

                Math.min(

                    1,

                    value

                )

            );

    }





    enable():

    void {


        this.enabled = true;

    }





    disable():

    void {


        this.enabled = false;

    }





    applyColorTransform(

        color:any

    ):any {


        if (

            !this.enabled ||

            !this.data

        ) {

            return color;

        }



        /**
         * CPU fallback
         *
         * Gerçek uygulamada shader LUT lookup yapar
         */


        return {


            r:

                color.r,


            g:

                color.g,


            b:

                color.b,


            a:

                color.a

        };

    }





    reset():

    void {


        this.intensity = 1;


        this.enabled = true;


        this.createEmptyLUT();

    }





    dispose():

    void {


        this.texture = null;


        this.data = null;

    }





    toJSON(){


        return {


            size:

                this.size,


            intensity:

                this.intensity,


            enabled:

                this.enabled,


            format:

                this.format

        };

    }

}