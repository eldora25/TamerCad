
import {

    QueueItem

}

from "./BRepFeatureRebuildQueue";





import {

    BRepFeatureExecutor

}

from "./BRepFeatureExecutor";





export type WorkerStatus =


    "IDLE"

    |

    "BUSY"

    |

    "STOPPED";





export interface WorkerResult {


    workerId:string;


    featureId:string;


    success:boolean;


    geometry:any;


    duration:number;


    error?:string;


}





export interface WorkerContext {


    task:QueueItem;


    cancelled:boolean;


}





export class BRepFeatureRebuildWorker {



    id:string;


    status:WorkerStatus;


    executor:BRepFeatureExecutor;


    completed:number;


    failed:number;


    totalTime:number;


    cancelled:boolean;





    constructor(

        id:string,

        executor:BRepFeatureExecutor

    ){



        this.id=

            id;



        this.status=

            "IDLE";



        this.executor=

            executor;



        this.completed=0;


        this.failed=0;


        this.totalTime=0;


        this.cancelled=false;


    }





    /**
     * Task kabul et
     */
    canAccept(){



        return this.status==="IDLE";


    }





    /**
     * Task çalıştır
     */
    async execute(

        task:QueueItem

    ):Promise<WorkerResult>{



        if(

            !this.canAccept()

        ){

            throw new Error(

                "Worker busy"

            );

        }





        this.status=

            "BUSY";



        const start=

            performance.now();





        try{



            if(

                this.cancelled

            ){

                throw new Error(

                    "Worker cancelled"

                );

            }





            const geometry=

                await this.processTask(

                    task

                );



            const duration=

                performance.now()

                -

                start;



            this.completed++;


            this.totalTime+=duration;



            const result={



                workerId:

                    this.id,



                featureId:

                    task.featureId,



                success:true,



                geometry,



                duration


            };



            return result;



        }

        catch(error){



            this.failed++;



            return {


                workerId:

                    this.id,


                featureId:

                    task.featureId,


                success:false,


                geometry:null,


                duration:

                    performance.now()

                    -

                    start,


                error:

                    String(error)


            };


        }

        finally{


            this.status=

                "IDLE";


        }


    }





    /**
     * Feature execution hook
     */
    async processTask(

        task:QueueItem

    ){



        /*
        
        Burada:

        BRepFeatureExecutor

        çağrısı yapılır.


        Gerçek kernel bağlantısı:

        task.featureId

                ↓

        Feature Object

                ↓

        Executor

                ↓

        BRep Result


        */



        return {


            type:

                "REBUILD_RESULT",


            featureId:

                task.featureId


        };


    }





    /**
     * İptal
     */
    cancel(){



        this.cancelled=true;



    }





    /**
     * Reset
     */
    reset(){



        this.cancelled=false;


        this.status="IDLE";


    }





    /**
     * Ortalama süre
     */
    averageTime(){



        if(

            this.completed===0

        ){

            return 0;

        }



        return this.totalTime /

            this.completed;


    }





    /**
     * Worker bilgisi
     */
    info(){



        return {


            id:

                this.id,


            status:

                this.status,


            completed:

                this.completed,


            failed:

                this.failed,


            averageTime:

                this.averageTime()


        };


    }


}