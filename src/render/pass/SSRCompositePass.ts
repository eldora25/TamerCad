
import {
    SSRBuffer
} from "./SSRBuffer";


import {
    SSRComposite
} from "../postprocess/SSRComposite";


import {
    ReflectionProbeBuffer
} from "../postprocess/ReflectionProbeBuffer";


import {
    EnvironmentMap
} from "../postprocess/EnvironmentMap";


import {
    SSRBRDF
} from "../postprocess/SSRBRDF";



export interface SSRCompositePassOptions {


    enabled?: boolean;


    reflectionStrength?: number;


    fresnelPower?: number;


    metallicBoost?: number;


}





export enum SSRCompositePassMode {


    SSR = "SSR",


    Probe = "Probe",


    Hybrid = "Hybrid"


}





export interface SSRCompositeInput {


    ssrTexture:any;


    probeTexture?:any;


    environmentTexture?:any;


    material:any;


    viewAngle:number;


}







export class SSRCompositePass {



    public enabled = true;



    public mode:

        SSRCompositePassMode =

        SSRCompositePassMode.Hybrid;



    public reflectionStrength = 1.0;



    public fresnelPower = 5.0;



    public metallicBoost = 1.2;



    private ssrBuffer:

        SSRBuffer | null = null;



    private probe:

        ReflectionProbeBuffer | null = null;



    private environment:

        EnvironmentMap | null = null;



    private composite:

        SSRComposite | null = null;



    private brdf:

        SSRBRDF | null = null;



    private initialized = false;



