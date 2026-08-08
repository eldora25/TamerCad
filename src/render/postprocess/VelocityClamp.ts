import {
    VelocityBuffer
} from "./VelocityBuffer";

import {
    MotionVectorBuffer
} from "./MotionVectorBuffer";



export interface VelocityClampOptions {


    maxVelocity?: number;


    softClamp?: boolean;


    enabled?: boolean;

}



export enum VelocityClampMode {


    Hard = "Hard",


    Soft = "Soft",


    Adaptive = "Adaptive"

}



export class VelocityClamp {



    public enabled = true;



    /**
     * Maksimum screen-space velocity
     */
    public maxVelocity = 64.0;



    /**
     * Yumuşak geçiş
     */
    public softClamp = true;



    public mode:

        VelocityClampMode =

        VelocityClampMode.Adaptive;



    private source:

        VelocityBuffer |

        MotionVectorBuffer |

        null = null;



    private depthTexture:

        any = null;



    constructor(

        options:

            VelocityClampOptions = {}

    ) {


        if (

            options.maxVelocity !== undefined

        ) {


            this.maxVelocity =

                options.maxVelocity;

        }



        if (

            options.softClamp !== undefined

        ) {


            this.softClamp =

                options.softClamp;

        }



        if (

            options.enabled !== undefined

        ) {


            this.enabled =

                options.enabled;

        }

    }





    setVelocitySource(

        buffer:

            VelocityBuffer |

            MotionVectorBuffer

    ):void {


        this.source =

            buffer;

    }





    setDepthTexture(

        texture:any

    ):void {


        this.depthTexture =

            texture;

    }





    setMode(

        mode:

            VelocityClampMode

    ):void {


        this.mode =

            mode;

    }





    clamp(

        velocity:any

    ):any {


        const length =

            Math.sqrt(

                velocity.x *

                velocity.x +

                velocity.y *

                velocity.y

            );



        if (

            length <=

            this.maxVelocity

        ) {


            return velocity;

        }



        const scale =

            this.maxVelocity /

            length;



        return {


            x:

                velocity.x *

                scale,


            y:

                velocity.y *

                scale

        };

    }





    softClampVelocity(

        velocity:any

    ):any {


        const length =

            Math.sqrt(

                velocity.x *

                velocity.x +

                velocity.y *

                velocity.y

            );



        const factor =

            Math.min(

                1,


                this.maxVelocity /

                Math.max(

                    length,

                    0.0001

                )

            );



        return {


            x:

                velocity.x *

                factor,


            y:

                velocity.y *

                factor

        };

    }





    execute():

    any {


        if (

            !this.enabled ||

            !this.source

        ) {


            return null;

        }



        /**
         * GPU:
         *
         * velocity normalization
         * outlier rejection
         * adaptive limiting
         */


        return {


            type:

                "ClampedVelocity",


            maxVelocity:

                this.maxVelocity,


            mode:

                this.mode

        };

    }





    reset():

    void {


        this.source =

            null;


        this.depthTexture =

            null;

    }





    debugInfo(){


        return {


            type:

                "VelocityClamp",


            enabled:

                this.enabled,


            maxVelocity:

                this.maxVelocity,


            mode:

                this.mode

        };

    }

}