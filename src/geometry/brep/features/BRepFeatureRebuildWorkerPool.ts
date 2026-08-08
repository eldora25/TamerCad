
import {

    BRepFeatureRebuildWorker,

    WorkerStatus,

    WorkerResult

}

from "./BRepFeatureRebuildWorker";





import {

    BRepFeatureExecutor

}

from "./BRepFeatureExecutor";





import {

    QueueItem

}

from "./BRepFeatureRebuildQueue";





export interface WorkerPoolOptions {


    size:number;


}





export interface PoolStats {


    totalWorkers:number;


    idleWorkers:number;


    busyWorkers:number;


    completed:number;


    failed:number;


}





export class BRepFeatureRebuildWorkerPool {



    workers:

        Map<string,BRepFeatureRebuildWorker>;



    executor:

        BRepFeatureExecutor;



    queue:

        QueueItem[];



    running:boolean;





    constructor(

        executor:BRepFeatureExecutor,

        options:WorkerPoolOptions=

        {

            size:4

        }

    ){



        this.executor=

            executor;



        this.workers=

            new Map();



        this.queue=[];



        this.running=false;



        this.createWorkers(

            options.size

        );


    }





    /**
     * Worker oluştur
     */
    createWorkers(

        count:number

    ){



        for(

            let i=0;

            i<count;

            i++

        ){



            const worker=

                new BRepFeatureRebuildWorker(

                    `worker-${i+1}`,

                    this.executor

                );



            this.workers.set(

                worker.id,

                worker

            );


        }


    }





    /**
     * Boş worker bul
     */
    getIdleWorker(){



        for(

            const worker of this.workers.values()

        ){



            if(

                worker.status==="IDLE"

            ){

                return worker;

            }


        }



        return null;


    }





    /**
     * Task ekle
     */
    addTask(

        task:QueueItem

    ){



        this.queue.push(

            task

        );


    }





    /**
     * Task dağıt
     */
    async dispatch(){



        if(

            !this.running

        ){

            return;

        }





        while(

            this.queue.length>0

        ){



            const worker=

                this.getIdleWorker();



            if(

                !worker

            ){

                break;

            }





            const task=

                this.queue.shift();



            if(

                task

            ){



                this.runWorker(

                    worker,

                    task

                );


            }


        }


    }





    /**
     * Worker çalıştır
     */
    async runWorker(

        worker:BRepFeatureRebuildWorker,

        task:QueueItem

    ){



        try{



            const result:

                WorkerResult =

                await worker.execute(

                    task

                );



            this.handleResult(

                result

            );


        }

        catch(error){



            console.error(

                error

            );


        }





        this.dispatch();


    }





    /**
     * Sonuç yönetimi
     */
    handleResult(

        result:WorkerResult

    ){



        if(

            result.success

        ){



            console.log(

                "Completed",

                result.featureId

            );


        }

        else{


            console.error(

                "Failed",

                result.featureId

            );


        }


    }





    /**
     * Pool başlat
     */
    start(){



        this.running=true;



        this.dispatch();


    }





    /**
     * Durdur
     */
    stop(){



        this.running=false;


    }





    /**
     * Worker sayısı artır
     */
    scaleUp(){



        const id=

            `worker-${this.workers.size+1}`;



        const worker=

            new BRepFeatureRebuildWorker(

                id,

                this.executor

            );



        this.workers.set(

            id,

            worker

        );


    }





    /**
     * Worker azalt
     */
    scaleDown(){



        const idle=

            Array.from(

                this.workers.values()

            )

            .find(

                w=>

                w.status==="IDLE"

            );



        if(

            idle

        ){



            this.workers.delete(

                idle.id

            );


        }


    }





    /**
     * İptal
     */
    cancelAll(){



        this.queue=[];



        for(

            const worker of this.workers.values()

        ){



            worker.cancel();


        }


    }





    /**
     * Statistik
     */
    stats():PoolStats {



        const workers=

            Array.from(

                this.workers.values()

            );



        return {


            totalWorkers:

                workers.length,


            idleWorkers:

                workers.filter(

                    w=>

                    w.status==="IDLE"

                ).length,


            busyWorkers:

                workers.filter(

                    w=>

                    w.status==="BUSY"

                ).length,


            completed:

                workers.reduce(

                    (a,w)=>

                    a+w.completed,

                    0

                ),


            failed:

                workers.reduce(

                    (a,w)=>

                    a+w.failed,

                    0

                )


        };


    }





    /**
     * Reset
     */
    reset(){



        this.queue=[];



        for(

            const worker of this.workers.values()

        ){



            worker.reset();


        }


    }





    /**
     * Debug
     */
    info(){



        return {


            engine:

                "BRepFeatureRebuildWorkerPool",


            workers:

                this.workers.size,


            queue:

                this.queue.length,


            running:

                this.running


        };


    }


}