import {
    PostProcess,
    PostProcessType
} from "./PostProcess";

import { ShaderProgram } from "../shader/ShaderProgram";

import { RenderContext } from "../RenderContext";



export interface ColorCorrectionOptions {


    enabled?: boolean;


    brightness?: number;


    contrast?: number;


    saturation?: number;


    exposure?: number;


    temperature?: number;


}



export class ColorCorrection extends PostProcess {


    /**
     * Parlaklık
     *
     * 0 = değişmez
     * negatif = karanlık
     * pozitif = aydınlık
     */
    public brightness = 0;



    /**
     * Kontrast seviyesi
     */
    public contrast = 1;



    /**
     * Renk doygunluğu
     */
    public saturation = 1;



    /**
     * Renk exposure
     */
    public exposure = 1;



    /**
     * Kelvin sıcaklık kaydırması
     *
     * negatif = soğuk
     * pozitif = sıcak
     */
    public temperature = 0;



    constructor(

        options:

            ColorCorrectionOptions = {}

    ) {


        super({

            type:

                PostProcessType.None,


            enabled:

                options.enabled

        });



        if (

            options.brightness !== undefined

       