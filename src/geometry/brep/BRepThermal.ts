import {
    BRepSolid
}
from "./BRepSolid";


import {
    MaterialDefinition
}
from "./BRepMaterial";





export interface Vector3 {


    x:number;


    y:number;


    z:number;


}





export interface TemperatureNode {


    position:Vector3;


    temperature:number;


}





export interface HeatSource {


    id:string;


    position:Vector3;


    power:number;


}





export interface ThermalBoundary {


    type:

        "fixed_temperature"

        |

        "heat_flux"

        |

        "convection";


    value:number;


}





export interface ThermalResult {


    success:boolean;


    averageTemperature:number;


    heatFlow:number;


}





export class BRepThermal {



    solid:BRepSolid|null;


    material:MaterialDefinition|null;



    nodes:TemperatureNode[];


    sources:HeatSource[];


    boundaries:ThermalBoundary[];


    temperature:number;



    constructor(){


        this.solid=null;


        this.material=null;


        this.nodes=[];


        this.sources=[];


        this.boundaries=[];


        this.temperature=20;


    }





    /**
     * Model yükleme
     */
    load(

        solid:BRepSolid,

        material:MaterialDefinition

    ){


        this.solid=

            solid;


        this.material=

            material;


    }





    /**
     * Başlangıç sıcaklığı
     */
    setTemperature(

        value:number

    ){


        this.temperature=

            value;


    }





    /**
     * Heat source ekleme
     */
    addHeatSource(

        source:HeatSource

    ){


        this.sources.push(

            source

        );


    }





    /**
     * Boundary condition
     */
    addBoundary(

        boundary:ThermalBoundary

    ){


        this.boundaries.push(

            boundary

        );


    }





    /**
     * Thermal step
     */
    solve(

        deltaTime:number

    ):ThermalResult {



        this.solveConduction();



        this.applyHeatSources();



        this.applyBoundary();



        const flow=

            this.calculateHeatFlow();



        return {


            success:true,


            averageTemperature:

                this.averageTemperature(),


            heatFlow:

                flow


        };


    }





    /**
     * Heat conduction solver
     */
    solveConduction(){



        if(

            !this.material

        )

            return;



        /*
        
        Fourier Law:

        Q = -k A dT/dx


        */


    }





    /**
     * Heat source etkisi
     */
    applyHeatSources(){



        for(

            const source of this.sources

        ){



            this.temperature +=

                source.power *

                0.0001;


        }


    }





    /**
     * Boundary uygulanması
     */
    applyBoundary(){



        for(

            const boundary of

            this.boundaries

        ){



            if(

                boundary.type ===

                "fixed_temperature"

            ){


                this.temperature =

                    boundary.value;


            }


        }


    }





    /**
     * Heat flow
     */
    calculateHeatFlow(){



        if(

            !this.material

        )

            return 0;



        return (

            this.material.thermal.conductivity *

            this.temperature

        );


    }





    /**
     * Ortalama sıcaklık
     */
    averageTemperature(){



        if(

            this.nodes.length===0

        )

            return this.temperature;



        return this.nodes.reduce(

            (

                sum,

                node

            )=>

                sum+

                node.temperature,


            0

        )

        /

        this.nodes.length;


    }





    /**
     * Termal genleşme
     */
    expansion(

        length:number,

        deltaTemperature:number

    ){



        if(

            !this.material

        )

            return 0;



        return (

            length *

            this.material.thermal.expansion *

            deltaTemperature

        );


    }





    /**
     * Termal stress
     */
    thermalStress(

        deltaTemperature:number

    ){



        if(

            !this.material

        )

            return 0;



        return (

            this.material.elastic.youngModulus *

            this.material.thermal.expansion *

            deltaTemperature

        );


    }





    /**
     * Reset
     */
    reset(){


        this.temperature=20;


        this.sources=[];


        this.boundaries=[];


    }





    /**
     * Debug
     */
    info(){


        return {


            engine:

                "BRepThermal",


            temperature:

                this.temperature,


            sources:

                this.sources.length,


            status:

                "READY"


        };


    }


}