export interface GeometryState {


    version:string;


    timestamp:number;


    geometryHash:string;


}





export interface SensorData {


    id:string;


    value:number;


    unit:string;


    timestamp:number;


}





export interface TwinState {


    temperature:number;


    stress:number;


    fatigue:number;


    health:number;


}





export interface LifecycleEvent {


    type:

        "MANUFACTURED"

        |

        "ASSEMBLED"

        |

        "OPERATING"

        |

        "MAINTENANCE";


    timestamp:number;


}





export interface DigitalTwinResult {


    healthy:boolean;


    healthScore:number;


    predictions:string[];


}





export class BRepDigitalTwin {



    geometry:GeometryState;


    sensors:SensorData[];


    state:TwinState;


    lifecycle:LifecycleEvent[];


    connected:boolean;





    constructor(){



        this.geometry={


            version:"1.0",


            timestamp:

                Date.now(),


            geometryHash:""


        };



        this.sensors=[];



        this.state={


            temperature:20,


            stress:0,


            fatigue:0,


            health:100


        };



        this.lifecycle=[];



        this.connected=false;


    }





    /**
     * Geometry bağlama
     */
    attachGeometry(

        hash:string

    ){



        this.geometry.geometryHash=

            hash;



        this.geometry.timestamp=

            Date.now();


    }





    /**
     * Sensor bağlama
     */
    addSensor(

        sensor:SensorData

    ){


        this.sensors.push(

            sensor

        );


    }





    /**
     * Canlı veri güncelleme
     */
    updateSensor(

        id:string,

        value:number

    ){



        const sensor=

            this.sensors.find(

                s=>

                s.id===id

            );



        if(sensor){


            sensor.value=

                value;


            sensor.timestamp=

                Date.now();


        }


    }





    /**
     * Fiziksel durum senkronizasyonu
     */
    synchronize(){



        for(

            const sensor of

            this.sensors

        ){



            switch(

                sensor.unit

            ){



                case "C":


                    this.state.temperature=

                        sensor.value;


                    break;



                case "MPa":


                    this.state.stress=

                        sensor.value;


                    break;



                case "%":


                    this.state.fatigue=

                        sensor.value;


                    break;


            }


        }


    }





    /**
     * Health hesaplama
     */
    calculateHealth(){



        let health=100;



        health -=

            this.state.stress *

            0.05;



        health -=

            this.state.fatigue *

            0.2;



        if(

            this.state.temperature >

            80

        ){


            health -=20;


        }



        this.state.health=

            Math.max(

                0,

                health

            );



        return this.state.health;


    }





    /**
     * Predictive maintenance
     */
    predictFailure(){



        const predictions:string[]=[];



        if(

            this.state.fatigue >

            70

        ){


            predictions.push(

                "Fatigue failure risk"

            );


        }



        if(

            this.state.stress >

            250

        ){


            predictions.push(

                "Over stress condition"

            );


        }



        return predictions;


    }





    /**
     * Lifecycle event
     */
    addLifecycleEvent(

        event:LifecycleEvent

    ){


        this.lifecycle.push(

            event

        );


    }





    /**
     * Simulation bağlantısı
     */
    connectSimulation(){


        this.connected=true;


    }





    /**
     * Digital twin update loop
     */
    update(){



        this.synchronize();


        this.calculateHealth();


    }





    /**
     * Twin raporu
     */
    report():DigitalTwinResult {



        return {


            healthy:

                this.state.health >

                50,


            healthScore:

                this.state.health,


            predictions:

                this.predictFailure()


        };


    }





    /**
     * Reset
     */
    reset(){


        this.sensors=[];


        this.lifecycle=[];


        this.connected=false;


    }





    /**
     * Debug
     */
    info(){


        return {


            engine:

                "BRepDigitalTwin",


            sensors:

                this.sensors.length,


            health:

                this.state.health,


            status:

                "ACTIVE"


        };


    }


}