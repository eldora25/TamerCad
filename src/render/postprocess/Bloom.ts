import {
    PostProcess,
    PostProcessType
} from "./PostProcess";

import { ShaderProgram } from "../shader/ShaderProgram";

import { RenderContext } from "../RenderContext";



export enum ToneMappingOperator {


    None = "None",


    Reinhard = "Reinhard",


    ACES = "ACES",


    Filmic = "Filmic",


    Uncharted2 = "Uncharted2"

}



export interface ToneMappingOptions {


    enabled?: boolean;


    operator?: ToneMappingOperator;


    exposure?: number;


    gamma?: number;

}



export class ToneMapping extends PostProcess {


    /**
     * HDR exposure değeri
     */
    public exposure = 1.0;



    /**
     * Gamma correction
     */
    public gamma = 2.2;



    public operator:

        ToneMappingOperator =

        ToneMappingOperator.ACES;



    constructor(

        options:

            ToneMappingOptions = {}

    ) {


        super({

            type:

                PostProcessType.ToneMapping,


            enabled:

                options.enabled

        });



        if (

            options.operator

        ) {

            this.operator =

                options.operator;

        }



        if (

            options.exposure !== undefined

        ) {

            this.exposure =

                options.exposure;

        }



        if (

            options.gamma !== undefined

        ) {

            this.gamma =

                options.gamma;

        }

    }





    override process(

        context:

            RenderContext

    ):any {


        if (

            !this.enabled

        ) {

            return this.inputTexture;

        }



        const shader =

            this.getShader();



        if (

            shader

        ) {


            shader.setUniform(

                "toneMappingExposure",

                this.exposure

            );



            shader.setUniform(

                "toneMappingGamma",

                this.gamma

            );



            shader.setUniform(

                "toneMappingOperator",

                this.getOperatorValue()

            );

        }



        return super.process(

            context

        );

    }





    setExposure(

        value:number

    ):void {


        this.exposure =

            Math.max(

                0,

                value

            );

    }





    setGamma(

        value:number

    ):void {


        this.gamma =

            Math.max(

                0.1,

                value

            );

    }





    setOperator(

        operator:

            ToneMappingOperator

    ):void {


        this.operator =

            operator;

    }





    private getOperatorValue():

    number {


        switch(

            this.operator

        ){


            case ToneMappingOperator.Reinhard:

                return 1;


            case ToneMappingOperator.ACES:

                return 2;


            case ToneMappingOperator.Filmic:

                return 3;


            case ToneMappingOperator.Uncharted2:

                return 4;


            default:

                return 0;

        }

    }





    getSettings(){


        return {


            operator:

                this.operator,


            exposure:

                this.exposure,


            gamma:

                this.gamma,


            enabled:

                this.enabled

        };

    }





    override toJSON(){


        return {


            ...super.toJSON(),


            operator:

                this.operator,


            exposure:

                this.exposure,


            gamma:

                this.gamma

        };

    }





    static fromJSON(

        data:any

    ):

    ToneMapping {


        return new ToneMapping({

            enabled:

                data.enabled,


            operator:

                data.operator,


            exposure:

                data.exposure,


            gamma:

                data.gamma

        });

    }

}