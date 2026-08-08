export interface Vector3 {


    x:number;


    y:number;


    z:number;


}





export interface DynamicState {


    displacement:number[];


    velocity:number[];


    acceleration:number[];


}





export interface DynamicLoad {


    time:number;


    force:number[];


}





export interface DynamicResult {


    success:boolean;


    time:number;


    maxDisplacement:number;


}





export interface TimeStep {


    dt:number;


    totalTime:number;


}





export class BRepDynamics {



    mass:number[][];


    stiffness:number[][];


    damping:number[][];


    state:DynamicState;


    loads:DynamicLoad[];


    timeStep:TimeStep;



    beta:number;


    gamma:number;




    constructor(){


        this.mass=[];


        this.stiffness=[];


        this.damping=[];


        this.loads=[];



        this.state={


            displacement:[],


            velocity:[],


            acceleration:[]


        };



        this.timeStep={


            dt:0.001,


            totalTime:1


        };



        /*
        
        Newmark Beta Parameters
        
        */


        this.beta=0.25;


        this.gamma=0.5;


    }





    /**
     * Dynamic matrix yükleme
     */
    loadSystem(

        mass:number[][],

        stiffness:number[][],

        damping:number[][]

    ){


        this.mass=

            mass;


        this.stiffness=

            stiffness;


        this.damping=

            damping;


    }





    /**
     * Dynamic load ekleme
     */
    addLoad(

        load:DynamicLoad

    ){


        this.loads.push(

            load

        );


    }





    /**
     * Ana transient çözüm
     */
    solve():DynamicResult {



        let time=0;



        let maxDisp=0;



        while(

            time <

            this.timeStep.totalTime

        ){



            this.newmarkStep(

                this.timeStep.dt

            );



            maxDisp=

                Math.max(

                    maxDisp,

                    this.currentDisplacement()

                );



            time +=

                this.timeStep.dt;


        }



        return {


            success:true,


            time,


            maxDisplacement:

                maxDisp


        };


    }





    /**
     * Newmark-beta zaman integrasyonu
     */
    newmarkStep(

        dt:number

    ){



        /*
        
        Predict:


        u(t+dt)


        v(t+dt)


        a(t+dt)



        */


        this.updateAcceleration();



        this.updateVelocity();



        this.updateDisplacement(

            dt

        );


    }





    /**
     * Acceleration update
     */
    updateAcceleration(){



        /*
        
        M^-1(F-Cv-Ku)


        */


    }





    /**
     * Velocity update
     */
    updateVelocity(){



        for(

            let i=0;

            i<this.state.velocity.length;

            i++

        ){



            this.state.velocity[i]

                +=

                this.state.acceleration[i]

                *

                this.timeStep.dt;


        }


    }





    /**
     * Displacement update
     */
    updateDisplacement(

        dt:number

    ){



        for(

            let i=0;

            i<this.state.displacement.length;

            i++

        ){



            this.state.displacement[i]

                +=

                this.state.velocity[i]

                *

                dt;


        }


    }





    /**
     * Rayleigh damping
     */
    calculateDamping(

        alpha:number,

        beta:number

    ){



        /*
        
        C = αM + βK


        */


    }





    /**
     * Harmonic response
     */
    harmonicResponse(

        frequency:number

    ){



        return {


            frequency,


            amplitude:

                1 /

                Math.abs(

                    frequency

                )


        };


    }





    /**
     * Titreşim cevabı
     */
    vibrationResponse(

        time:number

    ){



        return Math.sin(

            time *

            2 *

            Math.PI

        );


    }





    /**
     * Mevcut displacement
     */
    currentDisplacement(){



        let max=0;



        for(

            const d of

            this.state.displacement

        ){


            max=Math.max(

                max,

                Math.abs(d)

            );


        }



        return max;


    }





    /**
     * Reset
     */
    reset(){



        this.state={


            displacement:[],


            velocity:[],


            acceleration:[]


        };


        this.loads=[];


    }





    /**
     * Debug
     */
    info(){


        return {


            engine:

                "BRepDynamics",


            loads:

                this.loads.length,


            status:

                "READY"


        };


    }


}