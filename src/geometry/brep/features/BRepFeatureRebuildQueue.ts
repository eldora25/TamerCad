
import {

    RebuildPlan

}

from "./BRepFeatureRebuildPlanner";





export type QueueStatus =


    "WAITING"

    |

    "RUNNING"

    |

    "DONE"

    |

    "FAILED";





export interface QueueItem {


    id:string;


    featureId:string;


    priority:number;


    status:QueueStatus;


    attempts:number;


    createdAt:number;


}





export interface QueueProgress {


    total:number;


    completed:number;


    failed:number;


    percent:number;


}





export class BRepFeatureRebuildQueue {



    queue:QueueItem[];


    completed:QueueItem[];


    failed:QueueItem[];


    running:boolean;


    maxRetries:number;





    constructor(){



        this.queue=[];


        this.completed=[];


        this.failed=[];


        this.running=false;


        this.maxRetries=3;


    }





    /**
     * Plan ekle
     */
    enqueuePlan(

        plan:RebuildPlan

    ){



        for(

            const featureId of plan.orderedFeatures

        ){



            this.enqueue({

                id:

                    crypto.randomUUID(),


                featureId,


                priority:

                    this.calculatePriority(

                        featureId,

                        plan

                    ),


                status:

                    "WAITING",


                attempts:0,


                createdAt:

                    Date.now()


            });


        }



    }





    /**
     * Queue ekleme
     */
    enqueue(

        item:QueueItem

    ){



        const exists=

            this.queue.some(

                q=>

                q.featureId===item.featureId

            );



        if(

            exists

        ){

            return;

        }



        this.queue.push(

            item

        );



        this.sort();


    }





    /**
     * Öncelik hesaplama
     */
    calculatePriority(

        featureId:string,

        plan:RebuildPlan

    ){



        const index=

            plan.orderedFeatures.indexOf(

                featureId

            );



        return index>=0

            ? 100-index

            : 0;


    }





    /**
     * Queue sırala
     */
    sort(){



        this.queue.sort(

            (a,b)=>

            b.priority-a.priority

        );


    }





    /**
     * Sonraki işlem
     */
    next(){



        return this.queue.shift();


    }





    /**
     * Çalıştırma başlat
     */
    start(){


        this.running=true;


    }





    /**
     * Durdur
     */
    stop(){


        this.running=false;


    }





    /**
     * İş tamamlandı
     */
    complete(

        item:QueueItem

    ){



        item.status=

            "DONE";



        this.completed.push(

            item

        );


    }





    /**
     * Hata
     */
    fail(

        item:QueueItem

    ){



        item.attempts++;



        if(

            item.attempts <

            this.maxRetries

        ){



            item.status=

                "WAITING";



            this.queue.push(

                item

            );


            this.sort();


        }

        else{


            item.status=

                "FAILED";


            this.failed.push(

                item

            );


        }



    }





    /**
     * Queue boş mu
     */
    isEmpty(){



        return this.queue.length===0;


    }





    /**
     * Progress
     */
    progress():QueueProgress {



        const total=

            this.completed.length +

            this.failed.length +

            this.queue.length;



        const completed=

            this.completed.length;



        return {


            total,


            completed,


            failed:

                this.failed.length,


            percent:

                total===0

                ?

                100

                :

                (

                    completed /

                    total

                ) * 100


        };


    }





    /**
     * Batch temizle
     */
    clear(){



        this.queue=[];


        this.completed=[];


        this.failed=[];


    }





    /**
     * Serialize
     */
    serialize(){



        return {


            waiting:

                this.queue,


            completed:

                this.completed,


            failed:

                this.failed


        };


    }





    /**
     * Debug
     */
    info(){



        return {


            engine:

                "BRepFeatureRebuildQueue",


            waiting:

                this.queue.length,


            completed:

                this.completed.length,


            failed:

                this.failed.length


        };


    }


}