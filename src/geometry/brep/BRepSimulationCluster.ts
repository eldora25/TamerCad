
export type ClusterNodeState =

    "IDLE"

    |

    "BUSY"

    |

    "FAILED";





export interface SimulationNode {


    id:string;


    cpu:number;


    memory:number;


    load:number;


    state:ClusterNodeState;


}





export interface ClusterTask {


    id:string;


    solver:string;


    complexity:number;


    assignedNode?:string;


    completed:boolean;


}





export interface ClusterResult {


    tasks:number;


    nodes:number;


    executionTime:number;


    success:boolean;


}





export interface FaultEvent {


    node:string;


    message:string;


    timestamp:number;


}





export class BRepSimulationCluster {



    nodes:SimulationNode[];


    tasks:ClusterTask[];


    faults:FaultEvent[];


    running:boolean;


    startTime:number;





    constructor(){



        this.nodes=[];


        this.tasks=[];


        this.faults=[];


        this.running=false;


        this.startTime=0;


    }





    /**
     * Cluster başlatma
     */
    start(){


        this.running=true;


        this.startTime=

            Date.now();


    }





    /**
     * Node ekleme
     */
    registerNode(

        node:SimulationNode

    ){


        this.nodes.push(

            node

        );


    }





    /**
     * Simulation task ekleme
     */
    submitTask(

        task:ClusterTask

    ){


        this.tasks.push(

            task

        );


    }





    /**
     * Load balancing
     */
    balanceLoad(){



        for(

            const task of

            this.tasks

        ){



            if(

                task.assignedNode

            )

                continue;



            const node=

                this.findBestNode();



            if(node){



                task.assignedNode=

                    node.id;



                node.load +=

                    task.complexity;



                node.state=

                    "BUSY";


            }


        }


    }





    /**
     * En uygun node seçimi
     */
    findBestNode(){



        return this.nodes.sort(

            (

                a,

                b

            )=>

                a.load-b.load


        )[0];


    }





    /**
     * Paralel execution
     */
    executeParallel(){



        this.balanceLoad();



        for(

            const task of

            this.tasks

        ){



            if(

                task.assignedNode

            ){



                task.completed=

                    true;


            }


        }


    }





    /**
     * Fault detection
     */
    monitorNodes(){



        for(

            const node of

            this.nodes

        ){



            if(

                node.load >

                100

            ){



                node.state=

                    "FAILED";



                this.faults.push({


                    node:

                        node.id,


                    message:

                        "Node overload",


                    timestamp:

                        Date.now()


                });



            }


        }


    }





    /**
     * Fault recovery
     */
    recoverNode(

        nodeId:string

    ){



        const node=

            this.nodes.find(

                n=>

                n.id===nodeId

            );



        if(node){



            node.state=

                "IDLE";


            node.load=0;


        }


    }





    /**
     * Distributed memory
     */
    distributeMemory(){



        return {


            nodes:

                this.nodes.length,


            shared:

                true


        };


    }





    /**
     * HPC optimization
     */
    optimizeExecution(){



        this.balanceLoad();


        this.monitorNodes();


        this.executeParallel();


    }





    /**
     * Cluster sonucu
     */
    result():ClusterResult {



        return {


            tasks:

                this.tasks.length,


            nodes:

                this.nodes.length,


            executionTime:

                Date.now()

                -

                this.startTime,


            success:

                this.faults.length===0


        };


    }





    /**
     * Shutdown
     */
    stop(){


        this.running=false;


    }





    /**
     * Reset
     */
    reset(){


        this.nodes=[];


        this.tasks=[];


        this.faults=[];


        this.running=false;


    }





    /**
     * Debug
     */
    info(){


        return {


            engine:

                "BRepSimulationCluster",


            nodes:

                this.nodes.length,


            tasks:

                this.tasks.length,


            status:

                this.running

                ?

                "RUNNING"

                :

                "STOPPED"


        };


    }


}