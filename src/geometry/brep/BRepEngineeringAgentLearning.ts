
export type LearningMode =

    "SUPERVISED"

    |

    "REINFORCEMENT"

    |

    "EXPERIENCE"

    |

    "ADAPTIVE";





export interface AgentExperience {


    id:string;


    agent:string;


    task:string;


    action:string;


    result:any;


    reward:number;


    success:boolean;


}





export interface AgentPerformance {


    agent:string;


    successRate:number;


    averageReward:number;


    improvements:string[];


}





export interface LearningUpdate {


    knowledge:string;


    change:string;


    confidence:number;


}





export class BRepEngineeringAgentLearning {



    experiences:AgentExperience[];


    performance:AgentPerformance[];


    knowledge:any[];


    updates:LearningUpdate[];


    mode:LearningMode;





    constructor(){



        this.experiences=[];


        this.performance=[];


        this.knowledge=[];


        this.updates=[];


        this.mode=

            "ADAPTIVE";


    }





    /**
     * Öğrenme modu
     */
    setMode(

        mode:LearningMode

    ){



        this.mode=

            mode;


    }





    /**
     * Deneyim kaydetme
     */
    recordExperience(

        experience:AgentExperience

    ){



        this.experiences.push(

            experience

        );



        return experience;


    }





    /**
     * Execution sonucundan öğrenme
     */
    learnFromExecution(

        execution:any

    ){



        const experience={


            id:

                crypto.randomUUID(),


            agent:

                execution.agent || "UNKNOWN",


            task:

                execution.task,


            action:

                execution.action,


            result:

                execution.output,


            reward:

                execution.success

                    ?

                1

                    :

                0,


            success:

                execution.success


        };



        return this.recordExperience(

            experience

        );


    }





    /**
     * Ödül hesaplama
     */
    calculateReward(

        success:boolean,

        quality:number

    ){



        return success

            ?

            quality

            :

            -quality;


    }





    /**
     * Performans analizi
     */
    analyzePerformance(

        agent:string

    ):AgentPerformance {



        const data=

            this.experiences.filter(

                e=>

                e.agent===agent

            );



        const success=

            data.filter(

                e=>

                e.success

            );



        const reward=

            data.reduce(

                (

                    sum,

                    e

                )=>

                sum+e.reward,

                0

            );



        const result={


            agent,


            successRate:

                success.length /

                Math.max(

                    data.length,

                    1

                ),


            averageReward:

                reward /

                Math.max(

                    data.length,

                    1

                ),


            improvements:[


                "Increase simulation accuracy",


                "Optimize decision confidence"


            ]


        };



        this.performance.push(

            result

        );



        return result;


    }





    /**
     * Pattern keşfi
     */
    extractPatterns(){



        return {


            patterns:[


                "Successful geometry optimization",


                "Failure recovery strategy",


                "High confidence design patterns"


            ],


            count:

                this.experiences.length


        };


    }





    /**
     * Bilgi güncelleme
     */
    updateKnowledge(

        knowledge:string,

        change:string

    ){



        const update={


            knowledge,


            change,


            confidence:

                0.94


        };



        this.updates.push(

            update

        );



        this.knowledge.push(

            update

        );



        return update;


    }





    /**
     * Ajan davranış adaptasyonu
     */
    adaptAgent(

        agent:string

    ){



        return {


            agent,


            adaptation:


                "Improved decision policy",


            confidence:

                0.93


        };


    }





    /**
     * Reinforcement loop
     */
    reinforcementLoop(){



        const reward=

            this.experiences.reduce(

                (

                    total,

                    e

                )=>

                total + e.reward,

                0

            );



        return {


            totalReward:

                reward,


            improvement:

                reward > 0


                    ?

                "Policy strengthened"


                    :

                "Policy adjusted"


        };


    }





    /**
     * En iyi deneyimleri seçme
     */
    bestExperiences(){



        return this.experiences.sort(

            (

                a,

                b

            )=>

            b.reward -

            a.reward

        ).slice(

            0,

            10

        );


    }





    /**
     * Bilgi paylaşımı
     */
    shareLearning(){



        return {


            shared:

                true,


            agents:

                [

                    "CAD_AGENT",

                    "CAE_AGENT",

                    "CAM_AGENT",

                    "OPT_AGENT"

                ]


        };


    }





    /**
     * Öğrenme döngüsü
     */
    evolve(){



        const patterns=

            this.extractPatterns();



        const reinforcement=

            this.reinforcementLoop();



        return {


            patterns,


            reinforcement,


            evolved:true


        };


    }





    /**
     * Durum
     */
    status(){



        return {


            mode:

                this.mode,


            experiences:

                this.experiences.length,


            knowledge:

                this.knowledge.length,


            updates:

                this.updates.length


        };


    }





    /**
     * Reset
     */
    reset(){


        this.experiences=[];


        this.performance=[];


        this.knowledge=[];


        this.updates=[];


    }





    /**
     * Debug
     */
    info(){


        return {


            engine:

                "BRepEngineeringAgentLearning",


            status:

                "SELF_LEARNING_ACTIVE"


        };


    }


}