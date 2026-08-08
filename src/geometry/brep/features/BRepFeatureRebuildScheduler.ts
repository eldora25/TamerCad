
import {

    BRepFeatureRebuildQueue,

    QueueItem

}

from "./BRepFeatureRebuildQueue";





export interface SchedulerOptions {


    workers:number;


    autoStart:boolean;


}





export interface SchedulerEvent {


    type:

        "START"

        |

        "PROGRESS"

        |

        "COMPLETE"

        |

        "FAILED"

        |

        "CANCEL";


    featureId?:string;


    data?:any;


}





export interface SchedulerState {


    running:boolean;


    activeWorkers:number;


    completed:number;


    failed:number;


}





export class BRepFeatureRebuildScheduler {



    queue:BRepFeatureRebuildQueue;


    workers:number;


    activeWorkers:number;


    running:boolean;


    cancelled:boolean;



    listeners:

        Array<(event:SchedulerEvent)=>void>;





    constructor(

        queue:BRepFeatureRebuildQueue,

        options:SchedulerOptions=

        {

            workers:4,

            autoStart:false

        }

    ){



        this.queue=

            queue;



        this.workers=

            options.workers;



        this.activeWorkers=

            0;



        this.running=

            options.autoStart;



        this.cancelled=

            false;



        this.listeners=[];


    }





    /**
     * Event listener
     */
    on(

        callback:(event:SchedulerEvent)=>void

    ){



        this.listeners.push(

            callback

        );


    }





    emit(

        event:SchedulerEvent

    ){



        for(

            const listener of this.listeners

        ){



            listener(

                event

            );


        }


    }





    /**
     * Scheduler başlat
     */
    start(){



        if(

            this.running

        ){

            return;

        }



        this.running=true;


        this.cancelled=false;



        this.queue.start();



        this.emit({

            type:

                "START"

        });



        this.process();


    }





    /**
     * Ana scheduler loop
     */
    async process(){



        while(

            this.running &&

            !this.cancelled

        ){



            while(

                this.activeWorkers <

                this.workers &&

                !this.queue.isEmpty()

            ){



                const task=

                    this.queue.next();



                if(

                    task

                ){



                    this.runTask(

                        task

                    );


                }


            }





            if(

                this.queue.isEmpty() &&

                this.activeWorkers===0

            ){



                this.finish();


                break;


            }





            await this.wait(

                10

            );


        }


    }





    /**
     * Task çalıştır
     */
    async runTask(

        task:QueueItem

    ){



        this.activeWorkers++;



        task.status=

            "RUNNING";



        try{


            await this.executeTask(

                task

            );



            this.queue.complete(

                task

            );



            this.emit({

                type:

                    "COMPLETE",


                featureId:

                    task.featureId


            });



        }

        catch(error){



            this.queue.fail(

                task

            );



            this.emit({

                type:

                    "FAILED",


                featureId:

                    task.featureId,


                data:

                    error


            });


        }

        finally{


            this.activeWorkers--;


            this.emit({

                type:

                    "PROGRESS",


                data:

                    this.queue.progress()


            });


        }


    }





    /**
     * Gerçek execution hook
     */
    async executeTask(

        task:QueueItem

    ){



        /*
          Burada:

          BRepFeatureExecutor.execute()

          çağrılır.

        */



        return new Promise(

            resolve=>

                setTimeout(

                    resolve,

                    1

                )

        );


    }





    /**
     * Bekleme
     */
    wait(

        ms:number

    ){



        return new Promise(

            resolve=>

                setTimeout(

                    resolve,

                    ms

                )

        );


    }





    /**
     * Tamamlandı
     */
    finish(){



        this.running=false;



        this.emit({

            type:

                "PROGRESS",


            data:

                this.queue.progress()


        });


    }





    /**
     * Durdur
     */
    stop(){



        this.running=false;


        this.queue.stop();


    }





    /**
     * İptal
     */
    cancel(){



        this.cancelled=true;


        this.running=false;



        this.emit({

            type:

                "CANCEL"

        });


    }





    /**
     * State
     */
    state():SchedulerState {



        return {


            running:

                this.running,


            activeWorkers:

                this.activeWorkers,


            completed:

                this.queue.completed.length,


            failed:

                this.queue.failed.length


        };


    }





    /**
     * Reset
     */
    reset(){



        this.stop();



        this.activeWorkers=0;


        this.cancelled=false;



        this.listeners=[];


    }





    /**
     * Debug
     */
    info(){



        return {


            engine:

                "BRepFeatureRebuildScheduler",


            workers:

                this.workers,


            active:

                this.activeWorkers,


            running:

                this.running


        };


    }


}