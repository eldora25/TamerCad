export interface ExposureControllerOptions {


    exposure?: number;


    autoExposure?: boolean;


    minExposure?: number;


    maxExposure?: number;


    adaptationSpeed?: number;


}



export enum ExposureMode {


    Manual = "Manual",


    Auto = "Auto"

}



export class ExposureController {



    public mode:

        ExposureMode =

        ExposureMode.Manual;



    /**
     * EV100 exposure değeri
     */
    public exposure = 0.0;



    /**
     * Otomatik exposure hedefi
     */
    public targetExposure = 0.0;



    public minExposure = -10;


    public maxExposure = 10;



    /**
     * Eye adaptation hızı
     */
    public adaptationSpeed = 2.0;



    /**
     * Ortalama sahne luminance
     */
    private averageLuminance = 1.0;



    private initialized = false;



    constructor(

        options:

            ExposureControllerOptions = {}

    ) {


        if (

            options.exposure !== undefined

        ) {

            this.exposure =

                options.exposure;

        }



        if (

            options.autoExposure

        ) {

            this.mode =

                ExposureMode.Auto;

        }



        if (

            options.minExposure !== undefined

        ) {

            this.minExposure =

                options.minExposure;

        }



        if (

            options.maxExposure !== undefined

        ) {

            this.maxExposure =

                options.maxExposure;

        }



        if (

            options.adaptationSpeed !== undefined

        ) {

            this.adaptationSpeed =

                options.adaptationSpeed;

        }

    }





    initialize():

    void {


        this.initialized = true;

    }





    update(

        deltaTime:number

    ):void {


        if (

            this.mode !==

            ExposureMode.Auto

        ) {

            return;

        }



        const difference =

            this.targetExposure -

            this.exposure;



        this.exposure +=

            difference *

            Math.min(

                1,

                deltaTime *

                this.adaptationSpeed

            );



        this.exposure =

            Math.max(

                this.minExposure,

                Math.min(

                    this.maxExposure,

                    this.exposure

                )

            );

    }





    setExposure(

        value:number

    ):void {


        this.mode =

            ExposureMode.Manual;



        this.exposure =

            Math.max(

                this.minExposure,

                Math.min(

                    this.maxExposure,

                    value

                )

            );

    }





    enableAutoExposure():

    void {


        this.mode =

            ExposureMode.Auto;

    }





    disableAutoExposure():

    void {


        this.mode =

            ExposureMode.Manual;

    }





    setAverageLuminance(

        luminance:number

    ):void {


        this.averageLuminance =

            Math.max(

                0.0001,

                luminance

            );



        /**
         * Basit EV hesabı
         *
         * Gerçek sistemde:
         * histogram + percentile kullanılır
         */


        this.targetExposure =

            -Math.log2(

                this.averageLuminance

            );

    }





    getExposure():

    number {


        return this.exposure;

    }





    getExposureMultiplier():

    number {


        /**
         * HDR shader çarpanı
         *
         * 2^EV
         */


        return Math.pow(

            2,

            this.exposure

        );

    }





    setLimits(

        min:number,

        max:number

    ):void {


        this.minExposure =

            min;


        this.maxExposure =

            max;

    }





    bind(

        shader:any

    ):void {


        if (

            !shader

        ) {

            return;

        }



        shader.setUniform(

            "exposure",

            this.getExposureMultiplier()

        );

    }





    reset():

    void {


        this.exposure = 0;


        this.targetExposure = 0;


        this.averageLuminance = 1;

    }





    debugInfo(){


        return {


            mode:

                this.mode,


            exposure:

                this.exposure,


            target:

                this.targetExposure,


            luminance:

                this.averageLuminance

        };

    }





    toJSON(){


        return {


            mode:

                this.mode,


            exposure:

                this.exposure,


            minExposure:

                this.minExposure,


            maxExposure:

                this.maxExposure,


            adaptationSpeed:

                this.adaptationSpeed

        };

    }

}