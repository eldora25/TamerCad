export type IoTProtocol =

    "MQTT"

    |

    "HTTP"

    |

    "OPC_UA"

    |

    "WEBSOCKET";





export interface IoTDevice {


    id:string;


    name:string;


    protocol:IoTProtocol;


    connected:boolean;


}





export interface TelemetryData {


    device:string;


    sensor:string;


    value:number;


    unit:string;


    timestamp:number;


}





export interface IoTEvent {


    type:string;


    message:string;


    timestamp:number;


}





export interface IoTStatus {


    connectedDevices:number;


    dataPoints:number;


    online:boolean;


}





export class BRepIoTIntegration {



    devices:IoTDevice[];


    telemetry:TelemetryData[];


    events:IoTEvent[];


    protocol:IoTProtocol;


    connected:boolean;





    constructor(){


        this.devices=[];


        this.telemetry=[];


        this.events=[];


        this.protocol="MQTT";


        this.connected=false;


    }





    /**
     * IoT gateway bağlantısı
     */
    connect(

        protocol:IoTProtocol

    ){


        this.protocol=

            protocol;



        this.connected=true;


    }





    /**
     * Device ekleme
     */
    registerDevice(

        device:IoTDevice

    ){


        this.devices.push(

            device

        );


    }





    /**
     * Sensör verisi alma
     */
    receiveTelemetry(

        data:TelemetryData

    ){


        this.telemetry.push(

            data

        );



        this.processData(

            data

        );


    }





    /**
     * Veri işleme
     */
    processData(

        data:TelemetryData

    ){



        if(

            data.value > 1000

        ){



            this.events.push({


                type:

                    "WARNING",


                message:

                    `${data.sensor} threshold exceeded`,


                timestamp:

                    Date.now()


            });


        }


    }





    /**
     * Digital Twin senkronizasyonu
     */
    syncDigitalTwin(

        twin:any

    ){



        for(

            const data of

            this.telemetry

        ){



            twin.updateSensor(

                data.sensor,

                data.value

            );


        }



        twin.update();


    }





    /**
     * Gerçek zamanlı stream
     */
    startStream(){



        return {


            active:true,


            protocol:

                this.protocol


        };


    }





    /**
     * Edge processing
     */
    edgeCompute(){



        return {


            processed:

                this.telemetry.length,


            latency:

                "LOW"


        };


    }





    /**
     * Cloud senkronizasyonu
     */
    cloudSync(){



        return {


            uploaded:

                this.telemetry.length,


            status:

                "SYNCED"


        };


    }





    /**
     * Predictive analytics
     */
    analyze(){



        const average =

            this.telemetry.reduce(

                (

                    a,

                    b

                )=>

                    a+b.value,


                0

            )

            /

            Math.max(

                1,

                this.telemetry.length

            );



        return {


            average,


            anomaly:

                average > 500


        };


    }





    /**
     * Event listesi
     */
    getEvents(){



        return this.events;


    }





    /**
     * Status
     */
    status():IoTStatus {



        return {


            connectedDevices:

                this.devices.filter(

                    d=>

                    d.connected

                ).length,


            dataPoints:

                this.telemetry.length,


            online:

                this.connected


        };


    }





    /**
     * Reset
     */
    reset(){


        this.telemetry=[];


        this.events=[];


        this.connected=false;


    }





    /**
     * Debug
     */
    info(){


        return {


            engine:

                "BRepIoTIntegration",


            protocol:

                this.protocol,


            devices:

                this.devices.length,


            status:

                this.connected

                ?

                "ONLINE"

                :

                "OFFLINE"


        };


    }


}