    constructor(

        options:

            SSRCompositePassOptions = {}

    ){



        if(

            options.enabled !== undefined

        ){


            this.enabled =

                options.enabled;


        }



        if(

            options.reflectionStrength !== undefined

        ){


            this.reflectionStrength =

                options.reflectionStrength;


        }



        if(

            options.fresnelPower !== undefined

        ){


            this.fresnelPower =

                options.fresnelPower;


        }



        if(

            options.metallicBoost !== undefined

        ){


            this.metallicBoost =

                options.metallicBoost;


        }


    }


/*
====================================================
Buffer Connections
====================================================
*/


setSSRBuffer(

    buffer:

        SSRBuffer

):

void {


    this.ssrBuffer =

        buffer;


}





setReflectionProbe(

    probe:

        ReflectionProbeBuffer

):

void {


    this.probe =

        probe;


}





setEnvironmentMap(

    environment:

        EnvironmentMap

):

void {


    this.environment =

        environment;


}





setComposite(

    composite:

        SSRComposite

):

void {


    this.composite =

        composite;


}





setBRDF(

    brdf:

        SSRBRDF

):

void {


    this.brdf =

        brdf;


}





/*
====================================================
Initialize
====================================================
*/


initialize():

void {



    if(

        this.initialized

    ){


        return;


    }





    if(

        !this.composite

    ){



        this.composite =

            new SSRComposite({

                reflectionStrength:

                    this.reflectionStrength,


                fresnelPower:

                    this.fresnelPower,


                metallicBoost:

                    this.metallicBoost

            });


    }





    if(

        !this.brdf

    ){



        this.brdf =

            new SSRBRDF();


    }





    this.composite

        .setSSRBuffer(

            this.ssrBuffer!

        );





    if(

        this.probe

    ){


        this.composite

            .setReflectionProbe(

                this.probe

            );


    }





    if(

        this.environment

    ){


        this.composite

            .setEnvironmentMap(

                this.environment

            );


    }





    this.brdf

        .setComposite(

            this.composite

        );





    this.initialized =

        true;


}





/*
====================================================
Prepare Frame
====================================================
*/


begin():

void {


    if(

        !this.enabled

    ){


        return;


    }





    if(

        !this.initialized

    ){


        this.initialize();


    }



}


/*
====================================================
Material Preparation
====================================================
*/


private prepareMaterial(

    material:any

):

any {



    return {


        roughness:

            material?.roughness ??

            0.0,



        metallic:

            material?.metallic ??

            0.0,



        baseReflectivity:

            material?.baseReflectivity ??

            0.04



    };


}





/*
====================================================
Reflection Source Resolve
====================================================
*/


private resolveReflection(

    input:

        SSRCompositeInput

):

any {



    if(

        !this.composite

    ){


        return input.ssrTexture;


    }





    return this.composite

        .composite(

            input.ssrTexture,


            input.probeTexture ?? null,


            this.prepareMaterial(

                input.material

            ),


            input.viewAngle


        );


}





/*
====================================================
BRDF Apply
====================================================
*/


private applyBRDF(

    color:any,

    material:any

):

any {



    if(

        !this.brdf

    ){


        return color;


    }





    const result =

        this.brdf

            .evaluate({

                viewDotNormal:

                    1.0,


                lightDotNormal:

                    1.0,


                halfDotNormal:

                    1.0,


                viewDotHalf:

                    1.0,


                roughness:

                    material.roughness,


                metallic:

                    material.metallic,


                baseReflectivity:

                    material.baseReflectivity


            });





    return {


        color,


        specular:

            result.specular,


        reflectionWeight:

            result.reflectionWeight



    };


}





/*
====================================================
Execute Composite
====================================================
*/


execute(

    input:

        SSRCompositeInput

):

any {



    if(

        !this.enabled

    ){


        return {


            color:

                input.ssrTexture,


            weight:

                1.0


        };


    }





    const material =

        this.prepareMaterial(

            input.material

        );





    const reflection =

        this.resolveReflection(

            input

        );





    const result =

        this.applyBRDF(

            reflection,


            material

        );





    return {


        type:

            "SSRCompositeResult",



        mode:

            this.mode,



        reflection:

            result,



        material


    };


}


/*
====================================================
Mode Control
====================================================
*/


setMode(

    mode:

        SSRCompositePassMode

):

void {


    this.mode =

        mode;



    if(

        this.composite

    ){


        switch(

            mode

        ){



            case SSRCompositePassMode.SSR:


                this.composite.mode =

                    "SSROnly" as any;


                break;





            case SSRCompositePassMode.Probe:


                this.composite.mode =

                    "ProbeOnly" as any;


                break;





            default:


                this.composite.mode =

                    "Hybrid" as any;


                break;


        }


    }


}





/*
====================================================
Resize
====================================================
*/


resize(

    width:number,

    height:number

):

void {



    if(

        this.ssrBuffer

    ){


        this.ssrBuffer.resize(

            width,

            height

        );


    }


}





/*
====================================================
Clear Resources
====================================================
*/


clear():

void {



    if(

        this.ssrBuffer

    ){


        this.ssrBuffer.clear();


    }





}





/*
====================================================
Reset Pass
====================================================
*/


reset():

void {



    this.initialized =

        false;



    this.ssrBuffer =

        null;



    this.probe =

        null;



    this.environment =

        null;



    this.composite =

        null;



    this.brdf =

        null;



}





/*
====================================================
Frame End
====================================================
*/


end():

void {


    if(

        !this.enabled

    ){


        return;


    }





}





/*
====================================================
Runtime Update
====================================================
*/


update():

void {


    if(

        this.composite

    ){


        this.composite.reflectionStrength =

            this.reflectionStrength;



        this.composite.fresnelPower =

            this.fresnelPower;



        this.composite.metallicBoost =

            this.metallicBoost;


    }


}


/*
====================================================
Debug Information
====================================================
*/


debugInfo()

{


    return {


        type:

            "SSRCompositePass",



        enabled:

            this.enabled,



        initialized:

            this.initialized,



        mode:

            this.mode,



        reflectionStrength:

            this.reflectionStrength,



        fresnelPower:

            this.fresnelPower,



        metallicBoost:

            this.metallicBoost,



        resources:

            {


                ssrBuffer:

                    this.ssrBuffer !== null,



                reflectionProbe:

                    this.probe !== null,



                environment:

                    this.environment !== null,



                composite:

                    this.composite !== null,



                brdf:

                    this.brdf !== null


            }


    };


}





/*
====================================================
Pipeline State
====================================================
*/


getState()

{


    return {


        pass:

            "SSRCompositePass",



        active:

            this.enabled,



        mode:

            this.mode,



        ready:

            this.initialized



    };


}





/*
====================================================
Validation
====================================================
*/


validate()

:

boolean

{


    if(

        !this.enabled

    ){


        return false;


    }





    if(

        !this.ssrBuffer

    ){


        return false;


    }





    return true;


}





/*
====================================================
Dispose
====================================================
*/


dispose()

:

void

{


    this.reset();


}
