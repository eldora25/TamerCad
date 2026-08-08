
export type PlanningTaskStatus =

    "CREATED"

    |

    "READY"

    |

    "RUNNING"

    |

    "DONE"

    |

    "BLOCKED";





export type TaskPriority =

    "LOW"

    |

    "NORMAL"

    |

    "HIGH"

    |

    "CRITICAL";





export interface EngineeringPlanningTask {


    id:string;


    name:string;


    agent:string;


    priority:TaskPriority;


    duration:number;


    dependencies:string[];


    status:PlanningTaskStatus;


}





export interface ResourceAllocation {


    resource:string;


    assignedAgent:string;


    utilization:number;


}





export interface EngineeringPlan {


    objective:string;


    tasks:EngineeringPlanningTask[];


    resources:ResourceAllocation[];


    timeline:any[];


    confidence:number;


}





export class BRepEngineeringAgentPlanning {



    tasks:EngineeringPlanningTask[];


    resources:ResourceAllocation[];


    plans:EngineeringPlan[];


    memory:any[];





    constructor(){



        this.tasks=[];


        this.resources=[];


        this.plans=[];


        this.memory=[];


    }





    /**
     * Görev oluşturma
     */
    createTask(

        task:EngineeringPlanningTask

    ){



        this.tasks.push(

            task

        );



        return task;


    }





    /**
     * Stratejiyi görevlere bölme
     */
    decompose(

        objective:string

    ){



        const tasks=[


            {


                id:"REQ_ANALYSIS",


                name:

                    "Requirement Analysis",


                agent:

                    "ENGINEERING_AGENT",


                priority:

                    "HIGH",


                duration:

                    2,


                dependencies:[],


                status:

                    "CREATED"


            },


            {


                id:"CAD_DESIGN",


                name:

                    "CAD Generation",


                agent:

                    "CAD_AGENT",


                priority:

                    "HIGH",


                duration:

                    8,


                dependencies:[

                    "REQ_ANALYSIS"

                ],


                status:

                    "CREATED"


            },


            {


                id:"CAE_SIMULATION",


                name:

                    "FEA Simulation",


                agent:

                    "CAE_AGENT",


                priority:

                    "HIGH",


                duration:

                    10,


                dependencies:[

                    "CAD_DESIGN"

                ],


                status:

                    "CREATED"


            },


            {


                id:"OPTIMIZATION",


                name:

                    "Design Optimization",


                agent:

                    "OPT_AGENT",


                priority:

                    "NORMAL",


                duration:

                    12,


                dependencies:[

                    "CAE_SIMULATION"

                ],


                status:

                    "CREATED"


            },


            {


                id:"MANUFACTURING",


                name:

                    "Manufacturing Validation",


                agent:

                    "CAM_AGENT",


                priority:

                    "NORMAL",


                duration:

                    6,


                dependencies:[

                    "OPTIMIZATION"

                ],


                status:

                    "CREATED"


            }


        ];



        this.tasks.push(

            ...tasks

        );



        return tasks;


    }





    /**
     * Bağımlılık grafiği
     */
    buildDependencyGraph(){



        return this.tasks.map(

            task=>({


                node:

                    task.id,


                dependsOn:

                    task.dependencies


            })

        );


    }





    /**
     * Öncelik sıralaması
     */
    prioritize(){



        return this.tasks.sort(

            (

                a,

                b

            )=>{


                const priority:any={


                    CRITICAL:4,


                    HIGH:3,


                    NORMAL:2,


                    LOW:1


                };



                return priority[b.priority]

                    -

                    priority[a.priority];


            }

        );


    }





    /**
     * Kaynak atama
     */
    allocateResource(

        resource:string,

        agent:string

    ){



        const allocation={


            resource,


            assignedAgent:

                agent,


            utilization:

                0.85


        };



        this.resources.push(

            allocation

        );



        return allocation;


    }





    /**
     * Zaman çizelgesi üretme
     */
    generateTimeline(){



        let currentDay=0;



        const timeline=

            this.tasks.map(

                task=>{


                    const item={


                        task:

                            task.id,


                        start:

                            currentDay,


                        end:

                            currentDay +

                            task.duration


                    };



                    currentDay +=

                        task.duration;



                    return item;


                }

            );



        return timeline;


    }





    /**
     * Paralel çalışma planı
     */
    createParallelExecution(){



        const groups:any={};



        this.tasks.forEach(

            task=>{


                if(!groups[task.agent])

                    groups[task.agent]=[];



                groups[task.agent].push(

                    task.id

                );


            }

        );



        return groups;


    }





    /**
     * Plan oluşturma
     */
    createPlan(

        objective:string

    ):EngineeringPlan {



        const plan={


            objective,


            tasks:

                this.tasks,


            resources:

                this.resources,


            timeline:

                this.generateTimeline(),


            confidence:

                0.96


        };



        this.plans.push(

            plan

        );



        this.memory.push(

            plan

        );



        return plan;


    }





    /**
     * Plan yürütme
     */
    executePlan(){



        return this.tasks.map(

            task=>{


                task.status=

                    "READY";



                return task;


            }

        );


    }





    /**
     * İlerleme takibi
     */
    trackProgress(){



        const completed=

            this.tasks.filter(

                task=>

                task.status==="DONE"

            ).length;



        return {


            completed,


            total:

                this.tasks.length,


            progress:

                completed /

                Math.max(

                    this.tasks.length,

                    1

                )


        };


    }





    /**
     * Adaptif planlama
     */
    adapt(

        feedback:any

    ){



        const update={


            changed:true,


            feedback


        };



        this.memory.push(

            update

        );



        return update;


    }





    /**
     * Öğrenme
     */
    learn(

        experience:any

    ){



        this.memory.push(

            experience

        );


    }





    /**
     * Durum
     */
    status(){



        return {


            tasks:

                this.tasks.length,


            plans:

                this.plans.length,


            resources:

                this.resources.length


        };


    }





    /**
     * Reset
     */
    reset(){


        this.tasks=[];


        this.resources=[];


        this.plans=[];


        this.memory=[];


    }





    /**
     * Debug
     */
    info(){


        return {


            engine:

                "BRepEngineeringAgentPlanning",


            status:

                "PLANNING_ACTIVE"


        };


    }


}