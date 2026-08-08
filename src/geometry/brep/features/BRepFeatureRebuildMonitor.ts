
import {

    QueueItem

}

from "./BRepFeatureRebuildQueue";





export interface RebuildMetric {


    featureId:string;


    startTime:number;


    endTime:number;


    duration:number;


    success:boolean;


    memory?:number;


    error?:string;


}





export interface MonitorReport {


    totalFeatures:number;


    completed:number;


    failed:number;


    averageTime:number;


    slowestFeature?:string;


    slowestDuration:number;


}





export interface MonitorEvent {


    type:

        "START"

        |

        "COMPLETE"

        |

        "FAILED";


    featureId:string;


    data?:any;


}





export class BRepFeatureRebuildMonitor {



    metrics:Map<string,RebuildMetric[]>;


    active:

        Map<string,number>;



    events:

        MonitorEvent[];





    constructor(){



        this.metrics=

            new Map();



        this.active=

            new Map();



        this.events=[];


    }





    /**
     * Feature başlat
     */
    startFeature(

        featureId:string

    ){



        const time=

            performance.now();



        this.active.set(

            featureId,

            time

        );



        this.events.push({


            type:

                "START",


            featureId


        });


    }





    /**
     * Feature tamamlandı
     */
    completeFeature(

        featureId:string,

        memory?:number

    ){



        const start=

            this.active.get(

                featureId

            );



        if(

            start===undefined

        ){

            return;

        }





        const end=

            performance.now();



        const metric={



            featureId,



            startTime:

                start,



            endTime:

                end,



            duration:

                end-start,



            success:true,



            memory



        };



        this.storeMetric(

            metric

        );



        this.active.delete(

            featureId

        );



        this.events.push({


            type:

                "COMPLETE",


            featureId,


            data:

                metric


        });


    }





    /**
     * Feature hata
     */
    failFeature(

        featureId:string,

        error:string

    ){



        const start=

            this.active.get(

                featureId

            )

            ||

            performance.now();





        const end=

            performance.now();



        const metric={


            featureId,


            startTime:

                start,


            endTime:

                end,


            duration:

                end-start,


            success:false,


            error



        };



        this.storeMetric(

            metric

        );



        this.active.delete(

            featureId

        );



        this.events.push({


            type:

                "FAILED",


            featureId,


            data:

                error


        });


    }





    /**
     * Metric kaydet
     */
    storeMetric(

        metric:RebuildMetric

    ){



        if(

            !this.metrics.has(

                metric.featureId

            )

        ){



            this.metrics.set(

                metric.featureId,

                []

            );


        }





        this.metrics

            .get(

                metric.featureId

            )

            ?.push(

                metric

            );


    }





    /**
     * Feature ortalama süresi
     */
    averageFeatureTime(

        featureId:string

    ){



        const list=

            this.metrics.get(

                featureId

            )

            || [];



        if(

            list.length===0

        ){

            return 0;

        }





        return (

            list.reduce(

                (a,m)=>

                a+m.duration,

                0

            )

            /

            list.length

        );


    }





    /**
     * En yavaş feature
     */
    findSlowest(){



        let id=

            "";



        let duration=

            0;





        for(

            const [

                featureId,

                metrics

            ]

            of this.metrics

        ){



            for(

                const metric of metrics

            ){



                if(

                    metric.duration >

                    duration

                ){



                    duration=

                        metric.duration;



                    id=

                        featureId;


                }


            }


        }



        return {


            featureId:

                id,


            duration


        };


    }





    /**
     * Rapor oluştur
     */
    report():MonitorReport {



        let total=0;


        let completed=0;


        let failed=0;


        let time=0;





        for(

            const metrics of this.metrics.values()

        ){



            for(

                const metric of metrics

            ){



                total++;



                time+=metric.duration;



                if(

                    metric.success

                ){

                    completed++;

                }

                else{


                    failed++;

                }


            }


        }





        const slow=

            this.findSlowest();





        return {


            totalFeatures:

                total,


            completed,


            failed,



            averageTime:

                total===0

                ?

                0

                :

                time/total,



            slowestFeature:

                slow.featureId,



            slowestDuration:

                slow.duration


        };


    }





    /**
     * Timeline
     */
    timeline(){



        return this.events;


    }





    /**
     * Temizle
     */
    reset(){



        this.metrics.clear();


        this.active.clear();


        this.events=[];


    }





    /**
     * Debug
     */
    info(){



        return {


            engine:

                "BRepFeatureRebuildMonitor",


            trackedFeatures:

                this.metrics.size,


            active:

                this.active.size,


            events:

                this.events.length


        };


    }


}